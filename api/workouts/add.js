import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'fitness-tracker';
const JWT_SECRET = process.env.JWT_SECRET || 'fitnessApp';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { name, duration } = req.body;

        if (!name || !duration) {
            return res.status(400).json({ error: 'Name and duration are required' });
        }

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
