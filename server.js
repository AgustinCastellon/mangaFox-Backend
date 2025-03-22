require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Proxy para obtener datos de MangaDex
app.get('/api/manga/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.mangadex.org/manga/${id}?includes[]=cover_art`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo datos del manga' });
    }
});

// Proxy para obtener las portadas
app.get('/api/covers/:mangaId/:fileName', async (req, res) => {
    try {
        const { mangaId, fileName } = req.params;
        const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        res.set('Content-Type', 'image/jpeg');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});