import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {Link} from 'react-router-dom';

const FilterView = (props) => {
    
    console.log(props.match.params.id)
    const [products, setProducts] = useState([]);
    const selectedCategory = props.match.params.id;
    let url = '';
    if (selectedCategory === 'All') {
        url = 'http://localhost:8081/products';
    } else {
        url = `http://localhost:8081/components/${selectedCategory}`
    }

    useEffect( () => {
        axios.get(url).then(response => {
            console.log(response.data);
            setProducts(response.data);
        })

    }, [])

    return(
        <div>
            <h1>{props.match.params.id}</h1>
            <ul className="featured-items">
                {products.map(product => (
                    <li key={product.Product_id} className="featured-items-item">
                        <Link to={"/product/" + product.Product_id} >
                            <img className="product-image" src={`/assets/images/products/${product.Image}`} alt=""/>
                        </Link>
                        <div>
                            <Link to={"/product/" + product.Product_id} className="product-title">{product.Name}</Link>
                        </div>
                        <p><em>{product.Price} €</em></p>
                    </li>
                ))}
            </ul>
        </div>
        
    )
}

export default FilterView