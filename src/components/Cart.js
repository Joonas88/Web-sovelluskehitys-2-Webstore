import React, {useState, useEffect} from 'react';
import {getCartItems, removeFromCart} from '../store';

const Cart = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart'));
    //const cartItems = getCartItems();
    const [value, setValue] = useState();
    const [shippingOption, setShippingOption] = useState([]);

    const cartItemsCount = cartItems.length;
    const itemSubtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0);
    const subtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0) + Number(shippingOption);
    const salesTax = 0.14;
    const salesTaxApplied = subtotal * salesTax;
    const total = subtotal + salesTaxApplied;
    const selectedShippingOption = '';

    //Päivittää ostoskorin
    const refresh = ()=>{
        setValue({});
    }
    //Käsittelee postitusvaihtoehdon muutoksen
    const handleShippingSelect = (event) => {
        setShippingOption(event.target.value);
    }

    /*
    console.log("sessionStorage: ")
    console.log(JSON.parse(sessionStorage.getItem('cart')))
     */

    return(
        <div className="wrapper">
            <h1>Ostoskori</h1>
            <div className="flex-col">
                <ul className="cart-list">
                    {cartItems.map((cartItem, index) => (
                        <li key={index} className="cart-list__item">
                            <img src={`/assets/images/products/${cartItem.Image}`} alt="" className="thumbnail"/>
                            <div className="cart-list__item__details">
                                <p>{cartItem.Name}</p>
                                <p><em>{cartItem.Price} €</em></p>
                                <button className={'btn'} onClick={() => {removeFromCart(index); refresh();}}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="total-setion">
                    <ul className="total-section-list">
                        <li className="total-section__item">
                            <p className="total-section__item__label">{cartItemsCount} Item(s)</p>
                            <p>{itemSubtotal.toFixed(2)} €</p>
                        </li>
                        <li className="total-section__item">
                            <p className="total-section__item__label">Shipping</p>
                            <label>
                                <select onChange={handleShippingSelect}>
                                    <option disabled value="">Please select an option</option>
                                    <option value="20">One day</option>
                                    <option value="15">Two day</option>
                                    <option value="10">Three to five day</option>
                                    <option value="5">One week or more</option>
                                </select>
                            </label>
                        </li>
                        <li className="total-section__item">
                            <p className="total-section__item__label">Subtotal</p>
                            <p>{subtotal.toFixed(2)} €</p>
                        </li>
                        <li className="total-section__item">
                            <p className="total-section__item__label">
                                Tax ({(salesTax * 100).toFixed(2)}%)
                            </p>
                            <p>{salesTaxApplied.toFixed(2)} €</p>
                        </li>
                        <li className="total-section__item">
                            <p className="total-section__item__label">Total</p>
                            <p>{total.toFixed(2)} €</p>
                        </li>
                        <button className="total-section__checkout-button">Order</button>
                    </ul>
                </div>
            </div>
            </div>

    )
}

export default Cart
