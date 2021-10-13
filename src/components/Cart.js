import React, {useState, useEffect} from 'react';
import {removeFromCart} from '../store';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import {checkNode} from "@testing-library/jest-dom/dist/utils";
import {refreshPage} from "../App";

const Cart = () => {
    let cartItems = JSON.parse(sessionStorage.getItem('cart'));
    const [value, setValue] = useState();
    const [shippingOption, setShippingOption] = useState([]);

    const cartItemsCount = cartItems.length;
    const itemSubtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0);
    const subtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0) + Number(shippingOption);
    const salesTax = 0.14;
    const salesTaxApplied = subtotal * salesTax;
    const total = subtotal + salesTaxApplied;
    const selectedShippingOption = '';

    const [showError, setShowError] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const [orderName, setOrderName] = useState()
    const [orderAddress, setOrderAddress] = useState()
    const [orderZip, setOrderZip] = useState()
    const [orderCity, setOrderCity] = useState()
    const [orderPhone, setOrderPhone] = useState()
    const [orderEmail, setOrderEmail] = useState()

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
        const token = JSON.parse(sessionStorage.getItem('token'))
        //console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                //console.log(response.data)
                if(response.data==="Error"){
                    setShowError(true)
                    //refreshPage()
                } else {
                    setShowContact(true)
                }

            })
    }

    const handleRefresh = () => {
        setShowError(false)
        refreshPage()
    }

    const handleClose = () => {
        setShowContact(false)
    }

    const handleOrderName = (event) => {
        setOrderName(event.target.value)
    }

    const handleOrderAddress = (event) => {
        setOrderAddress(event.target.value)
    }

    const handleOrderZip = (event) => {
        setOrderZip(event.target.value)
    }

    const handleOrderCity = (event) => {
        setOrderCity(event.target.value)
    }

    const handleOrderPhone = (event) => {
        setOrderPhone(event.target.value)
    }

    const handleOrderEmail = (event) => {
        setOrderEmail(event.target.value)
    }

    const sendOrder = (event) => {
        event.preventDefault()
        //TODO tietokantaan tilauksen tekeminen

        let orders = []
        for (let i=0; i<cartItems.length; i++){
            console.log(cartItems[i].Product_id)
            orders.push(cartItems[i].Name)
        }

        console.log(orders)
        console.log(JSON.stringify(orders))
       const order = {
           name: orderName,
           address: orderAddress,
           zip: orderZip,
           city: orderCity,
           phone: orderPhone,
           price: total,
           email: orderEmail,
           order: JSON.stringify(orders)
        }
        console.log(order)

        axios.post('http://localhost:8081/order/submit', order)
            .then(response =>{
                console.log(response.status===400)
                if(response.status!==400){
                    setShowContact(false)
                    alert("Order placed succesfully!")
                    cartItems=[]
                    sessionStorage.setItem('cart', JSON.stringify(cartItems));
                    refresh()
                } else {
                    alert("Somethin went wrong!")
                }
            })



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
            <Modal show={showError} onHide={handleRefresh}>
                <Modal.Header>
                    <Modal.Title>Not logged in!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please login to proceed with the order</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRefresh}>
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
                            <Form.Control required="yes" type="text" onChange={handleOrderName}/>
                        </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control required="yes" type="text" onChange={handleOrderAddress}/>
                            </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Zip</Form.Label>
                                <Form.Control required="yes" type="number" onChange={handleOrderZip}/>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>City</Form.Label>
                                <Form.Control required="yes" type="text" onChange={handleOrderCity}/>
                            </Form.Group>
                        </Row>
                        <Form.Group>
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control required="yes" type="number" onChange={handleOrderPhone}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control required="yes" type="Email" onChange={handleOrderEmail}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Check required="yes" type="checkbox" label="I understand the terms of delivery and sevice" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Place order
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>

    )
}

export default Cart
