import axios from 'axios';

let cartItems = [];

/**
 * Tarkistaa sivun käynnistyessä onko sessionStoragessa ostoskoria olemassa, jos ei ole niin luo tyhjän korin
 */
if(sessionStorage.getItem('cart') === null) {
    sessionStorage.setItem('cart', JSON.stringify(cartItems));
}

/**
 * Lisää valitun tuotteen ostoskoriin tuote id:llä
 * @param props
 */
function addToCart(props) {
    const id = props;
    axios.get(`http://localhost:8081/products/${id}`).then(response => {
        //console.log(response.data);
        const item = response.data[0];
        if(item.Stock > 0) {
            const temp = JSON.parse(sessionStorage.getItem('cart'));
            temp.push(item);
            sessionStorage.setItem('cart', JSON.stringify(temp));
            cartItems = JSON.parse(sessionStorage.getItem('cart'));
        } else {
            alert("Cant add to cart! Out of stock!");
        }
    })
}

/**
 * Poistaa ostoskorista poistettavan tuotteen id:llä
 * @param id
 */
function removeFromCart(id) {
    const temp = JSON.parse(sessionStorage.getItem('cart'));
    temp.splice(id, 1);
    sessionStorage.setItem('cart', JSON.stringify(temp));
    cartItems = JSON.parse(sessionStorage.getItem('cart'));
}

export {addToCart, removeFromCart};
