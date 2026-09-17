const express = require('express');
const { Pool } = require('pg');

const app = express();

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'secret',
    database: process.env.DB_NAME || 'usuariosdb'
});

//healthcheck para docker
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', db: error.message });
    }
});

//listar usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios ORDER BY id');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//obtener un usuario por id
app.get('/api/usuarios/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//crear usuario
app.post('/api/usuarios', async (req, res) => {
    const { nombre, email } = req.body;

    try {
        const { rows } = await pool.query(
            'INSERT INTO usuarios(nombre, email) VALUES($1, $2) RETURNING *',
            [nombre, email]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
    const { nombre, email } = req.body;

    try {
        const { rows } = await pool.query(
            'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
            [nombre, email, req.params.id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);
        res.json({ mensaje: 'Usuario eliminado', usuario: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));