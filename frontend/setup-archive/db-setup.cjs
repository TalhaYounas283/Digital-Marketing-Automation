const fs = require('fs');
const path = require('path');

const N8N_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.n8n');
const DB_PATH = path.join(N8N_DIR, 'database.sqlite');
const WORKFLOW_ID = 'NbxlBPl1HMYNOkUt';
const HF_TOKEN = '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';

console.log('========================================');
console.log('  AutoMarketer AI - Database Setup');
console.log('========================================\n');

// Check if database exists
if (!fs.existsSync(DB_PATH)) {
    console.error('❌ n8n database not found at:', DB_PATH);
    process.exit(1);
}

console.log('✓ Found n8n database');

// Create a setup SQL script
const setupScript = `
-- AutoMarketer AI Setup Script
-- Generated: ${new Date().toISOString()}

-- Generate a new API key
INSERT INTO user_api_key (id, userId, apiKey, label, createdAt, updatedAt)
VALUES (
    lower(hex(randomblob(16))),
    (SELECT id FROM user LIMIT 1),
    lower(hex(randomblob(32))),
    'AutoMarketer Setup',
    datetime('now'),
    datetime('now')
);

-- Get the API key we just created
SELECT apiKey FROM user_api_key WHERE label = 'AutoMarketer Setup' ORDER BY createdAt DESC LIMIT 1;
`;

console.log('\n📋 Manual Setup Required:');
console.log('Since I cannot access SQLite directly, please run these steps:\n');

console.log('1. Install SQLite (if not installed):');
console.log('   - Download from: https://sqlite.org/download.html');
console.log('   - Or use: npm install -g sqlite3\n');

console.log('2. Open n8n database:');
console.log(`   sqlite3 "${DB_PATH}"\n`);

console.log('3. Create API key (run this SQL):');
console.log(`   INSERT INTO user_api_key (id, userId, apiKey, label, createdAt, updatedAt)`);
console.log(`   SELECT lower(hex(randomblob(16))), id, lower(hex(randomblob(32))), 'Auto Setup', datetime('now'), datetime('now')`);
console.log(`   FROM user LIMIT 1;\n`);

console.log('4. Get your API key:');
console.log(`   SELECT apiKey FROM user_api_key WHERE label = 'Auto Setup';\n`);

console.log('5. Then run the setup script with your API key:\n');
console.log(`   node "D:\\fyp project\\FYP\\setup-workflow.cjs" <API_KEY> ${HF_TOKEN}\n`);

console.log('========================================');
console.log('  Alternative: Manual n8n UI Setup');
console.log('========================================\n');

console.log('If you prefer GUI:');
console.log('1. Go to: http://localhost:5678/settings/api');
console.log('2. Generate API key');
console.log('3. Go to: http://localhost:5678/workflow/NbxlBPl1HMYNOkUt');
console.log('4. Create credential: HTTP Header Auth');
console.log('   - Name: Hugging Face API');
console.log(`   - Header: Authorization: Bearer ${HF_TOKEN}`);
console.log('5. Connect to all 7 AI nodes');
console.log('6. Activate workflow\n');

console.log('Your Hugging Face token is ready in .env file!');
console.log('Token:', HF_TOKEN.substring(0, 15) + '...');
