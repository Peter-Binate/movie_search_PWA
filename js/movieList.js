    const buttonSearchForm = document.getElementById('searchForm')

    buttonSearchForm.addEventListener('submit', function(event) {

        event.preventDefault(); 

        const searchQuery = document.getElementById('searchInput').value;
        const apiUrl = `https://api.tvmaze.com/search/shows?q=${searchQuery}`;
    
        // On fait appel à l'API avec l'URL dynamique
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // On affiche la liste des films qui correspondent à la recherche
                displayMovieNames(data)
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });

    });

    function displayMovieNames(data) {
        const movieList = document.getElementById('movieList');
        // On efface le contenu précédent de la liste
        movieList.innerHTML = ''; 

        // On parcours les données et on créé des éléments <li>
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.show.name; // On ajoute le nom du film comme contenu de l'élément <li>
            movieList.appendChild(li); // On ajoute l'élément <li> à la liste

            const link = document.createElement('a');
            link.textContent = 'détails'; // Affiche le nom du film
            link.href = `movieDetails.html?id=${item.show.id}`; // Lien vers la page de détails avec l'ID du film comme paramètre
            link.setAttribute('target', '_blank'); // On ajoute un attribut target="_blank" pour ouvrir le lien dans un nouvel onglet 
            li.appendChild(link); // On ajoute le lien à l'élément <li>
            link.style.marginLeft = '5px'; // On ajoute une marge à gauche de 30px
            movieList.appendChild(li); // On ajoute l'élément <li> à la liste
            
        });
    }