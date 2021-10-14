import React, {useState} from 'react';
import {removeFromCart} from '../store';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {Col, Container, Row} from "react-bootstrap";
import {refreshPage} from "../App";
import Slideshow from './Slideshow';

const Cart = () => {
    let cartItems = JSON.parse(sessionStorage.getItem('cart'));
    const [value, setValue] = useState();
    const [shippingOption, setShippingOption] = useState([20]);

    /**
     * Ostoskorin hintatiedot yms.
     */
    const cartItemsCount = cartItems.length;
    const itemSubtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0);
    const subtotal = cartItems.reduce((itemSubtotal, item) => itemSubtotal = itemSubtotal + item.Price, 0) + Number(shippingOption);
    const salesTax = 0.14;
    const salesTaxApplied = subtotal * salesTax;
    const total = subtotal + salesTaxApplied;

    /**
     * Tilauslomakkeen tietojen käsittely
     */
    const [showError, setShowError] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [orderName, setOrderName] = useState();
    const [orderAddress, setOrderAddress] = useState();
    const [orderZip, setOrderZip] = useState();
    const [orderCity, setOrderCity] = useState();
    const [orderPhone, setOrderPhone] = useState();
    const [orderEmail, setOrderEmail] = useState();
    const [validateCart, setValidateCart] = useState();

    /**
     * Päivittää ostoskorin
     */
    const refresh = ()=>{
        setValue({});
    }

    /**
     * Käsittelee postitusvaihtoehdon muutoksen
     */
    const handleShippingSelect = (event) => {
        setShippingOption(event.target.value);
    }

    /**
     * Tarkistaa onko käyttäjä kirjautunut / onko token voimassa tilausta tehdessä
     */
    const auth = () => {
        const token = JSON.parse(localStorage.getItem('token'))
        //console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                //console.log(response.data)
                if(response.data==="Error"){
                    setShowError(true)
                } else {
                    setShowContact(true)
                }
            })
    }

    /**
     * Päivittää sivun
     */
    const handleRefresh = () => {
        setShowError(false)
        refreshPage()
    }

    /**
     * Sulkee tilaus modalin
     */
    const handleClose = () => {
        setShowContact(false)
    }

    /**
     * Handlet päivittävät muuttujat tilaus tietoja syöttäessä
     * @param event
     */
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

    /**
     * Tilauksen tallentaminen tietokantaan syötetyillä tiedoilla ja ostoskorin tuotteilla
     * @param event
     */
    const sendOrder = (event) => {

        const form = event.currentTarget
        event.preventDefault()
        if(form.checkValidity()===false) {
            event.stopPropagation()
        } else {
            let orders = []
            for (let i=0; i<cartItems.length; i++){
                orders.push(cartItems[i].Product_id)
            }
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
                        console.log(cartItems.length)
                        sessionStorage.setItem('cart', JSON.stringify(cartItems));
                        refresh()
                    } else {
                        alert("Somethin went wrong!")
                    }
                })
        }
        setValidateCart(true)
    }
    /**
     * Ostoskori näkymä:
     * ostoskorin sisältö, hinta ja toimitustiedot sekä tilaus modali
     */
    return(
        <div className="wrapper">
            <div>
                <Slideshow component={Slideshow}/>
            </div>
            <h1 className="otsikko">Cart</h1>
            <div className="flex-col">
                <Container className="cart-list">
                    <Row>
                        {cartItems.map((cartItem, index)=>(
                            <Col className="cart-list__item" xs="4">
                                <img src={`/assets/images/products/${cartItem.Image}`} alt="" className="thumbnail"/>
                                <div className="cart-list__item__details">
                                    <p>{cartItem.Name}</p>
                                    <p><em>{cartItem.Price} €</em></p>
                                    <Button className={'btn'} onClick={() => {removeFromCart(index); refresh();}}>Remove</Button>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <div className="total-section">
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
                                    <option value="20">One day 20€</option>
                                    <option value="15">Two day 15€</option>
                                    <option value="10">Three to five day 10€</option>
                                    <option value="5">One week or more 5€</option>
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
                        <Button disabled={cartItems.length===0} className="total-section__checkout-button" onClick={auth}>Order</Button>
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
                    <Form noValidate validated={validateCart} onSubmit={sendOrder}>
                        <Form.Group>
                            <Form.Label>Recipients name</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                onChange={handleOrderName}
                            />
                        </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    onChange={handleOrderAddress}
                                />
                            </Form.Group>
                        <Row>
                            <Form.Group as={Col}>
                                <Form.Label>Zip</Form.Label>
                                <Form.Control
                                    required
                                    type="number"
                                    onChange={handleOrderZip}
                                />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    onChange={handleOrderCity}
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group>
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                onChange={handleOrderPhone}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                required
                                type="Email"
                                onChange={handleOrderEmail}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check required type="checkbox" label="I understand the terms of delivery and sevice" />
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
