/**
 * Cette fonction asynchrone permet de récupérer les canapé depuis l'API dans un premier temps
 * Puis les transorme en json
 * @url requete l'API
 * @reponse récupere les données renvoyées
 * @returns renvoie les produits obtenu depuis l"API
 * @catch permet d'afficher un message d'erreur si un problème est rencontrer lors de la récupération
 */

const getProducts = async () => {
    try {
        const url = await fetch("http://localhost:3000/api/products");
        const reponse = await url.json();
        return reponse;
    } catch (erreur) {
        console.error("Une erreur s'est produite lors de la récupération : ", erreur);
        throw erreur;
    }

}

/**
 * Cette fonction asynchrone permet d'afficher les élément de l'API sur la page web
 * On pointe le DOM au bonne endroit grace à l'Id
 * Puis on utilise une boucle pour que chque produit soit intégré dans la page à l'aide de innerHTML 
 */
const showProducts = async () => {
    try {
        const products = await getProducts(); //Attend la récupération des produits*
        // Création du lien avec le DOM
        const sectionItem = document.getElementById("items")
        for (let i = 0; i < products.length; i++) {
            sectionItem.innerHTML += `<a href="./product.html?id=${products[i]._id}">
            <article>
              <img src="${products[i].imageUrl}" alt="${products[i].altTtxt}">
              <h3 class="productName">${products[i].name}</h3>
              <p class="productDescription">${products[i].description}</p>
            </article>
          </a>`
            
           }
    } catch (erreur) {
        console.error("Une erreur s'est produite lors de l'introduction : ", erreur);
        throw erreur;

    }
   
}

console.log(showProducts())

