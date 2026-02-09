/**
 * Azure Function: Translation Proxy
 * Acts as a proxy between the frontend and the external translation API
 * This solves CORS issues in Azure Static Web Apps
 */

module.exports = async function (context, req) {
    context.log('Translation proxy function invoked');

    // Enable CORS
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
        context.res.status = 405;
        context.res.body = { error: 'Method not allowed' };
        return;
    }

    // Validate request body
    if (!req.body || !req.body.text) {
        context.res.status = 400;
        context.res.body = { error: 'Missing "text" in request body' };
        return;
    }

    try {
        context.log('Making request to external translation API...');

        // Import fetch (for Node.js 18+, fetch is built-in)
        const fetch = globalThis.fetch || require('node-fetch');

        const response = await fetch('https://api-notebooklm.onrender.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: req.body.text })
        });

        if (!response.ok) {
            const errorText = await response.text();
            context.log.error(`External API error (${response.status}):`, errorText);
            context.res.status = response.status;
            context.res.body = {
                error: `Translation API error: ${response.status}`,
                details: errorText
            };
            return;
        }

        const data = await response.json();
        context.log('Translation successful');

        context.res.status = 200;
        context.res.body = data;

    } catch (error) {
        context.log.error('Translation proxy error:', error);
        context.res.status = 500;
        context.res.body = {
            error: 'Internal server error',
            message: error.message
        };
    }
};
