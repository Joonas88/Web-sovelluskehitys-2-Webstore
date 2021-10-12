import axios from 'axios';

const cartItems = [];
const subtotal = 0;

function addToCart(props) {
    const id = props;
    axios.get(`http://localhost:8081/products/${id}`).then(response => {
        //console.log(response.data);
        const item = response.data[0];
        if(item.Stock > 0) {
            cartItems.push(item);
            sessionStorage.setItem('cart', JSON.stringify(cartItems))
        } else {
            alert("Cant add to cart! Out of stock!")
        }
    })
}
function getCartItems() {
    return cartItems;
}

function removeFromCart(id) {
    cartItems.splice(id, 1)
    sessionStorage.setItem('cart', JSON.stringify(cartItems))
}



export {addToCart, getCartItems, removeFromCart};
