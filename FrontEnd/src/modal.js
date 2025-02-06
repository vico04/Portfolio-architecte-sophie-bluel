import { displayWork, getCategories } from "./script.js";

const displayGalleryModal = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();
        //Nettoyage de la gallery
        const galleryModal = document.querySelector(".galleryModal");
        galleryModal.innerHTML = "";
        //Ajout des données API works à la gallery
        const displayWorkModal = (work) => {
            //Création de conteneur individuel
            const baliseSpanImg = document.createElement("span");
            baliseSpanImg.classList.add("imageContainer");
            baliseSpanImg.dataset.id = work.id; //Accéder à l'id pour gerer les suppressions
            //Creation de la div image
            const baliseImageModal = document.createElement("img");
            baliseImageModal.src = work.imageUrl;
            baliseImageModal.alt = work.title;
            baliseImageModal.title = work.title;
            baliseImageModal.classList.add("gallery-image");
            //Icon de suppression
            const baliseDeleteIcon = document.createElement("i");
            baliseDeleteIcon.classList.add("fa-solid", "fa-trash-can");
            //Ajout image et icone dans le span
            baliseSpanImg.appendChild(baliseImageModal);
            baliseSpanImg.appendChild(baliseDeleteIcon);
            //Ajout des images à la div gallery modal
            galleryModal.appendChild(baliseSpanImg);
        };
        //Appel de la fonction displayWorkModal()
        data.forEach(displayWorkModal);

        // Creation de l'identification de l'id pour la suppression
        const deleteIcons = document.querySelectorAll(".fa-solid.fa-trash-can");
        deleteIcons.forEach((icon) => {
            icon.addEventListener("click", async (event) => {
                const imageContainer = event.target.closest(".imageContainer");
                const id = imageContainer.dataset.id;
                // Confirmation avant suppression
                const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?");
                if (confirmation) {
                    try {
                        // Appel de la fonction de suppression au serveur avec await
                        const imageDeleted = await imageDelete(id); // Await pour attendre la réponse de l'API

                        if (imageDeleted) {
                            // Supprimer l'image du DOM seulement après la confirmation de suppression
                            imageContainer.remove();
                            // Actualise la galerie principale
                            updateMainGallery();

                            // Afficher un message de confirmation
                            alert("Photo supprimée avec succès !");
                        } else {
                            alert("Image non suprimée");
                        }
                    } catch (error) {
                        alert("Erreur lors de la suppression de l'image.");
                    }
                }
            });
        });

        //Creation des categories de la modale
        const categories = await getCategories(); //Recupère les données API

        const filteredCategories = categories.filter((category) => category.name !== "Tous");

        //Recuperer la balise select
        const baliseSelect = document.getElementById("categories");
        baliseSelect.innerHTML = "";

        filteredCategories.forEach((category) => {
            const baliseOption = document.createElement("option");
            baliseOption.setAttribute("value", category.id);
            baliseOption.textContent = category.name;
            baliseSelect.appendChild(baliseOption);
        });
    } catch (error) {
        alert("Impossible de charger les travaux.");
    }
};

//Création en JS du formulaire de selection modale2
const baliseLabel = document.createElement("label");
baliseLabel.setAttribute("for", "title");
baliseLabel.textContent = "Titre";
const baliseInput = document.createElement("input");
baliseInput.type = "text";
baliseInput.name = "title";
baliseInput.id = "title";
baliseInput.classList.add("inputSize");
const baliseLabel2 = document.createElement("label");
baliseLabel2.setAttribute("for", "categories");
baliseLabel2.textContent = "Catégorie";
const baliseSelect = document.createElement("select");
baliseSelect.id = "categories";
baliseSelect.name = "categories[] multiple";
const baliseLine = document.createElement("hr");
baliseLine.classList.add("modalLine2");
const baliseInput2 = document.createElement("input");
baliseInput2.type = "submit";
baliseInput2.classList.add("submitNewProject");
baliseInput2.setAttribute("value", "Valider");
//Ajout de chaque élément
const baliseIdentification = document.querySelector(".identification");
baliseIdentification.appendChild(baliseLabel);
baliseIdentification.appendChild(baliseInput);
baliseIdentification.appendChild(baliseLabel2);
baliseIdentification.appendChild(baliseSelect);
baliseIdentification.appendChild(baliseLine);
baliseIdentification.appendChild(baliseInput2);

//Ouverture de la modale
export const openModal = () => {
    const modalBox = document.getElementById("modalBox");
    modalBox.style.display = "flex";

    //Ouverture de la modale sur la premiere page
    const modalContent1 = document.getElementById("firstModalContent");
    const modalContent2 = document.getElementById("secondModalContent");

    modalContent1.style.display = "block";
    modalContent2.style.display = "none";
    //Appel pour maj de la gallery modale
    displayGalleryModal();
};

// Mise à jour de la gallery
const updateMainGallery = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const data = await response.json();

        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = ""; // Vide la galerie principale avant de la mettre à jour

        // Affichage des nouvelles images dans la galerie principale
        data.forEach((work) => {
            const baliseFigure = document.createElement("figure");
            const baliseImage = document.createElement("img");
            baliseImage.src = work.imageUrl;
            baliseImage.alt = work.title;

            const baliseFigcaption = document.createElement("figcaption");
            baliseFigcaption.textContent = work.title;

            baliseFigure.appendChild(baliseImage);
            baliseFigure.appendChild(baliseFigcaption);
            gallery.appendChild(baliseFigure);
        });
    } catch (error) {
        alert("Erreur lors de la mise à jour de la galerie principale.");
    }
};

//Fermeture de la modale
const closeModal = () => {
    const modalBox = document.getElementById("modalBox");
    modalBox.style.display = "none";
};

//Gestion de la 2ème page de la modale
const openAddProjetFormModal = () => {
    // Cacher le contenu de la 1ere page
    const modalContent1 = document.getElementById("firstModalContent");
    modalContent1.style.display = "none";
    // Afficher le contenu de la 2eme page modale
    const modalContent2 = document.getElementById("secondModalContent");
    modalContent2.style.display = "block";
};

//Retour à la premiere section de la modale
const openGalleryModal = () => {
    //Cacher le contenu de la 2eme page
    const modalContent2 = document.getElementById("secondModalContent");
    modalContent2.style.display = "none";
    //Afficher le contenu de la 1ere page modale // RAPPEL DE DISPLAYGALLERIE
    const modalContent1 = document.getElementById("firstModalContent");
    modalContent1.style.display = "block";
};

//Suppression des images de l'api
const imageDelete = async (id) => {
    try {
        const token = localStorage.getItem("token"); //Récupération du token
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Ajouter le token
            },
        });
        if (response.ok) {
            return true;
        } else {
            if (response.status === 401) {
                alert("Non autorisé");
            } else if (response.status === 500) {
                alert("Comportement inattendu");
            }
            return false;
        }
    } catch (error) {
        alert("Suppression impossible");
    }
};

//ENVOI DU NOUVEAU PROJET A API
//Selectionner de l'input addPhoto
document.getElementById("photo").addEventListener("change", (event) => {
    const newPhoto = event.target.files[0]; //Séléction de tous les fichiers photos
    const previewContainer = document.getElementById("photoPreview"); //Conteneur de prévisualisation
    const previewImage = document.getElementById("previewImage"); //Prévisualisation de la photo
    const addPhotoButton = document.querySelector(".addPhotoButton");

    //Fonction lorsque le fichier a été selectionné
    if (newPhoto) {
        const reader = new FileReader(); // Lecteur du contenu du ficher selectionné
        //Fonction pour determiner la suite une fois le reader chargé
        reader.onload = (e) => {
            //e correspond à l'assignation automtique de l'évement à reader
            previewImage.src = e.target.result; //Ajout de la source à img
            previewContainer.style.display = "flex"; // Afficher le conteneur de la prévisualisation
            addPhotoButton.style.display = "none"; //Cacher le bouton
        };

        //Lecture du fichier selectionné
        reader.readAsDataURL(newPhoto);
    } else {
        // Si aucun fichier n'est sélectionné, cacher la prévisualisation et réafficher le bouton
        previewContainer.style.display = "none";
        addPhotoButton.style.display = "flex";
        previewContainer.style.display = "none";
        document.getElementById("photo").style.display = "block";
    }
});

//Parametrage de la fonction du nouveau projet
const addNewProject = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const title = document.getElementById("title").value;
    const categoryId = parseInt(document.getElementById("categories").value);
    const photo = document.getElementById("photo").files[0]; // Récupère le premier fichier sélectionné

    //Controle du formulaire et alerte si incomplet
    if (!title || isNaN(categoryId) || !photo) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    //Vérification du type de fichier
    const photoName = photo.name.split(".");
    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    //Recupération de la dernière extension du fichier
    if (!allowedExtensions.includes(photoName[photoName.length - 1])) {
        alert("le type de fichier n'est pas auorisé ");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", photo);
    formData.forEach((value, key) => {});

    //Récupération du token
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        // Verification de la reponse et action
        if (response.ok) {
            const newWork = await response.json();

            // Appel de la fonction pour ajouter le projet à la galerie
            displayWork(newWork);

            // //Appel de la mise à jour de la gallery
            updateMainGallery();

            // Réinitialisation du formulaire
            resetFormAddPhoto();

            // Fermeture de la modale
            closeModal();
            alert("Le projet a été ajouté avec succès !");
        } else {
            alert("Erreur pour ajouter le projet");
        }
    } catch (error) {
        alert("Erreur lors de l'envoi des données.");
    }
};

//Reinitialisation du formulaire lors du retour en arrière
const resetFormAddPhoto = () => {
    const form = document.querySelector("form");

    // Cacher la prévisualisation de l'image
    const previewContainer = document.getElementById("photoPreview");
    const addPhotoButton = document.querySelector(".addPhotoButton");
    previewContainer.style.display = "none"; // Cacher la prévisualisation
    addPhotoButton.style.display = "flex"; // Afficher le bouton d'ajout de photo
    //Nettoyer l'inpu photo
    const inputPhotoClear = document.getElementById("photo");
    inputPhotoClear.value = ""; //Chemin selectionné ou vide dans notre cas

    //Réinitialiser le champ "Titre"
    const titleInput = document.getElementById("title");
    titleInput.value = ""; // Vider le champ "Titre"
};

//Appel du display dans la fonction init
const initModal = () => {
    displayGalleryModal();
    //Sélection de touts les croix de la modale puis forEach pour chacune
    const crossesModal = document.querySelectorAll(".fa-solid.fa-xmark");
    crossesModal.forEach((crossModal) => {
        crossModal.addEventListener("click", (event) => {
            closeModal();
            resetFormAddPhoto();
        });
    });

    //Fermeture sur l'overlay
    const modalBox = document.getElementById("modalBox");
    modalBox.addEventListener("click", (event) => {
        if (event.target === modalBox) {
            //event.target pour selectionner l'élément qui déclenche l'évènement
            closeModal();
            resetFormAddPhoto();
        }
    });

    //Appel du passage à la deuxieme page modale
    const labelButton = document.querySelector(".labelEvent");
    labelButton.addEventListener("click", (event) => {
        //Annuler le comportement par défaut de l'input et du label
        event.preventDefault();
        //Appel de la fonction
        openAddProjetFormModal();
    });

    const returnButton = document.querySelector(".fa-solid.fa-arrow-left");
    returnButton.addEventListener("click", (event) => {
        openGalleryModal();
        resetFormAddPhoto();
    });

    const addToGallery = document.querySelector(".submitNewProject");
    addToGallery.addEventListener("click", (event) => {
        addNewProject(event);
    });
};

initModal();
