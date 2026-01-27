// Portfolio Visitor Notification Worker
// Deploy to Cloudflare Workers to securely send Telegram notifications
// WITHOUT exposing your bot token in client-side code

// ============================================
// Worker Entry Point
// ============================================
export default {
    async fetch(request, env) {
        // Get credentials from environment variables
        const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return handleCORS();
        }

        // Only allow POST
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // Check if credentials are configured
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return new Response(JSON.stringify({
                error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables'
            }), {
                status: 500,
                headers: corsHeaders()
            });
        }

        try {
            const { message } = await request.json();

            if (!message) {
                return new Response('Missing message', { status: 400 });
            }

            // Send to Telegram
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

            const telegramResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (telegramResponse.ok) {
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: corsHeaders()
                });
            } else {
                const error = await telegramResponse.text();
                return new Response(JSON.stringify({ error }), {
                    status: 500,
                    headers: corsHeaders()
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: corsHeaders()
            });
        }
    }
};

// CORS Headers
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': 'https://anugrahiyyan.is-a.dev', // Or use: '*'
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

function handleCORS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders()
    });
}

/*
============================================
DEPLOYMENT INSTRUCTIONS
============================================

1. Go to https://dash.cloudflare.com/
2. Navigate to: Workers & Pages → Create Application → Create Worker
3. Name it: portfolio-telegram-notifier (or similar)
4. Replace the default code with THIS file's contents
5. Go to Worker Settings → Variables → Add Environment Variables:
   - TELEGRAM_BOT_TOKEN = your bot token from @BotFather
   - TELEGRAM_CHAT_ID = your chat ID from @userinfobot
6. Deploy the worker
7. Copy the Worker URL (e.g., https://portfolio-telegram-notifier.your-account.workers.dev)
8. In your portfolio's main.js, update:
   
   CONFIG.telegramWorkerUrl = 'https://your-worker-url.workers.dev';

============================================
IMPORTANT: Setting Environment Variables
============================================

The env.TELEGRAM_BOT_TOKEN and env.TELEGRAM_CHAT_ID are accessed INSIDE
the fetch() function, not at the module level. This is the correct way
to use Cloudflare Workers environment variables.

To add them:
1. Cloudflare Dashboard → Workers & Pages → Your Worker
2. Settings → Variables
3. Click "Add Variable"
4. Add:
   - Variable name: TELEGRAM_BOT_TOKEN, Value: 123456:ABC...
   - Variable name: TELEGRAM_CHAT_ID, Value: 123456789
5. Save and deploy

*/
