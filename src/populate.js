const mongoose = require('mongoose');
const { Carrera, Materia } = require('./db.js'); // Importa los modelos previamente definidos

(async () => {
    try {
      // Crear la carrera
        const ingenieriaSistemas = await Carrera.create({
            nombre: 'Ingeniería de Sistemas',
            descripcion: 'Carrera enfocada en el desarrollo de software y sistemas computacionales.',
        });

        // Crear materias para Ingeniería de Sistemas
        const materias = [
            // Primer semestre
            { nombre: 'Animación Digital', creditos: 3, semestre: 1, carrera: ingenieriaSistemas._id },
            { nombre: 'Fundamentos de Desarrollo de Software', creditos: 4, semestre: 1, carrera: ingenieriaSistemas._id },
            { nombre: 'Fundamentos de las Ciencias de la Computación', creditos: 4, semestre: 1, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación I', creditos: 4, semestre: 1, carrera: ingenieriaSistemas._id },
            { nombre: 'Inglés Técnico I', creditos: 3, semestre: 1, carrera: ingenieriaSistemas._id },
            { nombre: 'Matemática Computacional', creditos: 4, semestre: 1, carrera: ingenieriaSistemas._id },

            // Segundo semestre
            { nombre: 'Base de Datos I', creditos: 4, semestre: 2, carrera: ingenieriaSistemas._id },
            { nombre: 'Electrónica Digital Aplicada', creditos: 4, semestre: 2, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación II', creditos: 4, semestre: 2, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación Web I', creditos: 4, semestre: 2, carrera: ingenieriaSistemas._id },
            { nombre: 'Sistemas Operativos', creditos: 4, semestre: 2, carrera: ingenieriaSistemas._id },
            { nombre: 'Inglés Técnico II', creditos: 3, semestre: 2, carrera: ingenieriaSistemas._id },

            // Tercer semestre
            { nombre: 'Arquitectura de Computadores', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },
            { nombre: 'Base de Datos II', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },
            { nombre: 'Estructuras de Datos', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },
            { nombre: 'Ingeniería de Requisitos', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación Orientada a Objetos', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },
            { nombre: 'Matemáticas Discretas', creditos: 4, semestre: 3, carrera: ingenieriaSistemas._id },

            // Cuarto semestre
            { nombre: 'Análisis y Diseño de Sistemas', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },
            { nombre: 'Gestión de Proyectos de Software', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación Web II', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },
            { nombre: 'Redes de Computadoras', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },
            { nombre: 'Ingeniería de Software I', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },
            { nombre: 'Probabilidad y Estadística', creditos: 4, semestre: 4, carrera: ingenieriaSistemas._id },

            // Quinto semestre
            { nombre: 'Diseño de Interfaces de Usuario', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },
            { nombre: 'Ingeniería de Software II', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },
            { nombre: 'Seguridad Informática', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación Móvil I', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },
            { nombre: 'Gestión de Recursos TI', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },
            { nombre: 'Modelado y Simulación', creditos: 4, semestre: 5, carrera: ingenieriaSistemas._id },

            // Sexto semestre
            { nombre: 'Arquitectura de Software', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },
            { nombre: 'Inteligencia Artificial', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },
            { nombre: 'Programación Móvil II', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },
            { nombre: 'Redes Avanzadas', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },
            { nombre: 'Taller de Innovación Tecnológica', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },
            { nombre: 'Sistemas Distribuidos', creditos: 4, semestre: 6, carrera: ingenieriaSistemas._id },

            // Séptimo semestre
            { nombre: 'Big Data y Analítica', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },
            { nombre: 'Computación en la Nube', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },
            { nombre: 'Minería de Datos', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },
            { nombre: 'Gestión de Seguridad TI', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },
            { nombre: 'Seminario de Investigación', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },
            { nombre: 'Tópicos Avanzados de Programación', creditos: 4, semestre: 7, carrera: ingenieriaSistemas._id },

            // Octavo semestre
            { nombre: 'Arquitectura Empresarial', creditos: 4, semestre: 8, carrera: ingenieriaSistemas._id },
            { nombre: 'Desarrollo de Software Ágil', creditos: 4, semestre: 8, carrera: ingenieriaSistemas._id },
            { nombre: 'Proyecto Final de Carrera', creditos: 6, semestre: 8, carrera: ingenieriaSistemas._id },
            { nombre: 'Práctica Profesional Supervisada', creditos: 6, semestre: 8, carrera: ingenieriaSistemas._id },
            { nombre: 'Ciberseguridad', creditos: 4, semestre: 8, carrera: ingenieriaSistemas._id },
            { nombre: 'Ética Profesional en TI', creditos: 4, semestre: 8, carrera: ingenieriaSistemas._id },
        ];

        await Materia.insertMany(materias); // Inserta todas las materias
        console.log('Base de datos poblada con éxito.');
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    } finally {
        await mongoose.disconnect();
    }
})();
