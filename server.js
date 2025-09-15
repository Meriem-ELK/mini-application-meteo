// Express : Framework web pour Node.js
const express = require('express')

// Créer une instance d'Express (notre serveur web)
const app = express();

// Charger les configurations (clé API, port,...)
const config = require('./config.js')

// Module 'request' pour faire des requêtes HTTP (API météo)
const request = require('request')

// fs: Module pour lire/écrire des fichiers 
const fs = require('fs')

// path : Module pour manipuler les chemins de fichiers
const path = require('path')



// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')))


// ========== ROUTE D'ERREUR ==========
// Route pour afficher une page d'erreur personnalisée
app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'))
})


// ===== ROUTE 1: ======================= RÉCUPÉRER ET SAUVEGARDER LES DONNÉES =====

// Route GET qui récupère les données météo et les sauvegarde
// :city est un paramètre dynamique (ex: /fetch=Montreal)
app.get('/fetch=:city', (req, res) => {
    const city = req.params.city   //// Récupère le nom de la ville dans l'URL

    console.log(`Recherche météo pour: ${city}`)
    
    // URL de l'API OpenWeatherMap avec paramètres
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.API_KEY}&units=metric&lang=fr`;

    // Faire la requête GET à l'API OpenWeatherMap
    request.get({url, json:true}, (err, response, data) => {
        if(err || response.statusCode != 200) {
            console.log('Erreur API:', err || `Status: ${response.statusCode}`)
            return res.redirect('/error')
        }
        
        console.log('Données météo récupérées avec succès')
        
        // Sauvegarde des données dans un fichier local nommé "ville.json"
        fs.writeFile(`data/${city.toLowerCase()}.json`, JSON.stringify(data, null, 2), (err) => {
            if(err) {
                console.log('Erreur sauvegarde:', err)
                return res.redirect('/error')
            }
            
            console.log(`Fichier ${city.toLowerCase()}.json sauvegardé`)

            // Rediriger vers la page de visualisation
            res.redirect(`/view?city=${city}`)
        })
    })
})

// ===== ROUTE 2: ======================= RÉCUPÉRER LES DONNÉES SAUVEGARDÉES =====
// Route GET qui lit et retourne les données sauvegardées
app.get('/data/:city', (req, res) => {

    // On récupère le nom de la ville à partir des paramètres de l'URL
    const city = req.params.city.toLowerCase()


    // Construction du chemin vers le fichier JSON correspondant à la ville
    const filePath = `${__dirname}/data/${city}.json`
    
    console.log(`Lecture du fichier: ${filePath}`)
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log('Fichier non trouvé:', filePath)
            return res.status(404).json({error: 'Données météo non trouvées'})
        }
        
        const weatherData = JSON.parse(data)  // Convertir le JSON en objet JS
        res.json(weatherData);
    })
})

// ===== ROUTE : ======================= POUR LA PAGE DE VISUALISATION =====
// Route GET qui sert la page HTML de visualisation
app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// ===== ROUTE : ======================= D'ACCUEIL =====
// Route GET pour la page d'accueil
app.get('/', (req, res) => {
    res.redirect('/view')
})

// ===== DÉMARRAGE DU SERVEUR =====
app.listen(config.PORT, () => {
    console.log(`Serveur météo démarré sur http://localhost:${config.PORT}`)
})