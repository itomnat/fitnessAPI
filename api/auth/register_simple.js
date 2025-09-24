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

        console.log('Register attempt:', { email, password: password ? '***' : 'missing' });

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // For testing - accept any valid email/password
        const token = 'test-token-' + Date.now();
        return res.status(200).json({ 
            access: token,
            message: 'Registration successful (test mode)'
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ 
            error: 'Registration failed',
            details: error.message 
        });
    }
}
