import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../../prisma/client';

const routes = express.Router();

routes.post('/register', async (req, res) => {
    const { login, email, confirmEmail, password, confirmPassword } = req.body;
    
    const existingUser = await prisma.user.findUnique({
        where: {
            login
        }
    });
    if (existingUser) {
        return res.status(400).json('Usuário já existe');
    }
    if (email !== confirmEmail) {
        return res.status(400).json('Emails não coincidem');
    }
    if (password !== confirmPassword) {
        return res.status(400).json('Senhas não coincidem');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            login,
            email,
            password: hashedPassword
        }
    });
    return res.status(201).json(user);
});

routes.post('/login', async (req, res) => {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            login
        }
    });
    if (!user) {
        return res.status(400).json('Usuário não encontrado');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json('Senha incorreta');
    }
    //res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.status(200).json('Login efetuado com sucesso');
});

routes.post('/logout', (req, res) => {
    
    //res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logout successful' });
});

export default routes;