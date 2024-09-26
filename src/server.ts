import express from 'express';
import path from 'path';
import routes from '../src/api/routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Middleware para servir arquivos estáticos
app.use('/src', express.static(path.join(__dirname, '..', 'src')));

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src/tabs/home/index.html'));
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'src')));
app.use(cookieParser());

app.use(routes);

// Iniciar o servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
