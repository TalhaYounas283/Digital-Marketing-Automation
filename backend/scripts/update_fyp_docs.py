#!/usr/bin/env python3
"""Update the AutoMarketer FYP .docx files to reflect the NestJS backend.

Pure stdlib. A .docx is a zip whose word/document.xml holds the body. We:

1. Walk every <w:p> paragraph, collect its plain text from <w:t> runs.
2. If the text matches a known stale claim (n8n-only backend, localStorage auth,
   "no Node.js + database backend"), rewrite that paragraph with the new claim.
3. Append a clearly labelled "Backend Architecture Update — NestJS Edition"
   section before </w:body> covering the new stack, ERD additions, security,
   limitations and presentation talking points.

Run:
    python3 backend/scripts/update_fyp_docs.py [--dry-run]
"""

from __future__ import annotations

import argparse
import io
import os
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile
from typing import Iterable, List, Tuple

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", W_NS)
W = "{%s}" % W_NS

# Targets: substrings that, when found in a paragraph's plain text, mark that
# paragraph as stale. Each entry is (substring, replacement_text).
REPLACEMENTS: List[Tuple[str, str]] = [
    # Generic n8n-only backend description
    (
        "single-page React application that talks to an n8n workflow",
        "single-page React application that talks to a NestJS REST/WebSocket backend (Node.js + TypeScript + PostgreSQL via TypeORM). The NestJS backend, in turn, calls a self-hosted n8n workflow as the primary AI orchestrator, with Hugging Face Inference API as an optional fallback provider.",
    ),
    (
        "n8n workflow (backend)",
        "NestJS backend (Node.js + TypeScript) which orchestrates n8n workflows for AI tasks",
    ),
    (
        "delegated to self-hosted n8n instance over secure webhooks",
        "served by a NestJS application that owns authentication, persistence, and business logic. AI requests are forwarded by the NestJS AiService to n8n (mandatory) with Hugging Face as an optional fallback provider.",
    ),
    (
        "n8n internal data store",
        "PostgreSQL database (managed by TypeORM with versioned migrations)",
    ),
    (
        "browser localStorage for demo persistence",
        "PostgreSQL via TypeORM as the primary persistence layer; browser localStorage is used only to cache the active JWT and lightweight UI preferences",
    ),
    (
        "JWT-style mock token in localStorage",
        "real JWT access token (15 min) plus refresh token (7 days) issued by the NestJS AuthModule, with bcrypt-hashed passwords and role-aware guards on every controller",
    ),
    (
        "no real authentication backend",
        "real authentication backend implemented in NestJS (JWT access + refresh, bcrypt password hashing, refresh-token rotation, role guard)",
    ),
    (
        "Frontend-only persistence",
        "Server-side persistence via PostgreSQL (managed by TypeORM with versioned migrations under backend/src/database/migrations/); the browser only caches JWT tokens and UI preferences",
    ),
    (
        "Add a Node.js + PostgreSQL (or Firebase) backend for real user accounts",
        "[Delivered] NestJS + PostgreSQL backend with real user accounts, refresh-token rotation and per-user data isolation is now implemented under /backend.",
    ),
    (
        "in production would need JWT, OAuth and user database",
        "production-grade JWT access/refresh, bcrypt-hashed passwords, role guards and a PostgreSQL user database are now implemented in the NestJS AuthModule.",
    ),
    (
        "responses cached for two minutes",
        "responses are not cached client-side; the NestJS AiService logs every generation to a generated_contents table for auditability.",
    ),
]

ADDENDUM_PARAGRAPHS = [
    ("heading", "Backend Architecture Update — NestJS Edition (2026)"),
    (
        "body",
        "This addendum supersedes any earlier statement that this project ships only a frontend with an n8n workflow as its backend. A full NestJS server now sits between the React frontend and the AI/automation layer. The architecture is now four-tier rather than three-tier.",
    ),
    ("heading", "8.1 Updated Architecture"),
    (
        "body",
        "Tier 1 — Presentation: React 19 + Vite + TypeScript single-page application served on port 5173. Talks only to the NestJS API and to the NestJS WebSocket gateway. No browser-side mock fallback remains.",
    ),
    (
        "body",
        "Tier 2 — Application: NestJS 10 (Node.js + TypeScript) on port 3000. Provides the /api/v1 REST surface, /ws WebSocket gateway, JWT-based auth, role guards, validation, and a Swagger explorer at /api/docs.",
    ),
    (
        "body",
        "Tier 3 — Data: PostgreSQL 16 accessed through TypeORM 0.3 with versioned migrations. All user-owned tables are scoped by userId and indexed accordingly.",
    ),
    (
        "body",
        "Tier 4 — AI / Automation: A self-hosted n8n instance is the primary, mandatory AI provider — the NestJS AiService POSTs the same {action, payload} contract that the original frontend used directly, so existing n8n workflows continue to work unchanged. Hugging Face Inference API is an optional secondary provider that takes over only when AI_HF_FALLBACK_ENABLED=true and n8n is unreachable.",
    ),
    ("heading", "8.2 NestJS Module Map"),
    (
        "body",
        "The backend is split into focused modules: AuthModule, UsersModule, CampaignsModule, LeadsModule, EmailCampaignsModule, TemplatesModule, CalendarModule, WorkflowsModule, SocialAccountsModule, AiModule, SentimentModule, InsightsModule, AnalyticsModule, and the RealtimeGateway. Every module exposes its DTOs through Swagger and is guarded by a global JwtAuthGuard except for /auth/* endpoints and the health probe.",
    ),
    ("heading", "8.3 Updated Database Schema"),
    (
        "body",
        "The InitialSchema migration creates: users, refresh_tokens, campaigns, leads, email_campaigns, templates (with isSystem flag for shared templates), scheduled_posts, automation_workflows, social_accounts, generated_contents (audit log of every AI call), sentiment_records, recommendations, and analytics_snapshots. All tables use uuid primary keys, createdAt/updatedAt timestamps, and per-user indexes.",
    ),
    ("heading", "8.4 Authentication and Security"),
    (
        "body",
        "Passwords are hashed with bcrypt at cost 10. Access tokens (15 min) and refresh tokens (7 days) are signed with separate secrets. Refresh tokens are persisted as SHA-256 hashes and rotated on each refresh — replay of a previously used token is rejected. CORS is locked to the configured frontend origin, and class-validator enforces DTO shape on every endpoint. The Joi config schema rejects boot if N8N_WEBHOOK_URL or any JWT secret is missing.",
    ),
    ("heading", "8.5 Real-time Layer"),
    (
        "body",
        "The /ws gateway uses raw WebSockets (the same protocol the frontend already speaks) and authenticates via ?token=<JWT> in the connect URL. On accept, the gateway pushes an immediate kpi_update to the client and then broadcasts kpi_update messages every 5 seconds (configurable via WS_KPI_TICK_MS). On relevant DB events the gateway also pushes activity_update messages.",
    ),
    ("heading", "8.6 AI Integration: n8n First, Hugging Face Optional"),
    (
        "body",
        "Every endpoint under /api/v1/ai/* (generate-copy, generate-strategy, optimize-content, generate-seo, analyze-competitor, generate-persona, generate-image, chat, analyze-lead) and the sentiment + lead-scoring features call AiService.runAction(action, payload). The service first POSTs to N8N_WEBHOOK_URL with the original {action, payload} contract; if n8n responds with an error and AI_HF_FALLBACK_ENABLED is true, it retries the call against the configured Hugging Face Inference API model and parses the response into the typed shapes used by the frontend (CampaignStrategy, SwotAnalysis, Persona, SeoResult, OptimizationResult). All AI outputs are persisted to generated_contents for auditability. There is no silent mock fallback — failures surface to the user as a clean toast.",
    ),
    ("heading", "8.7 Frontend Integration Changes"),
    (
        "body",
        "frontend/src/services/apiClient.ts — new Bearer-token fetch wrapper with automatic 401 → refresh-token retry. frontend/src/services/aiService.ts — rewritten to call /api/v1/ai/* endpoints, no mocks. frontend/src/services/websocketService.ts — rewritten to authenticate via ?token=, no mock KPI generator. frontend/src/contexts/AuthContext.tsx — register/login/refresh/logout now call the real API. New per-domain API services: campaignsApi, leadsApi, emailCampaignsApi, templatesApi, calendarApi, workflowsApi, insightsApi, sentimentApi, analyticsApi, socialAccountsApi, usersApi. Every feature page (Campaigns, Leads, Email, Templates, Calendar, Workflows, Insights, Sentiment, Settings → Social Connections, Profile) now reads from and writes to PostgreSQL via the backend.",
    ),
    ("heading", "8.8 Limitations Update"),
    (
        "body",
        "Replaces previous Chapter 7.4 limitations that referenced 'no real authentication backend', 'frontend-only persistence', and 'no Node.js + database backend' — these are now delivered. Current honest limitations: live AI features require a running n8n instance reachable from the NestJS backend; Hugging Face fallback (when enabled) shares HF free-tier rate limits; analytics aggregation runs on demand rather than as a continuous pipeline; OAuth flows for social platforms are stubbed for FYP demo and return mock auth URLs.",
    ),
    ("heading", "8.9 Presentation Talking Points"),
    (
        "body",
        "1) Show npm run build success in /backend. 2) Spin up postgres via docker compose up -d postgres, then run migrations and seed. 3) Open http://localhost:3000/api/docs and demonstrate the live Swagger surface. 4) Register a fresh user, log in, click through Campaigns / Leads / Templates / Calendar / Workflows / Insights — every list reads from PostgreSQL. 5) Open the Content Studio and generate a marketing post live; explain that the request goes browser → NestJS → n8n → LLM → back. 6) Toggle AI_HF_FALLBACK_ENABLED=true, stop n8n, retry the same generation; the request now falls back to Hugging Face. 7) Show generated_contents in psql to demonstrate auditability. 8) Stop the backend; refresh the frontend; show that pages surface clean error toasts (no silent fakes), confirming the FYP-grade integrity of the integration.",
    ),
    ("heading", "8.10 Repository Layout (Post-Backend)"),
    (
        "body",
        "/ — root project. /frontend/ — React 19 + Vite (unchanged structure; services and contexts rewritten). /backend/ — new NestJS application: src/main.ts, src/app.module.ts, src/config/, src/common/, src/database/migrations/ + src/database/seeds/, and src/modules/{auth,users,campaigns,leads,email-campaigns,templates,calendar,workflows,social-accounts,ai,sentiment,insights,analytics,realtime}/. docker-compose.yml ships a Postgres 16 service for local development.",
    ),
]


def text_of_paragraph(p: ET.Element) -> str:
    parts: List[str] = []
    for t in p.iter(f"{W}t"):
        if t.text:
            parts.append(t.text)
    return "".join(parts)


def replace_paragraph_text(p: ET.Element, new_text: str) -> None:
    """Strip every run from p, then add a single run carrying new_text."""
    # Preserve the paragraph's own properties (<w:pPr>) if any.
    pPr = p.find(f"{W}pPr")
    for child in list(p):
        if child is pPr:
            continue
        p.remove(child)
    new_r = ET.SubElement(p, f"{W}r")
    new_t = ET.SubElement(new_r, f"{W}t")
    new_t.set(
        "{http://www.w3.org/XML/1998/namespace}space",
        "preserve",
    )
    new_t.text = new_text


def make_paragraph(text: str, *, heading: bool = False) -> ET.Element:
    p = ET.Element(f"{W}p")
    pPr = ET.SubElement(p, f"{W}pPr")
    pStyle = ET.SubElement(pPr, f"{W}pStyle")
    pStyle.set(f"{W}val", "Heading2" if heading else "Normal")
    r = ET.SubElement(p, f"{W}r")
    if heading:
        rPr = ET.SubElement(r, f"{W}rPr")
        b = ET.SubElement(rPr, f"{W}b")
        b.set(f"{W}val", "true")
        sz = ET.SubElement(rPr, f"{W}sz")
        sz.set(f"{W}val", "28")
    t = ET.SubElement(r, f"{W}t")
    t.set(
        "{http://www.w3.org/XML/1998/namespace}space",
        "preserve",
    )
    t.text = text
    return p


def update_doc_xml(xml_bytes: bytes) -> Tuple[bytes, int, int]:
    """Apply targeted replacements + append addendum. Returns (xml, edits, appends)."""
    tree = ET.ElementTree(ET.fromstring(xml_bytes))
    root = tree.getroot()
    body = root.find(f"{W}body")
    if body is None:
        return xml_bytes, 0, 0

    edits = 0
    paragraphs = list(body.iter(f"{W}p"))
    for p in paragraphs:
        text = text_of_paragraph(p)
        if not text.strip():
            continue
        for needle, new_text in REPLACEMENTS:
            if needle in text:
                replace_paragraph_text(p, new_text)
                edits += 1
                break

    # Append the addendum just before sectPr (page settings) if present, else
    # at end of body.
    sectPr = body.find(f"{W}sectPr")
    insert_idx = (
        list(body).index(sectPr) if sectPr is not None else len(list(body))
    )

    appends = 0
    # Spacer
    body.insert(insert_idx, make_paragraph("", heading=False))
    insert_idx += 1
    # Section title
    body.insert(
        insert_idx,
        make_paragraph(
            "Chapter 8 — Backend Architecture Update (NestJS, 2026)",
            heading=True,
        ),
    )
    insert_idx += 1
    appends += 1
    for kind, text in ADDENDUM_PARAGRAPHS:
        body.insert(insert_idx, make_paragraph(text, heading=(kind == "heading")))
        insert_idx += 1
        appends += 1

    out = io.BytesIO()
    out.write(b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n')
    tree.write(out, encoding="utf-8", xml_declaration=False)
    return out.getvalue(), edits, appends


def update_docx(path: str, dry_run: bool = False) -> Tuple[int, int]:
    if not os.path.exists(path):
        print(f"  ! Missing: {path}", file=sys.stderr)
        return 0, 0

    with zipfile.ZipFile(path, "r") as zin:
        names = zin.namelist()
        if "word/document.xml" not in names:
            print(f"  ! No word/document.xml in {path}", file=sys.stderr)
            return 0, 0
        contents = {name: zin.read(name) for name in names}

    new_xml, edits, appends = update_doc_xml(contents["word/document.xml"])
    contents["word/document.xml"] = new_xml

    if dry_run:
        return edits, appends

    backup = path + ".bak"
    if not os.path.exists(backup):
        shutil.copy2(path, backup)

    tmp = path + ".tmp"
    with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in contents.items():
            zout.writestr(name, data)
    os.replace(tmp, path)
    return edits, appends


def main(argv: Iterable[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(list(argv))

    repo_root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), os.pardir, os.pardir)
    )
    targets = [
        os.path.join(repo_root, "frontend", "fyp- project documentation.docx"),
        os.path.join(repo_root, "frontend", "fyp detail.docx"),
    ]

    total_edits = 0
    total_appends = 0
    for t in targets:
        print(f"-> {os.path.basename(t)}")
        edits, appends = update_docx(t, dry_run=args.dry_run)
        print(f"   targeted edits: {edits}")
        print(f"   addendum paragraphs added: {appends}")
        total_edits += edits
        total_appends += appends

    if args.dry_run:
        print(
            "DRY RUN — no files were written. Re-run without --dry-run to apply.",
        )
    else:
        print(f"OK — applied {total_edits} edits and added {total_appends} paragraphs across {len(targets)} files.")

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
