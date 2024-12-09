const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect('mongodb+srv://elrayomacuin162:wOboYtj2AfNJZW36@cluster0.lbdbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

    
// Esquema para Carrera
const CarreraSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
    },
});

// Campo virtual para las materias asociadas
CarreraSchema.virtual('materias', {
    ref: 'Materia',
    localField: '_id',
    foreignField: 'carrera',
});

// Configuración para habilitar el virtual en JSON
CarreraSchema.set('toJSON', { virtuals: true });

// Esquema para Materia
const MateriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    creditos: {
        type: Number,
        required: true,
    },
    semestre: {
        type: Number,
        required: true,
    },
    carrera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrera',
        required: true,
    },
});

// Crear modelos
const Carrera = mongoose.model('Carrera', CarreraSchema);
const Materia = mongoose.model('Materia', MateriaSchema);

module.exports = { Carrera, Materia };
