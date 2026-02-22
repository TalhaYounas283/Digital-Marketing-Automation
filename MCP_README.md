# AutoMarketer AI - MCP Server Configuration

This MCP (Model Context Protocol) server configuration allows AI assistants to interact with your AutoMarketer AI project, browsers, files, and web search.

## 🚀 MCP Servers Included

### 1. **BrowserMCP** (`@browsermcp/mcp`) ⭐ RECOMMENDED
Advanced browser automation (from your Cursor configuration):
- Open and control browsers
- Navigate websites
- Click elements and fill forms
- Extract data from web pages
- Take screenshots
- **Works with your existing Cursor setup**

### 2. **Puppeteer** (`@modelcontextprotocol/server-puppeteer`)
Alternative browser automation:
- Similar to BrowserMCP
- Open and navigate websites
- Take screenshots
- Click elements and fill forms
- Extract data from web pages
- Search Google and other search engines

### 3. **File System Access** (`@modelcontextprotocol/server-filesystem`)
Read and write files in your project:
- Read source code files
- Modify configuration files
- List directory contents
- Search within files

### 4. **Web Search** (`@modelcontextprotocol/server-brave-search`)
Search the internet:
- Find documentation
- Research competitors
- Look up marketing trends
- Get latest AI news

**Note:** Requires Brave Search API key. Get one free at: https://api.search.brave.com/app/dashboard

### 5. **Command Executor** (`@modelcontextprotocol/server-commands`)
Run shell commands:
- Execute npm scripts
- Run build commands
- Start/stop services
- Git operations

### 6. **Sequential Thinking** (`@modelcontextprotocol/server-sequential-thinking`)
Advanced problem-solving:
- Break down complex tasks
- Think through problems step-by-step
- Plan and strategize

---

## 📦 Installation

### Step 1: Install MCP Servers

Run this command to install all MCP servers:

```bash
# Using npm/npx (automatic)
npx mcp-server-install

# Or install individually:
npm install -g @anthropic-ai/mcp-puppeteer
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-commands
npm install -g @modelcontextprotocol/server-sequential-thinking
```

### Step 2: Configure Environment Variables

Add to your `.env` file:

```env
# Brave Search API (optional, for web search)
BRAVE_API_KEY=your_brave_api_key_here

# MCP Server Configuration
MCP_CONFIG_PATH=D:\fyp project\FYP\mcp-server.json
```

### Step 3: Start Using

Once configured, I can:
- Open browsers and search the web
- Read and edit your project files
- Run commands in your terminal
- Use your AutoMarketer AI workflow

---

## 🛠️ Available Tools

### Browser Tools

```javascript
// Navigate to a URL
await browser.goto('https://example.com');

// Take a screenshot
await browser.screenshot({ path: 'screenshot.png' });

// Click an element
await browser.click('button#submit');

// Extract text
const text = await browser.evaluate(() => document.body.innerText);

// Search Google
await browser.goto('https://google.com/search?q=marketing+automation');
```

### File System Tools

```javascript
// Read a file
const content = await fs.readFile('src/App.tsx');

// Write a file
await fs.writeFile('new-file.txt', 'Hello World');

// List directory
const files = await fs.list('src/components');

// Search files
const results = await fs.search('TODO', 'src/');
```

### AutoMarketer AI Integration

```javascript
// Generate marketing content
const response = await fetch('http://localhost:5678/webhook/automarketer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate_copy',
    platform: 'LinkedIn',
    topic: 'AI Marketing',
    tone: 'Professional',
    audience: 'Business Owners'
  })
});
```

---

## 🔧 Configuration Options

### Browser Settings

Edit `mcp-server.json` to customize browser behavior:

```json
{
  "tools": {
    "browser": {
      "enabled": true,
      "headless": true,  // Set to false to see the browser
      "viewport": {
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

### File Access Permissions

Control which directories I can access:

```json
{
  "tools": {
    "file_access": {
      "allowed_paths": [
        "D:\\fyp project\\FYP",
        "D:\\fyp project\\FYP\\src"
      ],
      "allowed_operations": ["read", "write", "list"]
    }
  }
}
```

---

## 📝 Example Usage

### Example 1: Research Competitors

Ask me to:
> "Search for top marketing automation competitors and analyze their websites"

I will:
1. Use web search to find competitors
2. Open their websites using browser automation
3. Extract key information
4. Create a comparison report

### Example 2: Update Project Files

Ask me to:
> "Add a new component to the dashboard"

I will:
1. Read existing dashboard code
2. Create the new component file
3. Update imports and exports
4. Verify the changes compile

### Example 3: Test Your Workflow

Ask me to:
> "Test the AI content generation workflow"

I will:
1. Send a POST request to your webhook
2. Check the response
3. Verify the AI generated content properly
4. Report any issues

---

## 🎯 Integration with VS Code

To use this in VS Code with the AI assistant:

1. Install the **MCP Server** extension
2. Open Command Palette (Ctrl+Shift+P)
3. Run: `MCP: Add Server`
4. Select: `From Configuration File`
5. Choose: `D:\fyp project\FYP\mcp-server.json`

---

## 🔒 Security Notes

- **Browser automation** runs in a sandboxed environment
- **File access** is restricted to your FYP project directory only
- **Commands** require confirmation for destructive operations
- **API keys** are stored in your `.env` file (never committed)

---

## 🐛 Troubleshooting

### MCP Server Not Starting?

```bash
# Check if servers are installed
npx @anthropic-ai/mcp-puppeteer --version

# Reinstall if needed
npm install -g @anthropic-ai/mcp-puppeteer
```

### Browser Not Opening?

- Make sure Chrome/Edge is installed
- Check if port 9222 is available
- Try running with `headless: false` to see errors

### Permission Denied?

- Check file paths in `mcp-server.json`
- Ensure Windows Defender isn't blocking
- Run terminal as Administrator if needed

---

## 📚 Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Puppeteer Docs](https://pptr.dev/)
- [Brave Search API](https://api.search.brave.com/)
- [AutoMarketer AI Project](PROJECT_REPORT.txt)

---

## ✅ Quick Start Checklist

- [ ] MCP server configuration file created
- [ ] MCP servers installed (`npm install -g` commands)
- [ ] Environment variables configured (`.env` file)
- [ ] Brave API key obtained (optional, for search)
- [ ] VS Code MCP extension installed (optional)
- [ ] Test browser automation
- [ ] Test file system access
- [ ] Test AutoMarketer AI webhook

---

**Ready to use!** Just ask me to perform any task and I'll use these tools to help you. 🚀
