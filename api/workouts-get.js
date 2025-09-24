import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_STRING;
const MONGODB_DB = process.env.MONGODB_DB || 'fitnessAppTracker';
const JWT_SECRET = process.env.JWT_SECRET_KEY || 'fitnessApp';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

        const userWorkouts = await workouts.find({ userId: decoded.id }).toArray();
        await client.close();

        if (userWorkouts.length === 0) {
            return res.status(200).json({ message: 'No workouts found.' });
        }

        res.status(200).json({ workouts: userWorkouts });
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
}