// Requirements 
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
// Initializations
const app = express(); // Aplicación


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
app.use(morgan('dev')); // Muestra peticiones que llegan al servidor
app.use(express.urlencoded({extended: false})); // Para aceptar los datos de los formularios que envien los usuarios, solo datos sencillos
app.use(express.json()); // Para poder enviar y recibir jsons

// Global Variables
app.use((req, res, next) => {
    
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