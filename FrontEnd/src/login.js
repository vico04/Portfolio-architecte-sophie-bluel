//Fonction pour paramétrer la validation de l'email
const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9. ! #$%&'*+/= ? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //test true or false du regex
    return regex.test(email);
};

//Fonction pour paramétrer le champs mdp
const validateMotdepasse = (motdepasse) => {
    return motdepasse.trim() !== ""; //Pour vérifier que le champ n'est pas vide
};

//Fonction pour afficher le message d'erreur
const messageError = (InputId, message) => {
    //On récuprère la donnée Input id=
    const inputText = document.querySelector(InputId);
    inputText.style.border = "1px solid red";
    inputText.setAttribute("placeholder", message); //Mettre le message d'erreur dans le holder
};

//Suppression des messages d'erreurs
const resetError = () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
        input.style.border = "";
        input.removeAttribute("placeholder");
    });
};

const login = async (email, password) => {
    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        //Vérification de la bonne reception du post
        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            //Stockage du token dans le localstorage
            localStorage.setItem("token", data.token);
            //Rediriger l'utilisateur vers la page d'accueil
            window.location.href = "/index.html";
            //Gestion des différentes erreurs possibles
        } else {
            if ((response.status === 404, 401)) {
                alert("Veuillez saisir un email ou mot de passe valide");
            } else if (response.status === 500) {
                alert("Erreur : Problème du serveur");
            } else {
                alert("Erreur inattende. Code : " + response.status);
            }
        }
    } catch (error) {
        //Connexion à l'API echouée
        alert("Impossible de se connecter.");
    }
};

const init = () => {
    //Récupération du form
    const formLogin = document.querySelector("form");
    //Ajout de l'évènement submit
    formLogin.addEventListener("submit", function (event) {
        //Annuler le comportement par défaut
        event.preventDefault();
        //Récupérer les valeurs des input
        const email = document.getElementById("email").value;
        const motdepasse = document.getElementById("motdepasse").value;

        resetError();
        //Contrôle des valeurs
        let formIsValid = true;

        if (!validateEmail(email)) {
            messageError("#email", "adresse email non valide.");
            formIsValid = false;
        }
        if (!validateMotdepasse(motdepasse)) {
            messageError("#motdepasse", "veuillez renseigner votre mot de passe");
            formIsValid = false;
        }
        if (formIsValid) {
            login(email, motdepasse); //Appel
        }
    });
};

// Appeler la fonction
init();
