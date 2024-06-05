// UserService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import db from "../db/conn.mjs";
import { User } from '../model/User.mjs';

export const UserService = {
  getUserByEmail: async (email, decodedEmail) => {
    const collection = await db.collection('user');
    if (email !== decodedEmail) {
      throw new Error('Unauthorized');
    }
    const user = await collection.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  login: async (email, password) => {
    const collection = await db.collection('user');
    const user = await collection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }
    return jwt.sign({ firstName: user.firstName, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  },

  register: async (email, password, firstName, lastName) => {
    const collection = await db.collection('user');
    const duplicateKey = await collection.findOne({ email });
    if (duplicateKey) {
      throw new Error('Email already in use');
    }
    if (!validateEmail(email)) {
      throw new Error('Email is invalid');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be 8 characters w/ a number, lowercase letter, and uppercase letter');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, firstName, lastName });
    await collection.insertOne(user);
    return jwt.sign({ firstName, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  },

  registerWithRole: async (email, password, firstName, lastName, role) => {
    const collection = await db.collection('user');
    const duplicateKey = await collection
        .findOne({ email });
    if (duplicateKey) {
        throw new Error('Email already in use');
        }
    if (!validateEmail(email)) {
        throw new Error('Email is invalid');
        }
    if (!validatePassword(password)) {
        throw new Error('Password must be 8 characters w/ a number, lowercase letter, and uppercase letter');
        }
    if (!['user', 'admin'].includes(role)) {
        throw new Error('Role must be either user or admin');
        }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, firstName, lastName, role });
    await collection.insertOne(user);
    return jwt.sign({ firstName, email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    },

    updateUser: async (_id, updatedFields) => {
        const collection = await db.collection('user');

        // Validate if _id is provided
        if (!_id) {
          throw new Error('User ID (_id) is required for updating');
        }
    
        // Validate if any fields are provided to update
        if (Object.keys(updatedFields).length === 0) {
          throw new Error('No fields provided for update');
        }
    
        // Update the user with the provided fields
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updatedFields });    
        return { message: 'User updated successfully', updated };
      },

    updateUserWithRole: async (_id, updatedFields) => {
        const collection = await db.collection('user');

        // Validate if _id is provided
        if (!_id) {
          throw new Error('User ID (_id) is required for updating');
        }
    
        // Validate if any fields are provided to update
        if (Object.keys(updatedFields).length === 0) {
          throw new Error('No fields provided for update');
        }
    
        // Update the user with the provided fields
        await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updatedFields });   
        return { message: 'User updated successfully' };
      },

};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};