// UserController.js
import { UserService } from '../service/UserService.mjs';

export const UserController = {
    getHello: async (req, res) => {
        res.send({ hello: 'world!!' }).status(200);
    },

    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            const user = await UserService.getUserByEmail(email, req.decodedToken.email);
            res.send({ user });
        } catch (error) {
            res.status(404).json({ found: false });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);
            res.send({ validated: true, token });
        } catch (error) {
            res.status(400).json({ validated: false, errorMessage: error.message });
        }
    },

    register: async (req, res) => {
        try {
            const { email, password, firstName, lastName } = req.body;
            const token = await UserService.register(email, password, firstName, lastName);
            const user = await UserService.getUserByEmail(email, email);
            res.send({ successful: true, token, user });
        } catch (error) {
            res.status(400).json({ successful: false, errorMessage: error.message });
        }
    },

    registerWithRole: async (req, res) => {
        try {
            const { email, password, firstName, lastName, role } = req.body;
            const token = await UserService.registerWithRole(email, password, firstName, lastName, role);
            res.send({ successful: true, token });
        } catch (error) {
            res.status(400).json({ successful: false, errorMessage: error.message });
        }
    },

    updateUser: async (req, res) => {
        try {
            const { _id } = req.params;
            const { role, ...otherValues } = req.body;
            const result = await UserService.updateUser(_id, otherValues);
            res.send(result);
        } catch (error) {
            res.status(400).json({ successful: false, errorMessage: error.message });
        }
    },

    updateUserWithRole: async (req, res) => {
        try {
            const { _id } = req.params;
            const result = await UserService.updateUserWithRole(_id, req.body);
            res.send(result);
        } catch (error) {
            res.status(400).json({ successful: false, errorMessage: error.message });
        }
    }
};
