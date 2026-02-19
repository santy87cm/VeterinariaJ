// index.js - Backend completo para VeterinariaJ

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./db.sqlite');

// Crear tablas si no existen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS propietarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS mascotas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        especie TEXT,
        edad INTEGER,
        propietario_id INTEGER,
        FOREIGN KEY(propietario_id) REFERENCES propietarios(id)
    )`);
});

// ----------------- RUTAS PROPIETARIOS -----------------

// Crear propietario
app.post('/propietarios', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, telefono, email } = req.body;
    const sql = 'INSERT INTO propietarios (nombre, telefono, email) VALUES (?, ?, ?)';
    db.run(sql, [nombre, telefono, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, telefono, email });
    });
});

// Obtener todos los propietarios
app.get('/propietarios', (req, res) => {
    db.all('SELECT * FROM propietarios', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Editar propietario
app.put('/propietarios/:id', [
    body('nombre').notEmpty(),
    body('email').isEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, telefono, email } = req.body;
    db.run('UPDATE propietarios SET nombre = ?, telefono = ?, email = ? WHERE id = ?', 
        [nombre, telefono, email, req.params.id], function(err){
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Propietario actualizado' });
    });
});

// Eliminar propietario
app.delete('/propietarios/:id', (req, res) => {
    db.run('DELETE FROM propietarios WHERE id = ?', [req.params.id], function(err){
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Propietario eliminado' });
    });
});

// ----------------- RUTAS MASCOTAS -----------------

// Crear mascota
app.post('/mascotas', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('propietario_id').isInt().withMessage('Propietario ID debe ser un número')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, especie, edad, propietario_id } = req.body;
    db.run('INSERT INTO mascotas (nombre, especie, edad, propietario_id) VALUES (?, ?, ?, ?)',
        [nombre, especie, edad, propietario_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, nombre, especie, edad, propietario_id });
    });
});

// Obtener todas las mascotas
app.get('/mascotas', (req, res) => {
    db.all('SELECT * FROM mascotas', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Editar mascota
app.put('/mascotas/:id', [
    body('nombre').notEmpty(),
    body('propietario_id').isInt()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, especie, edad, propietario_id } = req.body;
    db.run('UPDATE mascotas SET nombre = ?, especie = ?, edad = ?, propietario_id = ? WHERE id = ?',
        [nombre, especie, edad, propietario_id, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Mascota actualizada' });
    });
});

// Eliminar mascota
app.delete('/mascotas/:id', (req, res) => {
    db.run('DELETE FROM mascotas WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Mascota eliminada' });
    });
});

// ----------------- INICIAR SERVIDOR -----------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

