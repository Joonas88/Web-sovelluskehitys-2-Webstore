import React, {useState, useEffect} from 'react';
import {removeFromCart} from '../store';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";

const Cart = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart'));
    const [value, setValue] = useState();
    const [shippingOption, setShippingOption] = useState([20]);

    const cartItemsCount = cartItems.length;
    const itemSubtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0);
    const subtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0) + Number(shippingOption);
    const salesTax = 0.14;
    const salesTaxApplied = subtotal * salesTax;
    const total = subtotal + salesTaxApplied;
    const selectedShippingOption = '';

    const [showError, setShowError] = useState(false)
    const [showContact, setShowContact] = useState(false)

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

    const auth = () => {
        const token = JSON.parse(localStorage.getItem('token'))
        console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                console.log(response.data)
                if(response.data==="Error"){
                    setShowError(true)
                } else {
                    setShowContact(true)
                }

            })
    }

    const handleClose = () => {
        setShowError(false)
        setShowContact(false)
    }

    const sendOrder = () => {
        //TODO tietokantaan tilauksen tekeminen
    }

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
                                    <option selected={true} disabled="disabled" value="">Please select an option</option>
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
                        <button className="total-section__checkout-button" onClick={auth}>Order</button>
                    </ul>
                </div>
            </div>
            <Modal show={showError} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Not logged in!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please login to proceed with the order</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showContact}
                   onHide={handleClose}
                   backdrop="static"
                   keyboard={false}>
                <Modal.Header>Please fill in your order information</Modal.Header>
                <Modal.Body>
                    <ul className="total-section-list">
                        <li className="total-section__item">
                            <p className="total-section__item__label">{cartItemsCount} Item(s)</p>
                            <p>{itemSubtotal.toFixed(2)} €</p>
                        </li>
                        <li className="total-section__item">
                            <p className="total-section__item__label">Shipping</p>
                            <p>{shippingOption} €</p>

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
                    </ul>
                    <Form onSubmit={sendOrder}>
                        <Form.Group>
                            <Form.Label>Recipients name</Form.Label>
                            <Form.Control required="yes" type="text"/>
                        </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control required="yes" type="text"/>
                            </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Zip</Form.Label>
                                <Form.Control required="yes" type="number"/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>City</Form.Label>
                                <Form.Control required="yes" type="text"/>
                            </Form.Group>
                        </Row>
                        <Form.Group>
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control required="yes" type="number"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control required="yes" type="Email"/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check required="yes" type="checkbox" label="I understand the terms of delivery and sevice" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Place order
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
            </div>

    )
}

export default Cart
