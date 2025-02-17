/**
 * Extraction du paramètre "id" de l'URL afin de determiner quel produit afficher.
 * 
 */
const params = new URL(document.location).searchParams;
const id = params.get("id"); // Permet de pointer le id du canape

/**
 * On utilise l'ID extrait pour ffaire une requete HTTP à l'API pour obtenir les informations du produit correspondant.
 * @returns la réponse est ensuite transformée en JSON
 */
const getCanape = async () => {       
    try {
        const url = await fetch(`http://localhost:3000/api/products/${id}`);
        const reponse = await url.json();
        return reponse;
    } catch (erreur) {
        console.error("Une erreur s'est produite lors de l'importation des canape")
    }
}
/**
 * Cette fonction fait le lien entre les éléments du DOM est les canape de l'API
 * Elle permet d'afficher les différentes informations du canape;
 */

const fillCanapeData = async () => {
    const canapeData = await getCanape()
    const descrptionDomElement = document.getElementById('description');
    const nameDomElement = document.getElementById('title');
    const prixDomElement = document.getElementById('price');
    const optionsDomElement = document.getElementById('colors');    
    const imageDomElement = document.querySelector('.item__img');
    

    const imageElement = document.createElement('img');
    // On insere les bonnes informations au bon endroit
    descrptionDomElement.innerHTML = canapeData.description;
    nameDomElement.innerHTML = canapeData.name;
    prixDomElement.innerHTML = canapeData.price;
    for (i in canapeData.colors) {
    optionsDomElement.innerHTML += `<option value=${canapeData.colors[i]}>${canapeData.colors[i]}</option>`
    };
    imageDomElement.appendChild(imageElement);
    imageElement.setAttribute('src', `${canapeData.imageUrl}`);
    imageElement.setAttribute('alt', `${canapeData.altTxt}`);
};




const quantityDomElement = document.getElementById('quantity');

/**
 * Ajout des éléments dans le panier
 * On pointe le panier dans le DOM
 * création d'un tableau vide pour stocker les ajout au panier 
 * Création d'un objet qui stock les détails du produit, on va pouvoir utiliser avec localeStorage
 */

/**
 * Enregistre le contenu du panier dans le localStorage.
 * @param {Array} cart - Le tableau représentant le contenu du panier à enregistrer.
 */
function savePanier(cart) {
    localStorage.setItem("addToCart", JSON.stringify(cart));
}

/**
 * Récupére le contenu du panier à partir du localStorage ou retourne un tableau vide s'il n'y a rien enregistré.
 * @returns {Array} - Le tableau représentant le contenu du panier
 */
function getPanier() {
    let cart = localStorage.getItem("addToCart");
    return cart ? JSON.parse(cart) : [];

}

/**
 * 
 * @param {Object} product - L'objet représentant le produit à ajouter ou mettre à jour dans le panier.
 * @returns 
 */
function addpanier(product) {
    const cart = getPanier();
    let foundProduct = cart.find(p => p.id === product.id && p.colors === product.colors);
    if(foundProduct === undefined) {
        cart.push(product);
        //savePanier(cart)
    } else if (typeof foundProduct === 'object') {
        foundProduct.quantity += product.quantity;
    }

    cart.forEach(cartItem => {
        cartItem.total = cartItem.price * cartItem.quantity;
    })

    savePanier(cart);

}


/**
 * Création d'un événement afin de mettre les canape dans le panier lors du clic sur le bouton
 * 
 */
    const cartDomElement = document.getElementById("addToCart"); // Creer une variable pour l'id du button
    cartDomElement.addEventListener("click", async () => { // On écoute le button lors du click
        const quantity = parseInt(document.getElementById('quantity').value);// Récupére la quantité saisie et vérifie avec parseInt que c'est un nombre entier
        const color = document.getElementById('colors').value;
        const imgUrl = document.querySelector('.item__img img').src;
        const price = document.getElementById("price").innerHTML;
        const name = document.getElementById("title").innerHTML;

       // Création d'un objet représentant le produit et qui stock ses informations
       const productElement = {
            image : imgUrl,
            price: price ,
            title: name,
            quantity : quantity,
            colors: color,
            id : id
        }  
        
      
        /**Cette boucle vérifie si la quantité est un nombre supérieur ou égale à 1
         * Si la couleur est selectionné
         * 
         */ 
     

        if (isNaN(quantity) || quantity < 1 || quantity > 100 || color === '') {
            const alertText = document.createElement('p');
            document.querySelector('.item__content').appendChild(alertText)
            alertText.innerHTML = "Veuillez choisir une quantité et une couleur svp.";
            alertText.style.color = 'red';
            alertText.style.fontWeight = 'bold';
            alertText.style.textAlign = 'center';
            cartDomElement.style.boxShadow = '0 0 22px 6px rgba(217, 39, 39, 0.6)';

            return;
        }
        addpanier(productElement);
    
    })



fillCanapeData() 