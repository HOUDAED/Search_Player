let currentLang = 'fr';
let players = players_fr;

// Initialisation DOM
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const suggestionBox = document.getElementById("suggestions");
const resultContainer = document.getElementById("playerResult");
const themeButton = document.getElementById("themeButton");
const dateContainer = document.getElementById("currentDate"); // Ajout du conteneur pour afficher la date

// ===================
// 🌙 GESTION DU MODE
// ===================
function applyTheme(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        themeButton.textContent = '🌞';
    } else {
        document.body.classList.remove('dark-mode');
        themeButton.textContent = '🌙';
    }
    localStorage.setItem('theme', mode);
}

const storedTheme = localStorage.getItem('theme') || 'light';
applyTheme(storedTheme);

themeButton.addEventListener('click', () => {
    const newMode = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newMode);
});

// =======================
// 🌐 CHANGEMENT DE LANGUE
// =======================
function changeLanguage(lang) {
    currentLang = lang;
    players = lang === 'fr' ? players_fr : players_en;

    document.getElementById("title").textContent = lang === 'fr' ? "Recherche de Joueurs" : "Player Search";
    document.getElementById("pageTitle").textContent = lang === 'fr' ? "Recherche de Joueurs" : "Player Search";
    document.getElementById("nameOption").textContent = lang === 'fr' ? "Nom" : "Name";
    document.getElementById("positionOption").textContent = lang === 'fr' ? "Poste" : "Position";
    document.getElementById("teamOption").textContent = lang === 'fr' ? "Équipe" : "Team";
    searchInput.placeholder = lang === 'fr' ? "Tapez ici pour rechercher..." : "Type here to search...";
    searchButton.textContent = lang === 'fr' ? "🔍 Rechercher" : "🔍 Search";

    displayCurrentDate(); // mettre à jour la date lors du changement de langue
    performSearch(); // mettre à jour l'affichage
}

// ===================================
// 🔍 GESTION DE LA RECHERCHE & SAUVEGARDE
// ===================================
searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") performSearch();
});

function performSearch() {
    const criteria = document.getElementById("searchCriteria").value;
    const query = searchInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";

    if (query === "") {
        alert(currentLang === 'fr' ? 'Veuillez entrer un nom ou alias de joueur avant de lancer la recherche.' : 'Please enter a player name or alias before searching.');
        return;
    }

    // Sauvegarde dans l'historique
    let previousSearches = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!previousSearches.includes(query)) {
        previousSearches.push(query);
        localStorage.setItem("searchHistory", JSON.stringify(previousSearches));
    }

    const filtered = players.filter(player =>
        (criteria === "name" && (player.name.toLowerCase().includes(query) || player.alias.toLowerCase().includes(query))) ||
        (criteria === "position" && player.position.toLowerCase().includes(query)) ||
        (criteria === "team" && player.team.toLowerCase().includes(query))
    );

    resultContainer.innerHTML = "";

    if (filtered.length === 0) {
        resultContainer.innerHTML = `<p>${currentLang === 'fr' ? 'Aucun joueur trouvé.' : 'No player found.'}</p>`;
        return;
    }

    filtered.forEach(player => {
        const card = document.createElement("div");
        card.className = "player-details";
        card.innerHTML = `
            <h2>${player.name} <small>(${player.alias})</small></h2>
            <img src="${player.image}" alt="${player.name}" class="player-image"/>
            <p><strong>${currentLang === 'fr' ? 'Poste' : 'Position'}:</strong> ${player.position}</p>
            <p><strong>${currentLang === 'fr' ? 'Équipe' : 'Team'}:</strong> ${player.team}</p>
            <p><strong>${currentLang === 'fr' ? 'Âge' : 'Age'}:</strong> ${player.age}</p>
            <p><strong>${currentLang === 'fr' ? 'Nationalité' : 'Nationality'}:</strong> ${player.nationality}</p>
            <p><strong>${currentLang === 'fr' ? 'Historique du Club' : 'Club History'}:</strong></p>
            <ul>
                ${player.clubHistory.map(club => `<li>${club.club} (${club.years})</li>`).join('')}
            </ul>
            <p><strong>${currentLang === 'fr' ? 'Historique' : 'History'}:</strong> ${player.history}</p>
            <p><a href="${player.youtube}" target="_blank">${currentLang === 'fr' ? 'Voir les highlights' : 'Watch highlights'}</a></p>
        `;
        resultContainer.appendChild(card);
    });
}

// ==================================
// 💡 SUGGESTIONS AUTOMATIQUES
// ==================================
searchInput.addEventListener("input", () => {
    const inputVal = searchInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = "";
    if (inputVal.length === 0) return;

    const suggestionsSet = new Set();

    // noms et alias des joueurs
    players.forEach(player => {
        if (player.name.toLowerCase().startsWith(inputVal)) suggestionsSet.add(player.name);
        if (player.alias.toLowerCase().startsWith(inputVal)) suggestionsSet.add(player.alias);
    });

    // recherches précédentes
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history.forEach(item => {
        if (item.toLowerCase().startsWith(inputVal)) suggestionsSet.add(item);
    });

    // Afficher suggestions
    [...suggestionsSet].slice(0, 10).forEach(suggestion => {
        const li = document.createElement("li");
        li.className = "suggestion-item";
        li.textContent = suggestion;
        li.addEventListener("click", () => {
            searchInput.value = suggestion;
            suggestionBox.innerHTML = "";
            performSearch();
        });
        suggestionBox.appendChild(li);
    });
});

// Fermer suggestions si on clique ailleurs
document.addEventListener("click", (e) => {
    if (e.target !== searchInput) suggestionBox.innerHTML = "";
});

document.querySelector('.mode-button').addEventListener('click', () => {
document.body.classList.toggle('light-mode');
});

// =====================
// 📅 AFFICHAGE DE LA DATE ET HEURE ACTUELLE
// =====================

function displayCurrentDate() {
    const today = new Date();

    // Tableaux des jours de la semaine et des mois
    const joursSemaine = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    // Récupérer les différentes parties de la date
    const jourSemaine = joursSemaine[today.getDay()];
    const jourMois = today.getDate();
    const moisNom = mois[today.getMonth()];
    const annee = today.getFullYear();

    // Récupérer l'heure, minutes et secondes
    let heures = today.getHours();
    let minutes = today.getMinutes();
    let secondes = today.getSeconds();

    // Ajouter un zéro devant les valeurs inférieures à 10
    heures = heures < 10 ? '0' + heures : heures;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    secondes = secondes < 10 ? '0' + secondes : secondes;

    const heureActuelle = `${heures}:${minutes}:${secondes}`;

    // Formater la date selon la langue sélectionnée
    let formattedDate;
    if (currentLang === 'fr') {
        formattedDate = `${jourSemaine} ${jourMois} ${moisNom} ${annee} ${heureActuelle}`;
    } else {
        const joursSemaineEng = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const moisEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const jourSemaineEng = joursSemaineEng[today.getDay()];
        const moisEngNom = moisEng[today.getMonth()];
        formattedDate = `${jourSemaineEng} ${jourMois} ${moisEngNom} ${annee} ${heureActuelle}`;
    }

    // Afficher dans le conteneur
    dateContainer.textContent = formattedDate;
}

// Initialisation
displayCurrentDate();

// 🔄 Mise à jour toutes les secondes
setInterval(displayCurrentDate, 1000);

// 👀 Réagit au changement de thème clair/sombre
const observer = new MutationObserver(() => {
    displayCurrentDate();
});
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});
