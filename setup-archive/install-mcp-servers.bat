@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   AutoMarketer AI - MCP Server Setup
echo ========================================
echo.
echo Installing MCP servers...
echo.

echo [1/4] Installing File System Server...
npx -y @modelcontextprotocol/server-filesystem --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing package...
    npm install -g @modelcontextprotocol/server-filesystem
) else (
    echo Already installed!
)
echo.

echo [2/4] Installing Puppeteer Browser Server...
npx -y @modelcontextprotocol/server-puppeteer --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing package...
    npm install -g @modelcontextprotocol/server-puppeteer
) else (
    echo Already installed!
)
echo.

echo [3/4] Installing Brave Search Server...
npx -y @modelcontextprotocol/server-brave-search --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing package...
    npm install -g @modelcontextprotocol/server-brave-search
) else (
    echo Already installed!
)
echo.

echo [4/4] Installing Sequential Thinking Server...
npx -y @modelcontextprotocol/server-sequential-thinking --help >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing package...
    npm install -g @modelcontextprotocol/server-sequential-thinking
) else (
    echo Already installed!
)
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo MCP server configuration saved to:
echo   D:\fyp project\FYP\mcp-server.json
echo.
echo To use with Claude Desktop or Cursor:
echo 1. Copy the mcp-server.json content
echo 2. Add to your MCP settings
echo.
echo Optional: Get Brave Search API key:
echo   https://api.search.brave.com/app/dashboard
echo.
pause
