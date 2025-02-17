const url = new URL(window.location.href); //recupere l'url actuelle
const params = new URLSearchParams(url.search); //recupere les parametres de l'url
const orderId = params.get("orderId"); //recupere l'orderID dans les parametres de l'url
const totalPrice = params.get("totalPrice"); //recupere le totalPrice dans les parametres de l'url

const spanOrderIdDomELem = document.getElementById('orderId'); //pointe le span orderId dans le DOM
spanOrderIdDomELem.innerHTML = orderId; //insere l'orderId dans le span orderId