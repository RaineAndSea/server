import bcrypt from 'bcrypt';
import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

router.get('/', async(req, res) => {
    res.send({"hello": "world!!"}).status(200)
});

router.post('/login', async (req, res) => {
    const collection = await db.collection('user');

    const { email: emailInput, password } = req.body;
    const email = String(emailInput).toLowerCase();

    const user = await collection.findOne({ email });

    if(!user) {
        res.status(400).json({validated: false, errorMessage: 'Invalid email or password'});
        res.send()
        return;
    }

    const result = await bcrypt.compare(password, user.password)
    if(!result) {
        res.status(400).json({validated: false, errorMessage: 'Invalid email or password'});
        res.send();
        return;
    }

    res.send({validated: true, user});

})

router.post('/register', async (req, res) => {
    const collection = await db.collection('user');
    const { email: emailInput, password, firstName, lastName } = req.body;
    const email = String(emailInput).toLowerCase();


    const duplicateKey = await collection.findOne({email});

    if(duplicateKey) {
        res.status(400).json({validated: false, errorMessage: 'Email already in use'})
        res.send()
        return;
    }

    if(!validateEmail(email)) {
        res.status(400).json({validated: false, errorMessage: 'Email is invalid'})
        res.send()
        return;
    }

    if(!validatePassword(password)) {
        res.status(400).json({validated: false, errorMessage: 'Password must be 8 characters w/ a number, lowercase letter, and uppercase letter'})
        res.send();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({ email, password: hashedPassword, firstName, lastName})
    res.send({successful: true, result: result, user: {firstName, lastName, email}});
})

export default router;