import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'fitness-tracker';
const JWT_SECRET = process.env.JWT_SECRET || 'fitnessApp';

export default async function handler(req, res) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

        // Verify workout belongs to user and update status
        const result = await workouts.updateOne(
            { _id: new ObjectId(id), userId: decoded.id },
            { $set: { status: 'completed' } }
        );

        await client.close();

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json({ 
            message: 'Workout status updated successfully',
            updatedWorkout: { _id: id, status: 'completed' }
        });
    } catch (error) {
        console.error('Complete workout error:', error);
        res.status(500).json({ error: 'Failed to update workout status' });
    }
}
