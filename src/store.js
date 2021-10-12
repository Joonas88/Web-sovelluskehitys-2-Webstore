import axios from 'axios';

let cartItems = [];
const subtotal = 0;

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
//Ei tarvetta?
function getCartItems() {
    return cartItems;
}

function removeFromCart(id) {
    const temp = JSON.parse(sessionStorage.getItem('cart'));
    temp.splice(id, 1);
    sessionStorage.setItem('cart', JSON.stringify(temp));
    cartItems = JSON.parse(sessionStorage.getItem('cart'));
}



export {addToCart, getCartItems, removeFromCart};