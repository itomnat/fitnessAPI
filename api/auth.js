import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_STRING;
const MONGODB_DB = process.env.MONGODB_DB || 'fitnessAppTracker';
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'fitnessApp';

export default async function handler(req, res) {
    const { method } = req;
    const { action } = req.query;

    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        switch (action) {
            case 'login':
                if (method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleLogin(req, res);

            case 'register':
                if (method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleRegister(req, res);

            case 'verify':
                if (method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleVerify(req, res);

            default:
                return res.status(400).json({ error: 'Invalid action. Use: login, register, or verify' });
        }
    } catch (error) {
        console.error('Auth handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const users = db.collection('users');

        const user = await users.findOne({ email });
        await client.close();

        if (!user) {
            return res.status(404).json({ error: 'No Email Found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Email and password do not match' });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ access: token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
}

async function handleRegister(req, res) {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email invalid' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const users = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            await client.close();
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            password: hashedPassword,
            isAdmin: false,
            createdAt: new Date()
        };

        const result = await users.insertOne(newUser);
        await client.close();

        res.status(201).json({ message: 'Registered Successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
}

async function handleVerify(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const users = db.collection('users');

        const user = await users.findOne({ _id: decoded.id });
        await client.close();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ auth: 'Failed', message: error.message });
    }
}
