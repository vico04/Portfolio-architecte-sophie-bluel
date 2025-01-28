import { openModal } from "./modal.js";

export const getCategories = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    return [{ id: 0, name: "Tous" }, ...data];
};

//fonction réutilisable récupération des données
const getWorks = async () => {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    return data;
};

//Creation du mode administrateur
//Balise hypertext
const baliseHypertxt = document.createElement("a");
baliseHypertxt.href = "#";
//icone + class
const baliseIcon = document.createElement("i");
baliseIcon.classList.add("fa-regular", "fa-pen-to-square");
//span + class
const baliseSpan = document.createElement("span");
baliseSpan.classList.add("editionModeTxt");
baliseSpan.textContent = "Mode édition";
//Ajout du span et de l'icone dans le lien
baliseHypertxt.appendChild(baliseIcon);
baliseHypertxt.appendChild(baliseSpan);
//Ajout dans la div
const editionMode = document.querySelector(".editionMode");
editionMode.appendChild(baliseHypertxt);

//Créer les éléments html d'un projet puis les formater et les insérer dans la div gallery
export const displayWork = (work) => {
    //Création de la balise figure
    const baliseFigure = document.createElement("figure");
    //Creation de l'image
    const baliseImage = document.createElement("img");
    baliseImage.src = work.imageUrl;
    baliseImage.alt = work.title;
    //Création balise figcaption
    const baliseFigcaption = document.createElement("figcaption");
    baliseFigcaption.textContent = work.title;
    //Ajout de l'image et la figcaption à la figure
    baliseFigure.appendChild(baliseImage);
    baliseFigure.appendChild(baliseFigcaption);
    //Ajout de la figure à la gallery
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(baliseFigure);
};

//Creation du nettoyage de la gallerie
const resetGallery = () => {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
};

//Creation du comportement de filtrage
const filterWorks = (works, categoryID) => {
    if (categoryID === 0) {
        return works;
    } else {
        return works.filter((work) => work.categoryId === categoryID);
    }
};

let sizeBox = 0;
//Creation des filtres et recupération des catégories
const displayCategory = (category) => {
    const baliseButton = document.createElement("button");
    baliseButton.classList.add("boxFilter");
    //Création balise span
    const baliseSpan = document.createElement("span");
    baliseSpan.classList.add("sizetextFilterTous");
    baliseSpan.classList.add(`box-${sizeBox + 1}`);
    sizeBox++;
    baliseSpan.textContent = category.name;
    //Ajout du span au button et du button à la div
    baliseButton.appendChild(baliseSpan);
    const filter = document.querySelector(".filter");
    filter.appendChild(baliseButton);
    //Attribut data du bouton
    baliseButton.dataset.categoryId = category.id;

    //Tous garde le clicked par défaut
    if (category.name === "Tous") {
        baliseButton.classList.add("clicked");
    }

    //Ajout evènement click
    baliseButton.addEventListener("click", () => {
        //Ajout du background fixe au clic
        const backgroundFilters = document.querySelectorAll(".boxFilter");
        //Suppression de la class clicked sur tous les bouton
        backgroundFilters.forEach((filter) => filter.classList.remove("clicked"));
        //Ajout de la class filtre sur le bouton cliqué
        baliseButton.classList.add("clicked");

        const categoryID = parseInt(baliseButton.dataset.categoryId, 10); //Conversion de la chaine de caractère
        const filteredWorks = filterWorks(window.works, categoryID); //windows pour la liste complète des works
        resetGallery();
        filteredWorks.forEach((work) => displayWork(work));
    });
};

const displayModal = () => {
    const editionModeTxt2 = document.querySelector(".editionModeTxt2");
    if (editionModeTxt2) {
        editionModeTxt2.addEventListener("click", (event) => {
            //annuler l'action du lien par défaut
            event.preventDefault();
            openModal();
        });
    }
};

const logout = () => {
    // Sélectionner l'élément de déconnexion
    const logoutButton = document.getElementById("logout");
    // Configuration de l'évènement click
    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            // Annuler le comportement par défaut du lien
            event.preventDefault();
            // Vider le localStorage
            localStorage.removeItem("token");
            // Rediriger l'utilisateur vers la page de connexion
            window.location.href = "/login.html";
        });
    }
};

const userLogged = () => {
    const editionMode = document.querySelector(".editionMode");
    const editionModeTxt2Link = document.getElementById("editionModeTxt2Link");
    const filterCategories = document.querySelector(".filter");
    const spaceBetween = document.querySelector(".gallery");
    const logginButton = document.getElementById("login");
    const logoutButton = document.getElementById("logout");

    //Afficher la condition
    if (localStorage.getItem("token")) {
        //Affichage des éléments admin
        editionMode.style.display = "flex";
        editionModeTxt2Link.style.display = "flex";
        filterCategories.style.display = "none";
        spaceBetween.style.marginTop = "50px";
        logginButton.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        //Non affichage des éléments admin
        editionMode.style.display = "none";
        editionModeTxt2Link.style.display = "none";
        filterCategories.style.display = "flex";
        logginButton.style.display = "block";
        logoutButton.style.display = "none";
    }
};

const init = async () => {
    //Initialisation des works
    const works = await getWorks();
    window.works = works;
    // faire la boucle sur works et dans la boucle déclarer ce que je veux faire (displayWork)
    works.forEach((work) => {
        displayWork(work);
    });

    //Initialisation des catégories // A FAIRE, condition pour affichage du filtre
    const categories = await getCategories();
    categories.forEach((category) => {
        displayCategory(category);
    });

    //Appel des fonctions
    userLogged();
    displayModal();
    logout();
};

init();
