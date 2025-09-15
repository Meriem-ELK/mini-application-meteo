# TP 1 — Mini-application Météo avec Node.js et API OpenWeatherMap

Cette min-application web développée avec Node.js et Express, qui se connecte à l'API OpenWeatherMap pour récupérer des données météorologiques en temps réel

L'application permet de faire des requêtes avec le nom de la ville, de sauvegarder les résultats dans un fichier JSON local, et d'afficher ces informations sur une interface HTML dynamique.

De plus, l'application protège les clés d'API grâce à un fichier .env pour assurer la sécurité des informations sensibles.

##  Fonctionnalités de l'application

L'application permet de :

- Rechercher la météo d'une ville via une interface utilisateur
- Faire une requête dynamique à l'API OpenWeatherMap avec le nom de la ville
- Sauvegarder les données météorologiques dans un fichier .json local
- Protéger la clé API dans un fichier .env pour la sécurité
- Afficher les données dans une interface HTML
- Gérer les erreurs avec une page d'erreur pour les villes non trouvées

## Structure des routes Express

**Route de récupération :  /fetch/:city**

- Envoie une requête GET à l'API OpenWeatherMap avec le nom de ville fourni
- Sauvegarde la réponse dans un fichier .json
- Redirige vers la route /view?city=xx pour afficher les résultats

**API de données : /data/:city**

- Lit les données météorologiques sauvegardées dans le fichier .json
- Retourne les données au format JSON
- Gère les erreurs si la ville n'est pas trouvée

**Interface principale  /view**

- Page (index.html) avec interface de recherche
- Utilise JavaScript pour récupérer les données
- Affiche les informations météo complètes

**Gestion d'erreurs**

- Page d'erreur dédiée (error.html) pour les villes non trouvées
- Messages d'erreur informatifs pour l'utilisateur
