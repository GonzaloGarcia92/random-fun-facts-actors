// Función para limpiar comentarios
function limpiarComentario(texto) {
    if (!texto) return '';
    let limpio = texto.replace(/\\r\\n/g, '\n');
    limpio = limpio.trim();
    if (limpio.length > 500) {
        limpio = limpio.substring(0, 500) + '...';
    }
    return limpio;
}
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/actor/facts', async (req, res) => {
    try {
        // Obtengo listado de actores
        const url = 'https://api.themoviedb.org/3/person/popular?api_key=62e9afa9b26ec1658e4f7c572663a19b';
        const response = await fetch(url);
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            return res.status(404).json({ error: 'No se encontraron personas.' });
        }

        // Selecciono un actor al azar
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
        const idMovie = randomMovie.id;

        // Consultar comentarios de la película
        const commentsUrl = `https://piuma04-github-io.onrender.com/comentario/${idMovie}`;
        let comentarioLimpio = '';
        try {
            const commentsResponse = await fetch(commentsUrl);
            if (!commentsResponse.ok) {
                throw new Error('Error al consultar comentarios: ' + commentsResponse.status);
            }
            const commentsData = await commentsResponse.json();
            comentarioLimpio = limpiarComentario(commentsData.comentario || commentsData.texto || JSON.stringify(commentsData));
        } catch (err) {
            console.error('Error consultando comentarios:', err.message);
            comentarioLimpio = 'No se pudieron obtener comentarios.';
            comentarioLimpio = '';
        }

        let msg = `${randomPerson.name} es conocid@ por ${randomMovie.title}. ${comentarioLimpio}`;
        // Limpia saltos de línea duplicados y espacios innecesarios
        //msg = msg.replace(/\\n/g, '\n');
        //msg = msg.replace(/\n{2,}/g, '\n').replace(/ +/g, ' ').trim();
        res.json({ texto: msg });
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la API de TMDB.' });
    }
});



