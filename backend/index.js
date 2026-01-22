import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './user.js';
import Assignment from './assignment.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Allow overriding the MongoDB connection string via environment variable for
// local development (e.g. MONGO_URI='mongodb://localhost:27019/LMS').
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/LMS';

mongoose.connect(mongoUri).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
    process.exit();
});

app.use(cors());
app.use(express.json());


app.post('/signup', async (req, res) => {
    try {
        let { username, password, role } = req.body;
        console.log('Signup request received:', { username, password: '***', role }); // Debug
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        if (!role || !['student', 'teacher'].includes(role)) {
            console.log('Invalid role:', role); // Debug
            return res.status(400).json({ message: 'Valid role (student or teacher) required' });
        }
        username = username.trim().toLowerCase();

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken' });
        }

        const user = new User({ username, password, role });
        await user.save();
        
        console.log('User created:', { username: user.username, role: user.role }); // Debug

        res.status(201).json({ message: 'Sign up successful', user });
    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).send('Error signing up');
    }
});


app.post('/signin', async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }
        username = username.trim().toLowerCase();

        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ message: 'Sign in successful', user });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error signing in');
    }
});


// Assignment endpoints
app.post('/assignments', async (req, res) => {
    try {
        const { title, description, dueDate, teacherUsername, maxScore } = req.body;
        
        if (!title || !description || !dueDate || !teacherUsername) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const assignment = new Assignment({
            title,
            description,
            dueDate,
            teacherUsername,
            maxScore: maxScore || 100
        });

        await assignment.save();
        console.log('Assignment created:', assignment);
        res.status(201).json({ message: 'Assignment created successfully', assignment });
    } catch (e) {
        console.error('Error creating assignment:', e);
        res.status(500).json({ message: 'Error creating assignment' });
    }
});

app.get('/assignments', async (req, res) => {
    try {
        const { teacherUsername } = req.query;
        const filter = teacherUsername ? { teacherUsername } : {};
        const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
        res.json({ assignments });
    } catch (e) {
        console.error('Error fetching assignments:', e);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});

app.get('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({ assignment });
    } catch (e) {
        console.error('Error fetching assignment:', e);
        res.status(500).json({ message: 'Error fetching assignment' });
    }
});

app.put('/assignments/:id', async (req, res) => {
    try {
        const { title, description, dueDate, maxScore } = req.body;
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            { title, description, dueDate, maxScore },
            { new: true }
        );
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({ message: 'Assignment updated successfully', assignment });
    } catch (e) {
        console.error('Error updating assignment:', e);
        res.status(500).json({ message: 'Error updating assignment' });
    }
});

app.delete('/assignments/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({ message: 'Assignment deleted successfully' });
    } catch (e) {
        console.error('Error deleting assignment:', e);
        res.status(500).json({ message: 'Error deleting assignment' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
