document.addEventListener('DOMContentLoaded', () => {
    
    // Variables globales liées aux éléments HTML
    const saisieVille = document.getElementById('villeInput');
    const boutonRecherche = document.getElementById('recherrcheBtn');
    const affichageMeteo = document.getElementById('affichageMeteo');

    // Fonction pour afficher le message de chargement
    function afficherChargement() {
        affichageMeteo.innerHTML = `
            <div class="weather-card">
                <div class="loading">
                    <div class="loading-icon">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <h3>Récupération des données...</h3>
                    <p>Veuillez patienter quelques instants</p>
                </div>
            </div>
        `;
    }

    // Fonction pour afficher un message d'erreur
    function afficherErreur(message) {
        affichageMeteo.innerHTML = `
            <div class="weather-card">
                <div class="error">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4>Erreur</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    // Fonction pour retourner une icône en fonction de la description météo
    function obtenirIconeMeteo(description) {
        const descriptionMinuscule = description.toLowerCase(); // On passe tout en minuscule pour une comparaison cohérente

        // On regarde ce que contient la description pour choisir une icône
        if (descriptionMinuscule.includes('soleil') || descriptionMinuscule.includes('claire')) {
            return 'fas fa-sun';
        } else if (descriptionMinuscule.includes('nuage')) {
            return 'fas fa-cloud';
        } else if (descriptionMinuscule.includes('pluie')) {
            return 'fas fa-cloud-rain';
        } else if (descriptionMinuscule.includes('orage')) {
            return 'fas fa-bolt';
        } else if (descriptionMinuscule.includes('neige')) {
            return 'fas fa-snowflake';
        } else {
            return 'fas fa-cloud-sun'; // Icône par défaut
        }
    }

    // Fonction qui prend les données météo et les affiche dans le HTML
    function afficherDonneesMeteo(donnees) {
        const classeIcone = obtenirIconeMeteo(donnees.weather[0].description);

        // On insère dynamiquement les données météo dans la page
        affichageMeteo.innerHTML = `
            <div class="weather-card">
                <div class="weather-header">

                    <div class="city-name">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donnees.name}, ${donnees.sys.country}</span>
                    </div>

                    <div class="infoMeteo">
                            <div class="weather-icon">
                                <i class="${classeIcone}"></i>
                            </div>
                            
                            <div class="temperature">
                                ${Math.round(donnees.main.temp)}°C
                            </div>
                            
                            <div class="weather-description">
                                ${donnees.weather[0].description}
                            </div>
                    </div>
                    
                </div>
                
                <div class="weather-details">
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-thermometer-half"></i>
                            </div>
                            <div class="detail-label">Ressenti</div>
                        </div>
                        <div class="detail-value">${Math.round(donnees.main.feels_like)}°C</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-tint"></i>
                            </div>
                            <div class="detail-label">Humidité</div>
                        </div>
                        <div class="detail-value">${donnees.main.humidity}%</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-gauge-high"></i>
                            </div>
                            <div class="detail-label">Pression</div>
                        </div>
                        <div class="detail-value">${donnees.main.pressure} hPa</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-wind"></i>
                            </div>
                            <div class="detail-label">Vent</div>
                        </div>
                        <div class="detail-value">${donnees.wind?.speed || 0} m/s</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-eye"></i>
                            </div>
                            <div class="detail-label">Visibilité</div>
                        </div>
                        <div class="detail-value">${donnees.visibility ? (donnees.visibility / 1000).toFixed(1) : 'N/A'} km</div>
                    </div>
                    
                    <div class="detail-card">
                        <div class="detail-header">
                            <div class="detail-icon">
                                <i class="fas fa-cloud"></i>
                            </div>
                            <div class="detail-label">Couverture</div>
                        </div>
                        <div class="detail-value">${donnees.clouds?.all || 0}%</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction exécutée lors de la recherche d'une ville
    function rechercherMeteo() {
        const ville = saisieVille.value.trim();  // Récupère et nettoie le nom de la ville

        // Si l'utilisateur n'a rien entré
        if (!ville) {
            afficherErreur('Veuillez entrer le nom d\'une ville');
            return;
        }

        afficherChargement();  // On montre l'animation de chargement

        // Redirige vers une URL contenant la ville
        window.location.href = `/fetch=${ville}`;
    }

    // Fonction appelée automatiquement si l'URL contient une ville (comme ?city=Montreal)
    function chargerMeteoDepuisURL() {
        const parametresURL = new URLSearchParams(window.location.search); // Récupère les paramètres de l'URL
        const ville = parametresURL.get('city'); // On cherche le paramètre "city"

        if (ville) {
            saisieVille.value = ville;
            afficherChargement();

            // Requête fetch pour récupérer les données depuis `/data/{ville}`
            fetch(`/data/${ville}`)
                .then(reponse => {
                    if (!reponse.ok) {
                        throw new Error('Données météo non trouvées');
                    }
                    return reponse.json(); // Conversion en JSON
                })
                .then(donnees => {
                    afficherDonneesMeteo(donnees); // Affiche les données récupérées
                })
                .catch(erreur => {
                    console.error('Erreur:', erreur);
                    afficherErreur('Impossible de récupérer les données météo. Veuillez réessayer.');
                });
        }
    }

    // Ajoute un écouteur d'événement au clic sur le bouton de recherche
    boutonRecherche.addEventListener('click', rechercherMeteo);

    // Ajoute un écouteur sur le champ input pour permettre la recherche via la touche "Entrée"
    saisieVille.addEventListener('keypress', function (evenement) {
        if (evenement.key === 'Enter') {
            evenement.preventDefault(); 
            rechercherMeteo();
        }
    });

    // Charger les données au chargement de la page
    chargerMeteoDepuisURL();
});