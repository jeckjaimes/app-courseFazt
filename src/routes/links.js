const express = require('express');
const router = express.Router();

const pool = require('../database'); // Pool hace referencia a la base de datos.
const { isLoggedIn } = require('../lib/auth'); // Para proteger las rutas y solo puedan verse cuando haya un usuario loggeado sino redirecciona a signin

// A todas las rutas definidas acá les precede la ruta /links, fue definido en el index.js de src.
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => { // Se usa async para poder usar await a la hora de insertar el link en la base de datos.
    const { title, url, description } = req.body; // En req.body se tiene una estructura donde se encuentra la información que se recibe de la página.
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    await pool.query('INSERT INTO links set ?', [newLink]); // Insertamos el link en nuestra base de datos en links, se agrega el await para que se haga una especie de espera, ya que esto toma tiempo, tambien podria usarse una promesa o una funcion despues de esta linea de código.
    req.flash('success', 'Link saved successfully.'); // Para mostrar un mensaje cuando se realice esta acción
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id =?', [req.user.id]); // Consulta a la base de datos.
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID =?', [id]); // Elimina un elemento de la base de datos
    req.flash('success', 'Link removed successfully'); // Para mostrar un mensaje cuando se realice esta acción
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    }
    await pool.query('UPDATE links set ? WHERE ID = ?', [newLink, id]);
    req.flash('success', 'Link Updated successfully'); // Para mostrar un mensaje cuando se realice esta acción
    res.redirect('/links');
});

module.exports = router;