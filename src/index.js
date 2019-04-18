// Requirements 
const express = require('express'); // Servidor
const morgan = require('morgan'); // Escribe por la terminal los estados del sistema, tipo GET y POST
const exphbs = require('express-handlebars'); // Motor de plantillas
const path = require('path'); // Unión de directorios
const flash = require('connect-flash'); // Para mostrar mensajes de distintos tipos
const session = require('express-session'); // Para crear sesiones
const MySQLStore = require('express-mysql-session'); // Para guardar la sesión en la base de datos en vez del servidor
const passport = require('passport');

const { database } = require('./keys');

// Initializations
const app = express(); // Aplicación
require('./lib/passport');

// Settings 
app.set('port', process.env.port || 3000); // Definicion del puerto, si existe un puerto en el sistema o se escoge el 3000
app.set('views', path.join(__dirname, 'views')); // Indica donde está la carpeta views (1)
app.engine('.hbs', exphbs({ // Configuración del motor de plantillas, para trabajar con "html"
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'), // Se concatena la dirección de la carpeta views de (1) con la carpeta layouts
    partialsDir: path.join(app.get('views'), 'partials'), // Igual que lo anterior pero con la carpeta partials
    extname: '.hbs', // Para usar esta extensión en vezde "handlebars"
    helpers: require('./lib/handlebars') // Para que se ayude con el arcivo que se encuentra en la carpeta lib
}));
app.set('view engine', '.hbs'); // Usa el motor de plantillas

// Middlewares
app.use(session({
    secret: 'mysession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database) // Sesión en la base de datos
}));
app.use(flash()); // Funcionalidad de enviar mensajes activa
app.use(morgan('dev')); // Muestra peticiones que llegan al servidor
app.use(express.urlencoded({ extended: false })); // Para aceptar los datos de los formularios que envien los usuarios, solo datos sencillos
app.use(express.json()); // Para poder enviar y recibir jsons
app.use(passport.initialize()); // Inicializamos passport...
app.use(passport.session());


// Global Variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})


// Routes
app.use(require('./routes')); // No se coloca index.js porque ya lo reconoce el sistema 
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public files
app.use(express.static(path.join(__dirname, 'public')));


// Starting the server
app.listen(app.get('port'), () => {
    console.log('Server on Port', app.get('port'));
});