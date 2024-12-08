const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect('mongodb+srv://alielivm:xFoPEP3DSpH6q2zn@cluster0.8x3si.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Esquema para Carrera
const CarreraSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true, // Equivalente a allowNull: false
    },
    descripcion: {
        type: String, // TEXT en Sequelize se mapea a String en Mongoose
    },
});

// Esquema para Materia
const MateriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true, // Equivalente a allowNull: false
    },
    creditos: {
        type: Number, // INTEGER en Sequelize se mapea a Number en Mongoose
        required: true,
    },
    semestre: {
        type: Number,
        required: true,
    },
    carrera: {
        type: mongoose.Schema.Types.ObjectId, // Relación con Carrera
        ref: 'Carrera', // Modelo de referencia
        required: true,
    },
});

// Crear modelos
const Carrera = mongoose.model('Carrera', CarreraSchema);
const Materia = mongoose.model('Materia', MateriaSchema);

module.exports = { Carrera, Materia };
