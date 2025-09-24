import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';

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

    // Verify authentication for all workout operations
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ auth: 'Failed. No Token' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ auth: 'Failed', message: error.message });
    }

    try {
        switch (action) {
            case 'get':
                if (method !== 'GET') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleGetWorkouts(req, res, decoded);

            case 'add':
                if (method !== 'POST') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleAddWorkout(req, res, decoded);

            case 'update':
                if (method !== 'PATCH') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleUpdateWorkout(req, res, decoded);

            case 'delete':
                if (method !== 'DELETE') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleDeleteWorkout(req, res, decoded);

            case 'complete':
                if (method !== 'PATCH') {
                    return res.status(405).json({ error: 'Method not allowed' });
                }
                return await handleCompleteWorkout(req, res, decoded);

            default:
                return res.status(400).json({ error: 'Invalid action. Use: get, add, update, delete, or complete' });
        }
    } catch (error) {
        console.error('Workouts handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetWorkouts(req, res, decoded) {
    try {
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

async function handleAddWorkout(req, res, decoded) {
    const { name, duration } = req.body;

    if (!name || !duration) {
        return res.status(400).json({ error: 'Name and duration are required' });
    }

    try {
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

async function handleUpdateWorkout(req, res, decoded) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
    }

    const { name, duration } = req.body;
    if (!name || !duration) {
        return res.status(400).json({ error: 'Name and duration are required' });
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

        // Verify workout belongs to user
        const workout = await workouts.findOne({ 
            _id: new ObjectId(id), 
            userId: decoded.id 
        });

        if (!workout) {
            await client.close();
            return res.status(404).json({ error: 'Workout not found' });
        }

        const result = await workouts.updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, duration } }
        );

        await client.close();

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json({ 
            message: 'Workout updated successfully',
            updatedWorkout: { _id: id, name, duration }
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
}

async function handleDeleteWorkout(req, res, decoded) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
    }

    try {
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

        // Verify workout belongs to user and delete
        const result = await workouts.deleteOne({ 
            _id: new ObjectId(id), 
            userId: decoded.id 
        });

        await client.close();

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json({ message: 'Workout deleted successfully' });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ error: 'Failed to delete workout' });
    }
}

async function handleCompleteWorkout(req, res, decoded) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Workout ID is required' });
    }

    try {
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
