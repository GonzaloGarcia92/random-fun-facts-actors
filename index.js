const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/person/random', async (req, res) => {
    try {
        const url = 'https://api.themoviedb.org/3/person/popular?api_key=62e9afa9b26ec1658e4f7c572663a19b';
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron personas.' });
        }
        const randomPerson = data.results[Math.floor(Math.random() * data.results.length)];
        if (!randomPerson || !randomPerson.id) {
            return res.status(404).json({ error: 'No se encontró el ID de la persona.' });
        }
        // Consultar películas del actor
        const creditsUrl = `https://api.themoviedb.org/3/person/${randomPerson.id}/movie_credits?api_key=62e9afa9b26ec1658e4f7c572663a19b`;
        const creditsResponse = await fetch(creditsUrl);
        const creditsData = await creditsResponse.json();
        const movies = creditsData.cast;
        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: 'No se encontraron películas para esta persona.' });
        }
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        console.log('Película aleatoria:', randomMovie);
        idMovie = randomMovie.id;

        msg = randomPerson.name + " es conocid@ por " + randomMovie.title;
        res.json({ texto: msg });
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la API de TMDB.' });
    }
});



