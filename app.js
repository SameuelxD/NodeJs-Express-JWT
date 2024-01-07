const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
require('dotenv').config()
// cors
const cors = require('cors');
const app = express();

// Configuración de CORS más completa
const corsOptions = {
    origin: '*', // Permitir solicitudes desde cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permitir métodos específicos
    credentials: true, // Permitir incluir cookies en las solicitudes (si es necesario)
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
/*const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jm2rmy9.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
const option = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(uri, option)
    .then(() => console.log(`Base de datos conectada`))
    .catch(e => console.log(`error db:`, e))*/

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.jm2rmy9.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(uri)
    .then(() => console.log(`Base de datos conectada`))
    .catch(e => console.log(`error db:`, e));


// import routes
const authRoutes = require('./routes/auth.js');
const verifyToken = require('./routes/validate-tokens.js');
const dashboardRoutes = require('./routes/dashboard.js');

// route middlewares
app.use('/api/user', authRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes)
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`servidor alojado en: localhost:${PORT}`)
})

/* npm run dev */