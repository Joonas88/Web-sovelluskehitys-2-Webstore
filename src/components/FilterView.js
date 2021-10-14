import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Components.css';
import {Link} from 'react-router-dom';
import {Button, Nav} from "react-bootstrap";
import {addToCart} from "../store";
import Slideshow from './Slideshow';
import 'react-slideshow-image/dist/styles.css';

const FilterView = (props) => {

    //console.log(props.match.params.id)
    const [products, setProducts] = useState([]);

    /**
     * Tarkistaa url-osoiteesta mikä on valittu kategoria ja sen perusteella luo url osoitteen tietokanta kyselyä varten
     */
    const selectedCategory = props.match.params.id;
    let url = '';
    if (selectedCategory === 'All') {
        url = 'http://localhost:8081/products';
    } else {
        url = `http://localhost:8081/components/${selectedCategory}`
    }

    /**
     * Hakee tietokannasta edellä asetetulla url- osoittella kategorian perusteella tietokannasta tuotteet
     */
    useEffect( () => {
        axios.get(url).then(response => {
            console.log(response.data);
            setProducts(response.data);
        })
    }, [])

    /**
     * Listaa valitun kategorian mukaisesti tietokannasta haetut tuotteet kategoria/Filterview näkymiin yms. käyttöliitymän asiat
     */
    return(
        <div className="wrapper">
            <h1 className="otsikko">{props.match.params.id}</h1>
            <ul className="featured-items">
                {products.map(product => (
                    <li key={product.Product_id} className="featured-items-item">
                        <Link to={"/product/" + product.Product_id} >
                            <img className="product-image" src={`/assets/images/products/${product.Image}`} alt=""/>
                        </Link>
                        <div>
                            <Nav.Item variant="dark">
                                <Nav.Link href={"/product/" + product.Product_id} className="product-title">{product.Name}</Nav.Link>
                            </Nav.Item>
                        </div>
                        <p className="price"><em>{product.Price} €</em></p>
                        <Button onClick={() => {addToCart(product.Product_id);}}>Add to Cart</Button>
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default FilterView
