const fs = require('fs');

const N8N_URL = 'http://localhost:5678';
const WORKFLOW_ID = 'NbxlBPl1HMYNOkUt';

console.log('========================================');
console.log('  AutoMarketer AI - Complete Setup');
console.log('========================================\n');

async function setupWorkflow(apiKey, hfToken) {
    const headers = {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': apiKey
    };

    try {
        // 1. Create Hugging Face credential
        console.log('🤖 Creating Hugging Face credential...');
        const credential = {
            name: 'Hugging Face API',
            type: 'httpHeaderAuth',
            data: {
                name: 'Authorization',
                value: `Bearer ${hfToken}`
            }
        };

        const credResponse = await fetch(`${N8N_URL}/rest/credentials`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(credential)
        });

        if (!credResponse.ok) {
            throw new Error(`Failed to create credential: ${await credResponse.text()}`);
        }

        const credData = await credResponse.json();
        const credentialId = credData.id;
        console.log('✅ Created credential:', credentialId);

        // 2. Get current workflow
        console.log('📥 Fetching workflow...');
        const wfResponse = await fetch(`${N8N_URL}/rest/workflows/${WORKFLOW_ID}`, {
            headers: headers
        });

        if (!wfResponse.ok) {
            throw new Error(`Failed to get workflow: ${await wfResponse.text()}`);
        }

        const workflow = await wfResponse.json();

        // 3. Update all HTTP Request nodes
        console.log('🔗 Updating AI nodes...');
        let updatedCount = 0;
        
        for (const node of workflow.nodes) {
            if (node.type === 'n8n-nodes-base.httpRequest' && 
                node.parameters.url && 
                node.parameters.url.includes('huggingface')) {
                
                node.parameters.authentication = 'genericCredentialType';
                node.parameters.genericAuthType = 'httpHeaderAuth';
                node.credentials = {
                    httpHeaderAuth: {
                        id: credentialId,
                        name: 'Hugging Face API'
                    }
                };
                updatedCount++;
            }
        }

        console.log(`✅ Connected credential to ${updatedCount} AI nodes`);

        // 4. Save workflow
        console.log('💾 Saving workflow...');
        const saveResponse = await fetch(`${N8N_URL}/rest/workflows/${WORKFLOW_ID}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(workflow)
        });

        if (!saveResponse.ok) {
            throw new Error(`Failed to save workflow: ${await saveResponse.text()}`);
        }

        console.log('✅ Workflow saved');

        // 5. Activate workflow
        console.log('🚀 Activating workflow...');
        const activateResponse = await fetch(`${N8N_URL}/rest/workflows/${WORKFLOW_ID}/activate`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ active: true })
        });

        if (!activateResponse.ok) {
            throw new Error(`Failed to activate: ${await activateResponse.text()}`);
        }

        console.log('✅ Workflow activated!');

        // Summary
        console.log('\n========================================');
        console.log('  🎉 SETUP COMPLETE!');
        console.log('========================================\n');
        console.log('🌐 Webhook URL:');
        console.log(`   ${N8N_URL}/webhook/automarketer\n`);
        console.log('📝 Add to your frontend .env:');
        console.log(`   REACT_APP_N8N_WEBHOOK_URL=${N8N_URL}/webhook/automarketer`);
        console.log('   REACT_APP_USE_MOCKS=false\n');
        console.log('🔗 Workflow URL:');
        console.log(`   ${N8N_URL}/workflow/${WORKFLOW_ID}\n`);
        console.log('🤖 AI Features Ready:');
        console.log('   ✅ Content Generation');
        console.log('   ✅ Campaign Strategy');
        console.log('   ✅ Lead Scoring');
        console.log('   ✅ Competitor Analysis');
        console.log('   ✅ Content Optimization');
        console.log('   ✅ Persona Building');
        console.log('   ✅ SEO Research\n');

        return true;

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        return false;
    }
}

// Get arguments
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node setup-workflow.cjs <n8n-api-key> <huggingface-token>');
    console.log('\nGet your n8n API key from: http://localhost:5678/settings/api');
    console.log('Get your Hugging Face token from: https://huggingface.co/settings/tokens');
    process.exit(1);
}

const n8nApiKey = args[0];
const hfToken = args[1];

setupWorkflow(n8nApiKey, hfToken).then(success => {
    process.exit(success ? 0 : 1);
});
