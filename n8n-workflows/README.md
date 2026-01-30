# AutoMarketer AI - n8n Workflow Documentation

## 📁 Workflow Files

### Main Workflow

- **File:** `automarketer-main-workflow.json`
- **Purpose:** Complete marketing automation workflow
- **Import:** n8n → Workflows → Import from File

---

## 🔧 Setup Instructions

### 1. Import Workflow

1. Open n8n (http://localhost:5678)
2. Click **Workflows** → **Import from File**
3. Select `automarketer-main-workflow.json`
4. Click **Import**

### 2. Configure Credentials

1. Go to **Settings** → **Credentials**
2. Add **OpenAI API** credential:
   - Name: `OpenAI API`
   - API Key: Your OpenAI API key
3. Update credential IDs in workflow if needed

### 3. Activate Webhook

1. Open the imported workflow
2. Click the **Webhook** node
3. Copy the webhook URL
4. Click **Activate** (top right)

---

## 🌐 API Endpoints

### Webhook URL

```
POST https://your-n8n-domain/webhook/automarketer
```

### Request Format

```json
{
  "task_type": "content_generation",
  "input_data": {
    // Task-specific data
  }
}
```

---

## 📋 Available Tasks

### 1. Content Generation

**task_type:** `content_generation`

```json
{
  "task_type": "content_generation",
  "input_data": {
    "platform": "LinkedIn",
    "topic": "AI Marketing Automation Benefits",
    "tone": "Professional",
    "audience": "Marketing Managers"
  }
}
```

**Response includes:**

- 3 unique posts with hashtags
- Best posting times
- Engagement tips
- Image generation prompts

---

### 2. Lead Scoring

**task_type:** `lead_scoring`

```json
{
  "task_type": "lead_scoring",
  "input_data": {
    "name": "John Smith",
    "email": "john@company.com",
    "company": "Tech Corp",
    "job_title": "Marketing Director",
    "source": "LinkedIn",
    "interactions": "Downloaded whitepaper, Attended webinar",
    "industry": "SaaS"
  }
}
```

**Response includes:**

- Score (0-100)
- Tier (Hot/Warm/Cold)
- Score breakdown
- Recommended actions
- Estimated deal size

---

### 3. Competitor Analysis

**task_type:** `competitor_analysis`

```json
{
  "task_type": "competitor_analysis",
  "input_data": {
    "competitor_name": "Competitor Inc",
    "industry": "Marketing Automation",
    "our_company": "AutoMarketer AI",
    "context": "Planning Q1 strategy"
  }
}
```

**Response includes:**

- SWOT analysis
- Market position
- Pricing comparison
- Content strategy insights
- Action items

---

### 4. Campaign Strategy

**task_type:** `campaign_strategy`

```json
{
  "task_type": "campaign_strategy",
  "input_data": {
    "product_name": "AutoMarketer Pro",
    "campaign_goal": "Generate 200 MQLs",
    "budget": "$10,000",
    "duration": "4 weeks",
    "target_market": "B2B SaaS companies"
  }
}
```

**Response includes:**

- Campaign name and objectives
- Target audience definition
- Content calendar (weekly)
- Channel strategy with budgets
- KPIs and milestones

---

### 5. Audience Persona

**task_type:** `audience_persona`

```json
{
  "task_type": "audience_persona",
  "input_data": {
    "product_name": "AutoMarketer AI",
    "industry": "B2B Marketing",
    "region": "North America"
  }
}
```

**Response includes:**

- Detailed persona profile
- Demographics & firmographics
- Goals and challenges
- Buying behavior
- Messaging recommendations

---

### 6. Content Optimizer

**task_type:** `content_optimizer`

```json
{
  "task_type": "content_optimizer",
  "input_data": {
    "content": "Your existing content here",
    "goal": "engaging",
    "platform": "LinkedIn",
    "audience": "Marketing professionals"
  }
}
```

**Goals:** `engaging`, `grammar`, `shorten`, `expand`, `seo`

**Response includes:**

- Optimized content
- Change explanations
- Readability metrics
- A/B test versions

---

### 7. Email Campaign

**task_type:** `email_campaign`

```json
{
  "task_type": "email_campaign",
  "input_data": {
    "email_type": "Product Launch",
    "product": "AutoMarketer 2.0",
    "goal": "Drive demo requests",
    "audience": "Trial users",
    "brand_voice": "Professional yet friendly"
  }
}
```

**Email types:** `Welcome`, `Product Launch`, `Re-engagement`, `Abandoned Cart`, `Newsletter`, `Promotional`

**Response includes:**

- Complete email sequence (3+ emails)
- Subject lines (A/B variants)
- Send timing recommendations
- Expected metrics
- Automation triggers

---

### 8. Schedule Optimization

**task_type:** `schedule_optimization`

```json
{
  "task_type": "schedule_optimization",
  "input_data": {
    "platform": "LinkedIn",
    "timezone": "EST",
    "industry": "Technology",
    "engagement_data": "Current: Mon 9am, Wed 2pm, Fri 10am",
    "goal": "Maximize engagement"
  }
}
```

**Response includes:**

- Weekly posting schedule
- Peak engagement windows
- Content mix recommendations
- Times to avoid
- Weekly themes

---

## 🧪 Testing

### Using cURL

```bash
curl -X POST https://your-n8n-domain/webhook/automarketer \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "content_generation",
    "input_data": {
      "platform": "Twitter",
      "topic": "AI tools for marketers",
      "tone": "Casual",
      "audience": "Startup founders"
    }
  }'
```

### Using JavaScript (Frontend Integration)

```javascript
const response = await fetch("https://your-n8n-domain/webhook/automarketer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    task_type: "content_generation",
    input_data: {
      platform: "LinkedIn",
      topic: "Marketing Automation",
      tone: "Professional",
      audience: "CMOs",
    },
  }),
});

const result = await response.json();
console.log(result);
```

---

## 📊 Response Format

All responses follow this structure:

```json
{
  "success": true,
  "task": "content_generation",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "result": {
    // Task-specific AI response
  },
  "metadata": {
    "model": "gpt-4o",
    "version": "2.0",
    "processedAt": 1705312200000
  }
}
```

---

## 🔗 React Integration

Add this service to connect your React app:

```typescript
// services/n8nService.ts
const N8N_WEBHOOK_URL = "https://your-n8n-domain/webhook/automarketer";

export type TaskType =
  | "content_generation"
  | "lead_scoring"
  | "competitor_analysis"
  | "campaign_strategy"
  | "audience_persona"
  | "content_optimizer"
  | "email_campaign"
  | "schedule_optimization";

export async function executeN8nTask<T>(
  taskType: TaskType,
  inputData: Record<string, any>,
): Promise<T> {
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_type: taskType,
      input_data: inputData,
    }),
  });

  if (!response.ok) {
    throw new Error(`n8n request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unknown error");
  }

  return data.result as T;
}

// Usage examples:
// const posts = await executeN8nTask('content_generation', { platform: 'LinkedIn', topic: '...' });
// const score = await executeN8nTask('lead_scoring', { name: '...', email: '...' });
```

---

## ⚙️ Customization

### Change AI Model

Update the `modelId` in any AI node:

- `gpt-4o` - Best quality (default)
- `gpt-4-turbo` - Faster, still high quality
- `gpt-3.5-turbo` - Budget option

### Adjust Temperature

- Lower (0.1-0.3): More consistent, factual
- Medium (0.4-0.6): Balanced
- Higher (0.7-0.9): More creative

### Add New Task Types

1. Duplicate an existing AI node
2. Modify the system/user prompts
3. Add a new rule in the Switch node
4. Connect to Format Response node

---

## 🔐 Security Notes

1. **Never commit API keys** to version control
2. Use n8n's credential system
3. Add authentication to your webhook if needed
4. Rate limit requests in production
5. Validate input data before processing

---

## 📞 Support

For issues with:

- **n8n**: Check n8n documentation at docs.n8n.io
- **OpenAI**: Check OpenAI status at status.openai.com
- **Workflow**: Review execution logs in n8n
