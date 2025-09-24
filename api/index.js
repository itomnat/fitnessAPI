import bcrypt from 'bcryptjs';
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

    try {
        // Auth endpoints
        if (action === 'login') {
            return await handleLogin(req, res);
        } else if (action === 'register') {
            return await handleRegister(req, res);
        } else if (action === 'verify') {
            return await handleVerify(req, res);
        }
        // Workout endpoints
        else if (action === 'get') {
            return await handleGetWorkouts(req, res);
        } else if (action === 'add') {
            return await handleAddWorkout(req, res);
        } else if (action === 'update') {
            return await handleUpdateWorkout(req, res);
        } else if (action === 'delete') {
            return await handleDeleteWorkout(req, res);
        } else if (action === 'complete') {
            return await handleCompleteWorkout(req, res);
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleLogin(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password } = req.body;

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

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            await client.close();
            return res.status(400).json({ error: 'User already exists' });
        }

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
        const users = db.collection('users');

        const user = await users.findOne({ _id: decoded.id });
        await client.close();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ auth: 'Failed', message: error.message });
    }
}

async function handleGetWorkouts(req, res) {
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

async function handleAddWorkout(req, res) {
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

async function handleUpdateWorkout(req, res) {
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

    const { name, duration } = req.body;
    if (!name || !duration) {
        return res.status(400).json({ error: 'Name and duration are required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const client = await MongoClient.connect(MONGODB_URI);
        const db = client.db(MONGODB_DB);
        const workouts = db.collection('workouts');

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

async function handleDeleteWorkout(req, res) {
    if (req.method !== 'DELETE') {
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

async function handleCompleteWorkout(req, res) {
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
