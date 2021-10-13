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
import './App.css'
import {Container, Nav, Navbar} from "react-bootstrap";
import Slideshow from './components/Slideshow';
import './components/Components.css'

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

    const [showLogoutButton, setShowLogoutButton] = useState(true)
    const [showLogRegButton, setShowLogRegButton] = useState(false)


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
                if (response.status===200) {
                    const loginData={
                        username: userEmail,
                        password: userPw
                    }
                    axios
                        .post('http://localhost:8081/auth/login', loginData)
                        .then(response=>{
                            //console.log(response.data)
                            sessionStorage.setItem('token', JSON.stringify(response.data.token))
                            sessionStorage.setItem('user', JSON.stringify(response.data.user.Name))
                            sessionStorage.setItem('email', JSON.stringify(response.data.user.Email))
                            auth()
                            setShowLogRegButton(true)
                            setShowLogoutButton(false)
                        })
                } else {
                    alert("Registering failed!")
                }
            })

    }

    const handleLogin = (event) => {
        handleClose()
        event.preventDefault()
        const loginData={
            username: userEmail,
            password: userPw
        }
        //console.log(loginData)

        axios
            .post('http://localhost:8081/auth/login', loginData)
            .then(response=>{
                //console.log(response.data)
                sessionStorage.setItem('token', JSON.stringify(response.data.token))
                sessionStorage.setItem('user', JSON.stringify(response.data.user.Name))
                sessionStorage.setItem('email', JSON.stringify(response.data.user.Email))
                auth()
                setShowLogRegButton(true)
                setShowLogoutButton(false)
            })
    }

    const auth = () => {
        const token = JSON.parse(sessionStorage.getItem('token'))
        //console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                //console.log(response.data)
                if(response.data==="Error"){
                    setShowLogged('')
                } else {
                    setShowLogged(response.data)
                }
            })
    }

    const logout = () => {
        axios.get('http://localhost:8081/auth/logout').then(response=>{
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('email');
            console.log(response)
            auth()
            setShowLogRegButton(false)
            setShowLogoutButton(true)
        })
    }


    return (
        <div className="App">
            <div id="logo">
                <p className="glitch"><span aria-hidden="true">WEBSTORE</span>WEBSTORE<span
                    aria-hidden="true">WEBSTORE</span></p>
            </div>
            <Router>
                <Navbar bg="dark" variant="dark" sticky="top">
                    <Container>
                        <Navbar.Brand href="/">WEBSTORE</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/category/All" >All</Nav.Link>
                            <Nav.Link href="/category/GPU" >GPU</Nav.Link>
                            <Nav.Link href="/category/CPU" >CPU</Nav.Link>
                            <Nav.Link href="/category/RAM" >RAM</Nav.Link>
                            <Nav.Link href="/category/Motherboards" >Motherboards</Nav.Link>
                            <Nav.Link href="/category/Other" >Other</Nav.Link>
                            <Nav.Link href="/cart" >Cart</Nav.Link>
                            <Navbar.Text > {JSON.parse(sessionStorage.getItem('cart')).length} </Navbar.Text>
                        </Nav>
                        <Nav>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="signed_user">
                                <Navbar.Text  hidden={showLogoutButton} >
                                    Signed in as: {showLogged+"  "}
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Nav>
                        <Nav>
                            <Button className="navbuttons1" style={navBarStyle} variant="secondary" hidden={showLogRegButton} onClick={handleShow}>Login</Button>
                            <Button className="navbuttons1" style={navBarStyle} variant="secondary" hidden={showLogRegButton} onClick={handleShowRegister}>Register</Button>
                            <Button className="navbuttons1" style={navBarStyle} variant="secondary" hidden={showLogoutButton} onClick={logout}>Logout</Button>
                        </Nav>
                    </Container>
                </Navbar>
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

                    </Route>
                    <Route path="/category/:id" component={(props) => <FilterView {...props} key={window.location.pathname}/>}/>

                    <Route path="/" component={Home}>
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

function refreshPage() {
    window.location.reload(false)
}

export default App;
export {refreshPage}
