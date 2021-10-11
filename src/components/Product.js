import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {addToCart} from '../store'

const Product = (props) => {
    //console.log(props.match.params.id)
    const [products, setProducts] = useState([]);

    useEffect( () => {
        axios.get(`http://localhost:8081/products/${props.match.params.id}`).then(response => {
            console.log(response.data);
            setProducts(response.data);
        })
    }, [])

    const handleAddToCart = (event) => {
        addToCart(props.match.params.id);
    }

    return(
        <div>
            <h1>Product info</h1>
            <ul className="featured-items">
                {products.map(product => (
                    <li key={product.Product_id} className="featured-items-item">
                        <div>
                            <img className="product-image" src={`/assets/images/products/${product.Image}`} alt=""/>
                        </div>
                        <h4>{product.Name}</h4>
                        <p><em>{product.Price} €</em></p>
                        <button onClick={handleAddToCart}>AddToCart</button>
                        <p><em>{product.Stock} left in stock.</em></p>
                        <h4>Details</h4>
                        <ul className="list">
                            <li>Frequency: {product.Frequency}</li>
                            <li>Memory: {product.Memory}</li>
                            <li>Cores: {product.Cores}</li>
                            <li>Socket: {product.Socket}</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Product