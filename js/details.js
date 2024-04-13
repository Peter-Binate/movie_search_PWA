document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    fetch(`https://api.tvmaze.com/shows/${movieId}`)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des détails du film :', error);
        });
});

function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = `
        <h2>${movie.name}</h2>
        <img src="${movie.image.medium}" alt="${movie.name}">
        <p>${movie.summary}</p>
    `;
}
