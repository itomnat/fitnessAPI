import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'fitness-tracker';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
