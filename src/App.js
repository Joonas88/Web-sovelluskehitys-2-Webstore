import React, {Fragment, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import FilterView from './components/FilterView';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Product from './components/Product';

//TODO: category vaihtaa parametriksi filterin mukaan

function App() {
    const navBarStyle = {
        margin: 2
    };
    const [show, setShow] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [userName, setUserName]  = useState();
    const [userEmail, setUserEmail] = useState();
    const [userPw, setUserPw] = useState();

    const [showLogged, setShowLogged] = useState()

    const handleClose = () => {
        setShow(false);
        setShowRegister(false)
    }
    const handleShow = () => setShow(true);
    const handleShowRegister = () => setShowRegister(true);

    const handleUserName = (event) => {
        setUserName(event.target.value)
    }

    const handleUserEmail = (event) => {
        setUserEmail(event.target.value)
    }
    const handleUserPw = (event) => {
        setUserPw(event.target.value)
    }

    const handleRegister = (event) => {
        handleClose()
        event.preventDefault()
        const registerData = {
            username: userName,
            email: userEmail,
            password: userPw
        }
        console.log(registerData)

        axios
            .post('http://localhost:8081/auth/register', registerData)
            .then(response=>{
                console.log(response)
                //TODO Kaikki mitä rekiströitymisdatalla tehdään, mm suoraan sisäänkirjaus?
            })

    }

    const handleLogin = (event) => {
        handleClose()
        event.preventDefault()
        const loginData={
            username: userEmail,
            password: userPw
        }
        console.log(loginData)

        axios
            .post('http://localhost:8081/auth/login', loginData)
            .then(response=>{
                //console.log(response.data)
                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('user', JSON.stringify(response.data.user.Name))
                //TODO Kaikki mitä kirjautumisdatalla , mm tokenin tallettaminen ja kirjautumisen tallentaminen tokenin avulla
                //manageShowLoggedUser()
                auth()
            })
    }

    const auth = () => {
        const token = JSON.parse(localStorage.getItem('token'))
        console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                console.log(response.data)
                if(response.data==="Error"){
                    //Todo Modal tai vastavaa esiin, että tarvitsee kirjautua uudelleen sisälle
                    setShowLogged('')
                } else {
                    setShowLogged(response.data)
                }

            })
    }

    //TODO Tarkastele tarivtseeko muuta tehdä logoutin eteen
    const logout = () => {
        axios.get('http://localhost:8081/auth/logout').then(response=>{
            localStorage.clear();
            console.log(response)
        })
    }

    //TODO käytetään joko tätä asettamaan kirjautunut käyttäjä tai sitten suoraan tuota auth() funktiota
    const manageShowLoggedUser = () =>{

        setShowLogged(localStorage.getItem('user'))

    }

    return (
        <div className="App">
        <h1>Webstore</h1>
            <h2>{showLogged}</h2>
            <Router>
                <div>
                    <Link style={navBarStyle} to="/">Home</Link>
                    <Link style={navBarStyle} to="/category/All">All</Link>
                    <Link style={navBarStyle} to="/category/GPU">GPU</Link>
                    <Link style={navBarStyle} to="/category/CPU">CPU</Link>
                    <Link style={navBarStyle} to="/category/RAM">RAM</Link>
                    <Link style={navBarStyle} to="/category/Motherboards">Motherboards</Link>
                    <Link style={navBarStyle} to="/category/Other">Other</Link>
                    <Link style={navBarStyle} to="/cart">Cart</Link>
                    <Button style={navBarStyle} variant="primary" onClick={handleShow}>Login</Button>
                    <Button style={navBarStyle} variant="primary" onClick={handleShowRegister}>Register</Button>
                    <Button style={navBarStyle} variant="primary" onClick={auth}>Auth</Button>
                    <Button style={navBarStyle} variant="primary" onClick={logout}>Logout</Button>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required  onChange={handleUserEmail}/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required onChange={handleUserPw}/>
                            </Form.Group>
                            <Button variant="primary" type="submit">Login</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showRegister} onHide={handleClose}>
                    <Modal.Header>
                        Register
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleRegister}>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" required onChange={handleUserName}/>
                                <Form.Text className="text-muted">Please select a pleasing username</Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required onChange={handleUserEmail}/>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required onChange={handleUserPw}/>
                            </Form.Group>
                            <Button variant="primary" type="submit">Register</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Switch>
                    <Route path ="/product/:id" component={Product}>

                    </Route>
                    <Route path="/cart" component={Cart}>
                        <Cart />
                    </Route>
                    <Route path="/category/:id" component={FilterView}>
                        <FilterView />
                    </Route>
                    <Route path="/" component={Home}>
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
export default App;
