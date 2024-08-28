const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'data.env') });  // Cargar variables desde data.env

const app = express();
const port = 5001;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Usa la variable de entorno
        pass: process.env.EMAIL_PASS // Usa la variable de entorno
    }
});

// Route to handle the form submission
app.post('/send-email', (req, res) => {
    const { nombre, email, telefono, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER, // Usar el correo del que envías
        to: process.env.EMAIL_USER, // Enviar a tu correo
        subject: 'Nuevo mensaje desde la página web',
        text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error enviando correo:', error);
            return res.status(500).send('Error al enviar el correo.');
        }
        console.log('Correo enviado:', info.response);
        res.status(200).send('Correo enviado correctamente.');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
