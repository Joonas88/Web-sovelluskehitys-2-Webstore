import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {addToCart} from '../store'
import Button from "react-bootstrap/Button";
import Slideshow from './Slideshow';

const Product = (props) => {

    const [products, setProducts] = useState([]);
    
    /**
     * Hakee tietokannasta tuotesivulle tuotteen id:n perusteella
     */
    useEffect( () => {
        axios.get(`http://localhost:8081/products/${props.match.params.id}`).then(response => {
            console.log(response.data);
            setProducts(response.data);
        })
    }, [])

    /**
     * käsittelee ostoskoriin lisäämisen tuotteen id:llä
     * @param event
     * @param props.match.params.id tuotteen id osoittesta
     */
    const handleAddToCart = (event) => {
        addToCart(props.match.params.id);
    }

    /**
     * Listaa tuotteen tiedot tuotesivulle
     */
    return(
        <div className="wrapper">
            <h1 className="otsikko">Product info</h1>
            <ul className="list">
                {products.map(product => (
                    <li key={product.Product_id} className="featured-items-item">
                        <div>
                            <img className="product-image" src={`/assets/images/products/${product.Image}`} alt=""/>
                        </div>
                        <div>
                            <h4 className="product-title">{product.Name}</h4>
                            <p className="price"><em>{product.Price} €</em></p>
                            <Button onClick={handleAddToCart}>AddToCart</Button>
                            <p className="price"><em>{product.Stock} left in stock.</em></p>
                        </div>
                        <div className="details">
                            <h4>Details</h4>
                            <ul className="list">
                                <li>Frequency: {product.Frequency}</li>
                                <li>Memory: {product.Memory}</li>
                                <li>Cores: {product.Cores}</li>
                                <li>Socket: {product.Socket}</li>
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Product
