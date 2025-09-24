import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_STRING;
const MONGODB_DB = process.env.MONGODB_DB || 'fitnessAppTracker';
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'fitnessApp';

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    const { name, duration } = req.body;

    if (!name || !duration) {
        return res.status(400).json({ error: 'Name and duration are required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

        const newWorkout = {
            userId: decoded.id,
            name,
            duration,
            status: 'pending',
            dateAdded: new Date()
        };

        const result = await workouts.insertOne(newWorkout);
        await client.close();

        res.status(201).json({ 
            _id: result.insertedId,
            ...newWorkout
        });
    } catch (error) {
        console.error('Add workout error:', error);
        res.status(500).json({ error: 'Failed to add workout' });
    }
}
