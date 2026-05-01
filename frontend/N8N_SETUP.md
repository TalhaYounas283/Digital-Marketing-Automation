# n8n Setup Guide — AutoMarketer AI (Free LLM via Groq)

This guide gets the AutoMarketer frontend talking to a real LLM (**Llama 3.3 70B via Groq — free**) through n8n. It uses [n8n-workflow.json](n8n-workflow.json).

## Why Groq?

- **Free** API tier (no credit card)
- **Fast** — Llama 3.3 70B replies in under 1 second
- **OpenAI-compatible** — works with any standard chat completions client
- Supports **JSON mode** for structured outputs

## Architecture

```
React Frontend
   │  POST {action, ...payload}
   ▼
http://localhost:5678/webhook/automarketer    ← n8n
   │
   ▼  Build LLM Prompt (per action)
   ▼  Call Groq /openai/v1/chat/completions
   ▼  Parse JSON / plain text response
   ▼
JSON response back to frontend
```

## 1. Get a free Groq API key

1. Visit https://console.groq.com/keys
2. Sign in with Google (no credit card needed)
3. Click **Create API Key** → copy it (starts with `gsk_...`)

## 2. Install and run n8n

```bash
npx n8n
```

Open http://localhost:5678 and create your owner account on first run.

## 3. Create the Groq credential in n8n

1. **Credentials** → **New** → search for "Header Auth"
2. Pick **Header Auth**
3. Fill in:
   - **Name:** `Groq Bearer Token`
   - **Header Name:** `Authorization`
   - **Header Value:** `Bearer gsk_YOUR_GROQ_KEY_HERE`
4. **Save**

## 4. Import the workflow

1. **Workflows** → **Import from File**
2. Select [n8n-workflow.json](n8n-workflow.json)
3. Open the workflow
4. Click the **"Groq (Llama 3.3 70B)"** node
5. Under **Credential for Header Auth**, pick the credential you created in step 3
6. **Save**

## 5. Activate the webhook

Toggle **Active** in the workflow editor (top-right). The webhook is now live at:

```
http://localhost:5678/webhook/automarketer
```

## 6. Switch the frontend to live mode

Edit `.env`:

```bash
VITE_USE_MOCKS=false
```

Restart `npm run dev`. The frontend will now POST every AI request to n8n → Groq.

---

## API Contract — what the workflow handles

| `action` | Payload fields | Returns |
|---|---|---|
| `generate_copy` | `topic, platform, tone, audience` | `string[]` (3 post drafts) |
| `generate_strategy` | `productName, goal` | `CampaignStrategy` object |
| `analyze_lead` | `name, source, interactions` | `{ score: number, reason: string }` |
| `analyze_competitor` | `competitorName, industry` | `SwotAnalysis` object |
| `optimize_content` | `originalText, goal` | `OptimizationResult` object |
| `generate_persona` | `productName, industry, region` | `Persona` object |
| `generate_seo` | `topic, niche` | `SeoResult` object |
| `chat_response` | `message, context?` | plain `string` |

All shapes match `src/types/index.ts` exactly so the frontend doesn't need any changes.

## Test it manually

While n8n is running:

```bash
curl -X POST http://localhost:5678/webhook/automarketer \
  -H "Content-Type: application/json" \
  -d '{"action":"chat_response","message":"Suggest 3 hooks for a SaaS launch"}'
```

Should return a plain-text reply within 1 second.

```bash
curl -X POST http://localhost:5678/webhook/automarketer \
  -H "Content-Type: application/json" \
  -d '{"action":"generate_copy","topic":"AI marketing","platform":"LinkedIn","tone":"Professional","audience":"SaaS founders"}'
```

Should return a JSON array of 3 post drafts.

---

## Free Tier Limits (Groq, as of 2026)

- **30 requests / minute** per API key
- **6,000 tokens / minute**
- **14,400 requests / day**

That's plenty for an FYP demo and viva. If you hit a 429 rate-limit, just wait a minute.

## Troubleshooting

**404 on the webhook URL** — Make sure the workflow is **Active** (top-right toggle).

**401 / "Invalid API Key"** — Token wrong or credential not linked to the HTTP node. Recheck step 3 + 4.

**429 Rate Limit** — Wait 60s or upgrade Groq plan. Free is fine for demos.

**"LLM returned non-JSON"** — The model occasionally returns prose instead of JSON. The parser falls back to extracting the first `{...}` block, but if it still fails, tweak the system prompt in the **Build LLM Prompt** node.

**Frontend still shows mock data** — Confirm `VITE_USE_MOCKS=false` and restart Vite. Check DevTools → Network for the POST to `localhost:5678`.

**Image generation** — `generateMarketingImage` in [aiService.ts](src/services/aiService.ts) returns a hardcoded Unsplash URL. To make it real, build a separate workflow that calls a free text-to-image endpoint (e.g. Together.ai's free Flux tier or Hugging Face's free `stabilityai/stable-diffusion-xl-base-1.0`).

---

## Want to switch to a different free LLM?

The workflow is OpenAI-compatible, so changing providers is just:
1. Change the URL in the **Groq (Llama 3.3 70B)** HTTP node
2. Change the `model` name in the **Build LLM Prompt** code node
3. Update the credential to the new provider's API key

| Provider | URL | Sample model | Free tier? |
|---|---|---|---|
| **Groq** (current) | `https://api.groq.com/openai/v1/chat/completions` | `llama-3.3-70b-versatile` | ✅ |
| **Google Gemini** | `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions` | `gemini-2.0-flash` | ✅ |
| **OpenRouter** | `https://openrouter.ai/api/v1/chat/completions` | `meta-llama/llama-3.3-70b-instruct:free` | ✅ |
| **Cerebras** | `https://api.cerebras.ai/v1/chat/completions` | `llama-3.3-70b` | ✅ |
| OpenAI | `https://api.openai.com/v1/chat/completions` | `gpt-4o-mini` | ❌ paid |
