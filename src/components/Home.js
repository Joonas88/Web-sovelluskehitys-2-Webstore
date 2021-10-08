import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {Link} from 'react-router-dom';
import Product from './Product';

const Home = (props) => {
    const [products, setProducts] = useState([]);

    useEffect( () => {
        axios.get('http://localhost:8081/products').then(response => {
            console.log(response.data);
            setProducts(response.data);
        })

    }, [])

    return(
        
        <div>
            <h1>Featured Items</h1>
            <ul className="featured-items">
                {products.filter(product => product.Featured === 1).map(filteredProduct => (
                    <li key={filteredProduct.Product_id} className="featured-items-item">
                        <Link to={"/product/" + filteredProduct.Product_id} >
                            <img className="product-image" src={`assets/images/products/${filteredProduct.Image}`} alt=""/>
                        </Link>
                        <div>
                            <Link to={"/product/" + filteredProduct.Product_id} className="product-title">{filteredProduct.Name}</Link>
                        </div>
                        <p><em>{filteredProduct.Price} €</em></p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home