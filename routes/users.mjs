import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/conn.mjs';
import { secure } from '../middleware/authMiddleware.mjs';

const router = express.Router();

const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = password => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

router.get('/', async (req, res) => {
    res.send({ hello: 'world!!' }).status(200);
});

router.get('/email/:email', secure, async (req, res) => {
    const collection = await db.collection('user');
    const { email } = req.params;
    const { decodedToken } = req;

    if (email !== decodedToken.email) {
        return res.status(403).json({ errorMessage: 'Unauthorized' });
    }

    const user = await collection.findOne({ email });

    if (!user) {
        res.status(404).json({ found: false });
        return;
    }

    res.send({ found: true, user });
});

router.post('/login', async (req, res) => {
    const collection = await db.collection('user');

    const { email: emailInput, password } = req.body;
    const email = String(emailInput).toLowerCase();

    const user = await collection.findOne({ email });

    if (!user) {
        res.status(400).json({ validated: false, errorMessage: 'Invalid email or password' });
        return;
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        res.status(400).json({ validated: false, errorMessage: 'Invalid email or password' });
        return;
    }

    // Generate JWT token containing user info
    const token = jwt.sign({ firstName: user.firstName, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '24h'
    });

    res.send({ validated: true, token }); // Sending token to the client
});

router.post('/register', async (req, res) => {
    const collection = await db.collection('user');
    const { email: emailInput, password, firstName, lastName } = req.body;
    const email = String(emailInput).toLowerCase();

    const duplicateKey = await collection.findOne({ email });

    if (duplicateKey) {
        res.status(400).json({ validated: false, errorMessage: 'Email already in use' });
        return;
    }

    if (!validateEmail(email)) {
        res.status(400).json({ validated: false, errorMessage: 'Email is invalid' });
        return;
    }

    if (!validatePassword(password)) {
        res.status(400).json({
            validated: false,
            errorMessage: 'Password must be 8 characters w/ a number, lowercase letter, and uppercase letter'
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({ email, password: hashedPassword, firstName, lastName });

    // Generate JWT token containing user info
    const token = jwt.sign({ firstName, email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.send({ successful: true, token }); // Sending token to the client
});

export default router;
