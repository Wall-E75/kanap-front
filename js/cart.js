//Récupére les donnée du localstorage stockées via la page produit
function savePanier(cart) {
  localStorage.setItem("addToCart", JSON.stringify(cart));
}
/**
 * 
 * @returns renvoi
 */
function getPanier() {
  let cart = localStorage.getItem("addToCart");
  return cart ? JSON.parse(cart) : [];
}
// Variable pour utiliser les produits dans le localStorage
const products = getPanier();

//Mise en relation avec les elements du DOM
const sectionCartItem = document.getElementById("cart__items");
const spanTotalQuantity = document.getElementById("totalQuantity");
const spanTotalPrice = document.getElementById("totalPrice");
const firstNameError = document.getElementById("firstNameErrorMsg");
const imageDomElement = document.querySelector('.cart__item__img');


/**
 * La fonction afficherCanape permet d'afficher les canapés du localStorage 
 * à l'intérieur de la page Panier lors du chargement de la page
 */
const afficherCanape = async () => {
  
  if (products.length > 0) {
    
    let htmlString = '';
    products.forEach((product) => {

      htmlString += `<article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
         <div class="cart__item__img">
            <img src="${product.image}" alt="Photographie d'un canapé">
         </div>
         <div class="cart__item__content">
           <div class="cart__item__content__description">
             <h2>${product.title? product.title: 'no title added'}</h2>
             <p>${product.colors}</p>
             <p>${product.total? product.total: 'no price added'} €</p>
           </div>
           <div class="cart__item__content__settings">
             <div class="cart__item__content__settings__quantity">
               <p>Quantité :</p>
               <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
             </div>
             <div class="cart__item__content__settings__delete">
               <p class="deleteItem">Supprimer</p>
             </div>
           </div>
         </div>
       </article>`
    });
    sectionCartItem.innerHTML = htmlString;
  }
}

afficherCanape()

sectionCartItem.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteItem")) {
  const productId = e.target.closest(".cart__item").getAttribute("data-id");
  const productColor = e.target.closest(".cart__item").getAttribute("data-color");

  const removeProduct = products.filter((product) => {
    return product.id === productId && product.colors !== productColor
  });
  savePanier(removeProduct)

  
  afficherCanape();
  //window.addEventListener("load", afficherCanape);
  window.location.reload()
}
});



/**
 * Utilise un écouteur d'evenement (change) afin de mettre à jour plusieurs élément lors du changement de quantité :
 * Le localStorage : la quantité et le total affiché affiche le même résultat que sur la page.
 * Fais une opération pour mettre à jour le résultat
 */
const itemQuantityDomElements = document.querySelectorAll("input.itemQuantity");
itemQuantityDomElements.forEach((itemQuantityDomElement) => {
  itemQuantityDomElement.addEventListener("change", (e) => {
    const productId = e.currentTarget.closest(".cart__item").getAttribute("data-id");
    const productColor = e.currentTarget.closest(".cart__item").getAttribute("data-color");
    const cart = getPanier();
    const valeurActuel = parseInt(e.currentTarget.value);
    if(!isNaN(valeurActuel)) {
      
      cart.forEach((product) => {
        if ((product.id === productId) && (product.colors === productColor)) {
          product.quantity = valeurActuel;
          product.total = product.quantity * product.price;
        } else {
          console.log('ça ne marche pas mec !')
        }
      })
    }
    savePanier(cart);
    window.location.reload();
})
})

/**
 * Calcul du total des articles. 
 */
const additionPrix = () => {
  spanTotalPrice
  if (products.length > 0) {
  let totalPrice = 0;
 
  products.forEach(product => {
    totalPrice += (product.price * product.quantity);
  });

  spanTotalPrice.textContent = totalPrice + " €";
  }
}

additionPrix();

//Appel la fonction pour afficher las produits du panier au moment du chargement de la page
//window.addEventListener("load", afficherCanape);


/*Récupération du champ de saisie*/
    const baliseNom = document.getElementById("lastName");
    const balisePrenom = document.getElementById("firstName");
    const baliseAdresse = document.getElementById("address");
    const baliseVille = document.getElementById("city");
    const baliseMAil = document.getElementById("email");

    /**
     * Cette fonction permet de vérifier si l'adresse mail entré dans le formulaire est correcte.
     * Elle contient un RegExp afin de vérifier si les caractères respectent le format d'une adresse mail.
     * @param {string} mail - l'adresse mail du formulaire.
     * @returns {boolean}
     */
    function validerEmail(mail) {
      let emailRegEx = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
      if (emailRegEx.test(mail)) {
        return true
      }
      return false
    } 

    // function validerFormulaire(champ) {
    //   if (champ.value === "") {
    //     throw new Error(`Le champ est vide`)

    //   }
    // }
    function validerFormulaire(contact, productIds) {
      if (
        typeof contact.firstName !== 'string' ||
        typeof contact.lastName !== 'string' ||
        typeof contact.address !== 'string' ||
        typeof contact.city !== 'string' ||
        typeof contact.email !== 'string'
      ) {
        throw new Error('Les champs du formulaire ne sont pas valides');
      }
      //La methode Array.isArray permet de déterminer si la valeur transmise est un tableau
      if(!Array.isArray(productIds) || productIds.some(id => typeof id !== 'string')) {
        throw new Error('Le tableau des product-ID est invalide.');
      }
    }

const formCommande = document.querySelector("form");  
  formCommande.addEventListener("submit", async (event) => {
    
        event.preventDefault();
    try {  
          const contact = {
            firstName : balisePrenom.value,
            lastName : baliseNom.value,
            address : baliseAdresse.value,
            city : baliseVille.value,
            email : baliseMAil.value
          }

          //Vérification du format de l'adresse mail
          validerEmail(contact.email);

          //Parcours le tableau des produits afin d'en sortir uniquement l'Id.
          const products = getPanier();
          const productsIds = products.map(product => product.id); 
          const productsItems = products.map(product => product);

          //Validation des données avant l'envoi du formulaire
          validerFormulaire(contact, productsIds);

          
          const commande = {
            contact,
            products,
            id : productsIds, 
          };

         

          const reponse = await fetch(`https://kanap-back-drab.vercel.app/api/products/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({contact, products: productsIds}),

          });

          let result = await reponse.json();
         
  
          window.location.href = './confirmation.html?orderId=' + result.orderId + '&total=' + spanTotalPrice.textContent;
          // alert(result.message);
          
      } catch (error) {
        console.error("Une erreur est survenue : " + error.message)
      }
  })

  

  