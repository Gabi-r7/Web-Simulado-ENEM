import express from 'express';
import path from 'path';

const app = express();

// Middleware para servir arquivos estáticos
app.use('/src', express.static(path.join(__dirname, '..', 'src')));

// Rota de exemplo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src/tabs/initial/index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
