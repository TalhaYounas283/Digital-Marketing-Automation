# Product Requirements Document (PRD)

# AutoMarketer AI - AI-Powered Marketing Automation Platform

---

## Document Information

| Field            | Value                |
| ---------------- | -------------------- |
| **Product Name** | AutoMarketer AI      |
| **Version**      | 1.0                  |
| **Date**         | January 27, 2026     |
| **Author**       | FYP Development Team |
| **Status**       | Active Development   |

---

## 1. Executive Summary

### 1.1 Product Overview

AutoMarketer AI is a comprehensive AI-powered marketing automation platform designed to help businesses streamline their marketing operations. The platform leverages Google Gemini AI and n8n workflow automation to provide intelligent content generation, lead management, competitor analysis, campaign planning, and multi-channel scheduling capabilities.

### 1.2 Vision Statement

To empower marketers of all skill levels with AI-driven tools that automate repetitive tasks, generate high-quality content, and provide actionable insights—reducing marketing effort by 70% while improving campaign performance.

### 1.3 Target Users

- **Primary**: Marketing Managers at SMBs (50-500 employees)
- **Secondary**: Solo entrepreneurs, startup founders, digital marketing agencies
- **Tertiary**: CMOs seeking to augment their team's capabilities

---

## 2. Problem Statement

### 2.1 Current Pain Points

1. **Time-Consuming Content Creation**: Marketers spend 10+ hours/week creating social media content
2. **Inconsistent Brand Voice**: Multiple team members create content with varying quality and tone
3. **Manual Lead Scoring**: Leads are evaluated subjectively, missing high-value opportunities
4. **Reactive Competitor Tracking**: No systematic way to monitor and respond to competitor activities
5. **Fragmented Tools**: Using 5-7 different tools for marketing tasks increases complexity
6. **Scheduling Inefficiency**: Optimal posting times vary by platform and audience

### 2.2 Market Opportunity

- Global marketing automation market: $8.4B (2025), projected $15.2B by 2030
- 75% of marketers say AI tools have improved their productivity
- SMBs represent 60% of potential market but lack enterprise-grade tools

---

## 3. Product Goals & Success Metrics

### 3.1 Business Goals

| Goal | Description                               | Timeline |
| ---- | ----------------------------------------- | -------- |
| G1   | Launch MVP with core features             | Q1 2026  |
| G2   | Onboard 1,000 beta users                  | Q2 2026  |
| G3   | Achieve 40% monthly active user retention | Q3 2026  |
| G4   | Integrate with 5+ external platforms      | Q4 2026  |

### 3.2 Key Performance Indicators (KPIs)

| Metric                    | Target                      | Measurement        |
| ------------------------- | --------------------------- | ------------------ |
| Content Generation Time   | < 30 seconds                | API response time  |
| User Task Completion Rate | > 85%                       | Analytics tracking |
| Lead Scoring Accuracy     | > 80% match with conversion | A/B testing        |
| Daily Active Users (DAU)  | 500+                        | User analytics     |
| Net Promoter Score (NPS)  | > 50                        | User surveys       |
| Content Engagement Lift   | +25% vs manual              | Campaign metrics   |

---

## 4. Feature Requirements

### 4.1 Core Features (MVP)

#### 4.1.1 Dashboard

| ID      | Requirement                                                       | Priority | Status      |
| ------- | ----------------------------------------------------------------- | -------- | ----------- |
| DASH-01 | Display key marketing metrics (impressions, clicks, CTR, revenue) | P0       | ✅ Complete |
| DASH-02 | Show engagement trends via interactive charts                     | P0       | ✅ Complete |
| DASH-03 | Quick-action cards for common tasks                               | P1       | ✅ Complete |
| DASH-04 | Recent activity feed                                              | P1       | ✅ Complete |
| DASH-05 | Real-time metric updates                                          | P2       | 🔄 Planned  |

#### 4.1.2 Content Generator

| ID    | Requirement                                                                          | Priority | Status         |
| ----- | ------------------------------------------------------------------------------------ | -------- | -------------- |
| CG-01 | Generate social media posts for 4 platforms (Twitter, LinkedIn, Instagram, Facebook) | P0       | ✅ Complete    |
| CG-02 | Support 5 tone options (Professional, Casual, Humorous, Urgent, Inspirational)       | P0       | ✅ Complete    |
| CG-03 | Target audience customization                                                        | P0       | ✅ Complete    |
| CG-04 | Generate 3 content variations per request                                            | P0       | ✅ Complete    |
| CG-05 | AI-generated image prompts                                                           | P1       | ✅ Complete    |
| CG-06 | Content optimization suggestions                                                     | P1       | ✅ Complete    |
| CG-07 | Hashtag recommendations                                                              | P0       | ✅ Complete    |
| CG-08 | Best posting time suggestions                                                        | P1       | ✅ Complete    |
| CG-09 | Save content to drafts                                                               | P1       | 🔄 In Progress |
| CG-10 | Direct publish to social platforms                                                   | P2       | 📋 Backlog     |

#### 4.1.3 Lead Management

| ID    | Requirement                                                 | Priority | Status      |
| ----- | ----------------------------------------------------------- | -------- | ----------- |
| LM-01 | Lead database with CRUD operations                          | P0       | ✅ Complete |
| LM-02 | AI-powered lead scoring (0-100)                             | P0       | ✅ Complete |
| LM-03 | Lead status tracking (New, Contacted, Qualified, Converted) | P0       | ✅ Complete |
| LM-04 | Lead source attribution                                     | P1       | ✅ Complete |
| LM-05 | AI analysis per lead                                        | P1       | ✅ Complete |
| LM-06 | Bulk import/export (CSV)                                    | P2       | 📋 Backlog  |
| LM-07 | Lead assignment rules                                       | P2       | 📋 Backlog  |

#### 4.1.4 Competitor Analysis

| ID    | Requirement                                | Priority | Status      |
| ----- | ------------------------------------------ | -------- | ----------- |
| CA-01 | SWOT analysis generation                   | P0       | ✅ Complete |
| CA-02 | Strengths identification with evidence     | P0       | ✅ Complete |
| CA-03 | Weaknesses with exploitation opportunities | P0       | ✅ Complete |
| CA-04 | Market opportunities analysis              | P1       | ✅ Complete |
| CA-05 | Threat assessment with mitigations         | P1       | ✅ Complete |
| CA-06 | Strategic recommendations                  | P0       | ✅ Complete |
| CA-07 | Action items with priorities & timelines   | P1       | ✅ Complete |
| CA-08 | Competitor tracking history                | P2       | 📋 Backlog  |

#### 4.1.5 Campaign Manager

| ID    | Requirement                             | Priority | Status      |
| ----- | --------------------------------------- | -------- | ----------- |
| CM-01 | Campaign creation wizard                | P0       | ✅ Complete |
| CM-02 | AI-generated campaign strategy          | P0       | ✅ Complete |
| CM-03 | Target audience definition              | P0       | ✅ Complete |
| CM-04 | Content calendar generation             | P1       | ✅ Complete |
| CM-05 | Channel strategy with budget allocation | P1       | ✅ Complete |
| CM-06 | KPI tracking setup                      | P1       | ✅ Complete |
| CM-07 | Campaign status management              | P0       | ✅ Complete |
| CM-08 | Multi-week planning                     | P1       | ✅ Complete |

#### 4.1.6 Audience Builder

| ID    | Requirement                      | Priority | Status      |
| ----- | -------------------------------- | -------- | ----------- |
| AB-01 | AI persona generation            | P0       | ✅ Complete |
| AB-02 | Demographic profiling            | P0       | ✅ Complete |
| AB-03 | Professional background analysis | P1       | ✅ Complete |
| AB-04 | Goals & challenges mapping       | P0       | ✅ Complete |
| AB-05 | Buying behavior insights         | P1       | ✅ Complete |
| AB-06 | Content preferences              | P1       | ✅ Complete |
| AB-07 | Objection handling guide         | P1       | ✅ Complete |
| AB-08 | Messaging recommendations        | P0       | ✅ Complete |

#### 4.1.7 Scheduler

| ID    | Requirement                           | Priority | Status         |
| ----- | ------------------------------------- | -------- | -------------- |
| SC-01 | Visual calendar interface             | P0       | ✅ Complete    |
| SC-02 | AI-optimized posting time suggestions | P0       | ✅ Complete    |
| SC-03 | Multi-platform scheduling             | P1       | 🔄 In Progress |
| SC-04 | Weekly theme recommendations          | P1       | ✅ Complete    |
| SC-05 | Content mix optimization              | P1       | ✅ Complete    |
| SC-06 | Peak engagement window analysis       | P1       | ✅ Complete    |
| SC-07 | Timezone support                      | P1       | ✅ Complete    |

#### 4.1.8 Email Marketing

| ID    | Requirement                                                 | Priority | Status      |
| ----- | ----------------------------------------------------------- | -------- | ----------- |
| EM-01 | Email campaign creation                                     | P0       | ✅ Complete |
| EM-02 | AI-generated email sequences                                | P0       | ✅ Complete |
| EM-03 | Subject line A/B variants                                   | P1       | ✅ Complete |
| EM-04 | Send timing optimization                                    | P1       | ✅ Complete |
| EM-05 | Email type templates (Welcome, Launch, Re-engagement, etc.) | P0       | ✅ Complete |
| EM-06 | Personalization merge tags                                  | P1       | ✅ Complete |
| EM-07 | Expected metrics prediction                                 | P2       | ✅ Complete |
| EM-08 | Automation triggers                                         | P2       | 🔄 Planned  |

#### 4.1.9 Analytics

| ID    | Requirement                  | Priority | Status         |
| ----- | ---------------------------- | -------- | -------------- |
| AN-01 | Campaign performance metrics | P0       | ✅ Complete    |
| AN-02 | Content engagement analytics | P1       | ✅ Complete    |
| AN-03 | Lead conversion funnel       | P1       | 🔄 In Progress |
| AN-04 | ROI calculations             | P2       | 📋 Backlog     |
| AN-05 | Export reports               | P2       | 📋 Backlog     |

### 4.2 n8n Workflow Automation (Backend)

| ID     | Task Type               | Description                                             | Status      |
| ------ | ----------------------- | ------------------------------------------------------- | ----------- |
| N8N-01 | `content_generation`    | Generate platform-optimized social media posts          | ✅ Complete |
| N8N-02 | `lead_scoring`          | Score leads based on conversion criteria (0-100)        | ✅ Complete |
| N8N-03 | `competitor_analysis`   | Generate SWOT analysis with strategic recommendations   | ✅ Complete |
| N8N-04 | `campaign_strategy`     | Create comprehensive campaign plans                     | ✅ Complete |
| N8N-05 | `audience_persona`      | Build detailed buyer personas                           | ✅ Complete |
| N8N-06 | `content_optimizer`     | Improve existing content (engaging, grammar, SEO, etc.) | ✅ Complete |
| N8N-07 | `email_campaign`        | Generate email sequences with A/B variants              | ✅ Complete |
| N8N-08 | `schedule_optimization` | Recommend optimal posting schedules                     | ✅ Complete |

---

## 5. Technical Architecture

### 5.1 Technology Stack

| Layer           | Technology    | Version          |
| --------------- | ------------- | ---------------- |
| **Frontend**    | React         | 19.x             |
| **Language**    | TypeScript    | 5.8.x            |
| **Build Tool**  | Vite          | 6.x              |
| **Routing**     | React Router  | 7.x              |
| **Styling**     | Tailwind CSS  | 3.x (CDN)        |
| **Charts**      | Recharts      | 3.6.x            |
| **Icons**       | Lucide React  | Latest           |
| **AI Provider** | Google Gemini | gemini-1.5-flash |
| **Automation**  | n8n           | Latest           |
| **AI Backend**  | OpenAI GPT-4o | via n8n          |

### 5.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐   │
│  │Dashboard │ Content  │  Leads   │ Campaign │  Analytics   │   │
│  │          │Generator │ Manager  │ Manager  │              │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘   │
│                              │                                    │
│                   ┌──────────▼──────────┐                        │
│                   │   Service Layer      │                        │
│                   │ (geminiService.ts)   │                        │
│                   │ (n8nService.ts)      │                        │
│                   └──────────┬──────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │     n8n Webhook      │
                    │   /automarketer      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │ Content Gen    │ │ Lead Score  │ │ Competitor  │
    │ (GPT-4o)       │ │ (GPT-4o)    │ │ (GPT-4o)    │
    └────────────────┘ └─────────────┘ └─────────────┘
```

### 5.3 API Specifications

#### Webhook Endpoint

```
POST https://{n8n-domain}/webhook/automarketer
Content-Type: application/json
```

#### Request Format

```json
{
  "task_type": "content_generation | lead_scoring | competitor_analysis | ...",
  "input_data": {
    // Task-specific parameters
  }
}
```

#### Response Format

```json
{
  "success": true,
  "task": "content_generation",
  "timestamp": "2026-01-27T10:30:00.000Z",
  "result": {
    /* Task-specific result */
  },
  "metadata": {
    "model": "gpt-4o",
    "version": "2.0",
    "processedAt": 1737974000000
  }
}
```

---

## 6. User Stories

### 6.1 Content Generation

| ID    | As a...           | I want to...                               | So that...                                | Acceptance Criteria                         |
| ----- | ----------------- | ------------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| US-01 | Marketing Manager | Generate social media posts with one click | I save 2+ hours daily on content creation | Posts generated in <30s, platform-optimized |
| US-02 | Marketing Manager | Choose content tone                        | Posts match my brand voice                | 5 tone options available                    |
| US-03 | Marketing Manager | Get hashtag suggestions                    | I maximize post reach                     | 2-12 relevant hashtags per platform         |

### 6.2 Lead Management

| ID    | As a...   | I want to...                 | So that...                        | Acceptance Criteria          |
| ----- | --------- | ---------------------------- | --------------------------------- | ---------------------------- |
| US-04 | Sales Rep | See AI-scored leads          | I prioritize high-value prospects | Leads scored 0-100 with tier |
| US-05 | Sales Rep | Get recommended next actions | I know exactly what to do         | Actions provided per lead    |

### 6.3 Campaign Planning

| ID    | As a...           | I want to...                          | So that...                       | Acceptance Criteria                        |
| ----- | ----------------- | ------------------------------------- | -------------------------------- | ------------------------------------------ |
| US-06 | Marketing Manager | Generate campaign strategies          | I have a complete execution plan | Strategy includes calendar, channels, KPIs |
| US-07 | CMO               | See budget allocation recommendations | I optimize marketing spend       | Percentage breakdown by channel            |

### 6.4 Competitor Intelligence

| ID    | As a...           | I want to...                  | So that...                   | Acceptance Criteria                  |
| ----- | ----------------- | ----------------------------- | ---------------------------- | ------------------------------------ |
| US-08 | Marketing Manager | Analyze competitors           | I understand market position | SWOT analysis with action items      |
| US-09 | CMO               | Get strategic recommendations | I make informed decisions    | Prioritized recommendations provided |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Requirement         | Target       |
| ------------------- | ------------ |
| Page Load Time      | < 2 seconds  |
| AI Response Time    | < 30 seconds |
| Time to Interactive | < 3 seconds  |
| Concurrent Users    | 1,000+       |

### 7.2 Security

| Requirement        | Implementation                 |
| ------------------ | ------------------------------ |
| Authentication     | JWT-based auth via AuthContext |
| API Security       | HTTPS only, API key protection |
| Data Privacy       | No PII stored in AI prompts    |
| Credential Storage | Environment variables          |

### 7.3 Scalability

| Requirement       | Target                               |
| ----------------- | ------------------------------------ |
| Database          | Stateless frontend, backend-agnostic |
| API Rate Limiting | Handled by n8n/OpenAI                |
| CDN               | Tailwind via CDN                     |

### 7.4 Accessibility

| Requirement         | Standard     |
| ------------------- | ------------ |
| WCAG Compliance     | Level AA     |
| Keyboard Navigation | Full support |
| Screen Reader       | ARIA labels  |

---

## 8. Design Requirements

### 8.1 UI Theme

- **Style**: Clean, minimal, professional
- **Color Palette**:
  - Primary: Slate (text, borders)
  - Accent: Violet (CTAs, highlights)
  - Success: Emerald
  - Warning: Amber
  - Error: Rose
- **Background**: Light theme (bg-slate-100)
- **Components**: Glass-panel sidebar, minimal-card content areas

### 8.2 Responsive Design

| Breakpoint          | Layout                           |
| ------------------- | -------------------------------- |
| Mobile (<768px)     | Single column, collapsed sidebar |
| Tablet (768-1024px) | Responsive grid                  |
| Desktop (>1024px)   | Full sidebar, multi-column       |

---

## 9. Dependencies & Integrations

### 9.1 External Dependencies

| Service          | Purpose             | Status        |
| ---------------- | ------------------- | ------------- |
| Google Gemini AI | Content generation  | ✅ Integrated |
| OpenAI GPT-4o    | n8n AI tasks        | ✅ Integrated |
| n8n              | Workflow automation | ✅ Integrated |

### 9.2 Future Integrations (Roadmap)

| Platform         | Type              | Priority | Timeline |
| ---------------- | ----------------- | -------- | -------- |
| Twitter/X        | Social Publishing | P1       | Q2 2026  |
| LinkedIn         | Social Publishing | P1       | Q2 2026  |
| HubSpot          | CRM Sync          | P2       | Q3 2026  |
| Mailchimp        | Email Marketing   | P2       | Q3 2026  |
| Google Analytics | Analytics         | P1       | Q2 2026  |
| Slack            | Notifications     | P3       | Q4 2026  |

---

## 10. Release Plan

### 10.1 MVP (v1.0) - Q1 2026

- ✅ Dashboard with metrics
- ✅ Content Generator (all platforms)
- ✅ Lead Management with AI scoring
- ✅ Competitor Analysis (SWOT)
- ✅ Campaign Manager
- ✅ Audience Builder
- ✅ Scheduler
- ✅ Email Marketing
- ✅ n8n Backend Integration

### 10.2 v1.1 - Q2 2026

- 📋 Direct social media publishing
- 📋 Enhanced analytics dashboard
- 📋 Lead import/export
- 📋 Multi-user support

### 10.3 v1.2 - Q3 2026

- 📋 CRM integrations (HubSpot, Salesforce)
- 📋 Advanced A/B testing
- 📋 Custom AI model training
- 📋 White-label options

---

## 11. Risks & Mitigations

| Risk                                | Probability | Impact | Mitigation                                      |
| ----------------------------------- | ----------- | ------ | ----------------------------------------------- |
| AI API rate limits                  | Medium      | High   | Implement request queuing, fallback to mocks    |
| OpenAI/Gemini pricing changes       | Medium      | Medium | Abstract AI provider, support multiple backends |
| Competitor launches similar product | High        | Medium | Focus on UX, speed to market                    |
| n8n downtime                        | Low         | High   | Implement direct API fallback                   |
| User adoption slower than expected  | Medium      | High   | Free tier, extensive documentation              |

---

## 12. Appendix

### A. Glossary

| Term     | Definition                                    |
| -------- | --------------------------------------------- |
| **MQL**  | Marketing Qualified Lead                      |
| **CTR**  | Click-Through Rate                            |
| **SWOT** | Strengths, Weaknesses, Opportunities, Threats |
| **CTA**  | Call to Action                                |
| **n8n**  | Open-source workflow automation tool          |

### B. References

- [n8n Documentation](https://docs.n8n.io)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Google Gemini Documentation](https://ai.google.dev/docs)
- [React Documentation](https://react.dev)

### C. Change Log

| Version | Date       | Author   | Changes              |
| ------- | ---------- | -------- | -------------------- |
| 1.0     | 2026-01-27 | FYP Team | Initial PRD creation |

---

_Document Status: Active | Last Updated: January 27, 2026_
