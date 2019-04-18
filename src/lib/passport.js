const passport = require('passport'); // Permite hacer autenticaciones con auth, google, twitter, etc
const LocalStrategy = require('passport-local').Strategy; // Para una autenticación local

const pool = require('../database'); // Conexión a la base de datos 
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // Para autenticar algún otro elemento del form, toma los datos de req.body
}, async(req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if(rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    }else {
        return done(null, false, req.flash('message', 'The username does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // Para autenticar algún otro elemento del form, toma los datos de req.body
}, async(req, username, password, done) => {
    const {fullname} = req.body;
    const newUser = {
        username,
        password,
        fullname
    }
    newUser.password = await helpers.encryptPassword(password); // Se encripta
    const result = await pool.query('INSERT INTO users SET ?', [newUser]); // Se guarda en el servidor
    newUser.id = result.insertId;
    return done(null, newUser); // Se toma el usuario para ser usado en el servidor
}));

passport.serializeUser((user, done) => { // Para guardar el usuario en la sesión
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => { // Para guardar el usuario en la sesión
    const rows = await pool.query('SELECT * FROM users WHERE ID =?', [id]);
    return done(null, rows[0])
});