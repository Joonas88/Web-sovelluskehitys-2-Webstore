import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {Link} from 'react-router-dom';
import Product from './Product';
import {addToCart} from "../store";
import {Button, Nav} from "react-bootstrap";
import Slideshow from './Slideshow';

const Home = (props) => {
    const [products, setProducts] = useState([]);

    useEffect( () => {
        axios.get('http://localhost:8081/products').then(response => {
            console.log(response.data);
            setProducts(response.data);
        })

    }, [])

    return(

        <div className="wrapper">
            <div>
                <Slideshow component={Slideshow}/>
            </div>
            <h1 className="otsikko">Featured Items</h1>
            <ul className="featured-items">
                {products.filter(product => product.Featured === 1).map(filteredProduct => (
                    <li key={filteredProduct.Product_id} className="featured-items-item">
                        <Link to={"/product/" + filteredProduct.Product_id} >
                            <img className="product-image" src={`assets/images/products/${filteredProduct.Image}`} alt=""/>
                        </Link>
                        <div>
                            <Nav.Item variant="dark">
                                <Nav.Link href={"/product/" + filteredProduct.Product_id} className="product-title">{filteredProduct.Name}</Nav.Link>
                            </Nav.Item>
                        </div>
                        <p className="price"><em>{filteredProduct.Price} €</em></p>
                        <Button onClick={() => {addToCart(filteredProduct.Product_id);}}>Add to Cart</Button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home
