import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import prisma from '../../prisma/client';

// Instância do express
const routes = express.Router();

// Chave secreta para criação de token
const secretKey = process.env.SECRET_KEY || 'G4bR13lC0d3bL0X';

// Middleware para parsear cookies
routes.use(cookieParser());

// Função para criar token
const createToken = (user: any) => {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
};


// Função para verificar token
const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Não autorizado',
            data: null
        });
    }

    jwt.verify(token, secretKey, async (err: any, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token expirado, faça login novamente',
                    data: null
                });
            }
        
            return res.status(401).json({
                status: 'error',
                message: 'Token inválido',
                data: null
            });
        }
        req.user = decoded;
        next();
    });
}


//
//                              ROTAS
//

//           ROTA CADASTRO DE USUÁRIO
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


//           ROTA LOGIN DE USUÁRIO
routes.post('/login', async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Preencha todos os campos',
            data: null
        });
    }

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
    
    if (req.cookies.auth_token) {
        return res.status(400).json({
            status: 'error',
            message: 'Você já está logado',
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

routes.post('/profile', authenticate, async (req, res) => {
    //codiguin
});

//           ROTA LOGOUT DE USUÁRIO
routes.post('/logout', (req, res) => {
    if (!req.cookies.auth_token) {
        return res.status(400).json({
            status: 'error',
            message: 'Você não está logado',
            data: null
        });
    }
    res.clearCookie('auth_token');
    res.status(200).json({
        status: 'success',
        message: 'Logout realizado com sucesso',
        data: null
    });
});

export default routes;