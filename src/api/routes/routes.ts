import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import prisma from '../../prisma/client';

const routes = express.Router();
const secretKey = process.env.SECRET_KEY || 'G4bR13lC0d3bL0X';

routes.use(cookieParser());

const createToken = (user: any) => {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};

routes.post('/register', async (req, res) => {
    const { login, email, confirmEmail, password, confirmPassword } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {
            login
        }
    });
    if (existingUser) {
        return res.status(400).json({
            status: 'error',
            message: 'Usuário já existe',
            data: null    
        });
    }

    if (!login || !email || !confirmEmail || !password || !confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Preencha todos os campos',
            data: null
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Senha deve ter no mínimo 6 caracteres',
            data: null
        });
    }

    if (email !== confirmEmail) {
        return res.status(400).json({
            status: 'error',
            message: 'Emails não coincidem',
            data: null
        });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Senhas não coincidem',
            data: null
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            login,
            email,
            password: hashedPassword
        }
    });

    const token = createToken(user);
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });

    return res.status(201).json({
        status: 'success',
        message: 'Usuário criado com sucesso',
        data: user
    });
});

routes.post('/login', async (req, res) => {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            login
        }
    });
    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'Usuário não encontrado',
            data: null
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            status: 'error',
            message: 'Senha incorreta',
            data: null
        });
    }
        

    const token = createToken(user);
    res.cookie('auth_token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });

    return res.status(200).json({
        status: 'success',
        message: 'Login realizado com sucesso',
        data: null
    });
});

routes.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({
        status: 'success',
        message: 'Logout realizado com sucesso',
        data: null
    });
});

export default routes;