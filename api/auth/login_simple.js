export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        console.log('Login attempt:', { email, password: password ? '***' : 'missing' });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // For testing - accept any email/password
        if (email && password) {
            const token = 'test-token-' + Date.now();
            return res.status(200).json({ 
                access: token,
                message: 'Login successful (test mode)'
            });
        }

        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Login failed',
            details: error.message 
        });
    }
}
