import React, {useState, useEffect} from 'react';
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
import './components/Components.css'

function App() {

    /**
     * Ajaa sisällä olevat funktiot, kun sivu avataan.
     */
    useEffect(()=>{
        auth()
        handleCartCount()
    })

    /**
     * Määritellään napeille margin
     * @type {{margin: number}}
     */
    const navBarStyle = {
        margin: 2
    };

    /**
     * Reactin usetate muuttujia ja alkuarvoja
     * Näillä mm. käsitellään kirjautumis yms modaleita sekä tekstein ja nappien näkyvyyttä
     */
    const [show, setShow] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [userName, setUserName]  = useState();
    const [userEmail, setUserEmail] = useState();
    const [userPw, setUserPw] = useState();
    const [showLogged, setShowLogged] = useState()
    const [showLogoutButton, setShowLogoutButton] = useState(true)
    const [showLogRegButton, setShowLogRegButton] = useState(false)
    const [showLoggedName, setShowLoggedName] = useState(true)
    const [cartCount, setCartCount] = useState()
    const [validateLogin, setValidateLogin] = useState()
    const [validateRegister, setValidateRegister] = useState()

    /**
     * Alla olevilla metodeilla käsitellään erinäisten state-muuttujien arvon vaihdoksia
     */
    const handleCartCount = () => {
        setCartCount(JSON.parse(sessionStorage.getItem('cart')).length)
    }

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

    /**
     * Metodi hoitaa rekisteröintikutsun lähettämisen serverille
     * Kerää kaiken olellisen datan state-muuttujista yhden muuttujan alle
     * Kirjaa käyttäjän sisälle, jos rekisteröinti onnistuu
     * @param event toimii suorana hakijana mahdollisetsi Bootsrtapin JXS
     */
    const handleRegister = (event) => {
        const form = event.currentTarget
        event.preventDefault()
        if (form.checkValidity()===false) {
            event.stopPropagation()
        } else {
            const registerData = {
                username: userName,
                email: userEmail,
                password: userPw
            }

            axios
                .post('http://localhost:8081/auth/register', registerData)
                .then(response=>{
                    if (response.status===200) {
                        const loginData={
                            username: userEmail,
                            password: userPw
                        }
                        axios
                            .post('http://localhost:8081/auth/login', loginData)
                            .then(response=>{
                                localStorage.setItem('token', JSON.stringify(response.data.token))
                                localStorage.setItem('user', JSON.stringify(response.data.user.Name))
                                localStorage.setItem('email', JSON.stringify(response.data.user.Email))
                                auth()
                                setShowLogRegButton(true)
                                setShowLogoutButton(false)
                            })
                    } else {
                        alert("Registering failed!")
                    }
                })
            handleClose()
        }
        setValidateRegister(true)
    }

    /**
     * Metodilla kirjaudutaan sisälle
     * Palautuksena tulee token, käyttäjätunnus ja email
     * @param event
     */
    const handleLogin = (event) => {
        const form = event.currentTarget
        event.preventDefault()
        if (form.checkValidity()===false) {
            event.stopPropagation()
        } else {

            const loginData={
                username: userEmail,
                password: userPw
            }

            axios
                .post('http://localhost:8081/auth/login', loginData)
                .then(response=>{
                    //console.log(response.data)
                    localStorage.setItem('token', JSON.stringify(response.data.token))
                    localStorage.setItem('user', JSON.stringify(response.data.user.Name))
                    localStorage.setItem('email', JSON.stringify(response.data.user.Email))
                    auth()
                    setShowLogRegButton(true)
                    setShowLogoutButton(false)
                })
            handleClose()
        }
        setValidateLogin(true)

    }

    /**
     * Metodilla autentikoidaan tokenin voimassaolo
     * Jos token on voimassa, näytetään käyttäjä kirjautuneena
     */
    const auth = () => {
        const token = JSON.parse(localStorage.getItem('token'))
        //console.log(token)
        axios.get('http://localhost:8081/auth/auth', {headers: {Authorization:'Bearer: '+token}})
            .then(response => {
                if(response.data==="Error"){
                    setShowLogged('')
                    setShowLoggedName(true)
                    setShowLogRegButton(false)
                    setShowLogoutButton(true)
                } else {
                    setShowLogRegButton(true)
                    setShowLogoutButton(false)
                    setShowLogged(response.data)
                    setShowLoggedName(false)
                }
            })
    }

    /**
     * Metodilla tyhjennetään kaikki kirjautumistiedot ja ajetaan vielä auth(), jolla varmistetaan tokenin poistuneen
     */
    const logout = () => {
        axios.get('http://localhost:8081/auth/logout').then(response=>{
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('email');
            auth()
            setShowLogRegButton(false)
            setShowLogoutButton(true)
            setShowLoggedName(true)
        })
    }

    /**
     * App.js näkymän palautus
     * Palautus on toteutettu käyttäen pääasiassa React Bootsrappia ja sen kautta on myös ulkoasu pitkälti
     * Modaleilla hoidetaan kirjautuminen ja rekisteröinti.
     * Modalit näkyvät useState toiminnolla tarpeen mukaan
     */
    return (
        <div className="App">
            <div id="logo">
                <p className="glitch"><span aria-hidden="true">WEBSTORE</span>WEBSTORE<span
                    aria-hidden="true">WEBSTORE</span></p>
            </div>
            <Router>
                <Navbar bg="dark" variant="dark" sticky="top">
                    <Container>
                        <Navbar.Brand onSelect={auth} as={Link} to="/">WEBSTORE</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link onSelect={auth} as={Link} to="/">Home</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/All" >All</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/GPU" >GPU</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/CPU" >CPU</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/RAM" >RAM</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/Motherboards" >Motherboards</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/category/Other" >Other</Nav.Link>
                            <Nav.Link onSelect={auth} as={Link} to="/cart" >Cart</Nav.Link>
                            <Navbar.Text > {cartCount} </Navbar.Text>
                        </Nav>
                        <Nav>
                            <Navbar.Toggle />
                            <Navbar.Collapse className="signed_user">
                                <Navbar.Text  hidden={showLoggedName} >
                                    Signed in as: {showLogged}
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
                        <Form noValidate validated={validateLogin} onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required onChange={handleUserEmail}/>
                                <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required onChange={handleUserPw}/>
                                <Form.Control.Feedback type="invalid">Please enter a password containing one upper case letter and at least 8 characters</Form.Control.Feedback>
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
                        <Form noValidate validated={validateRegister}  onSubmit={handleRegister}>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" required onChange={handleUserName}/>
                                <Form.Control.Feedback type="invalid">Username can't be that</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid">I LOVE THAT!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" required onChange={handleUserEmail}/>
                                <Form.Control.Feedback type="invalid">Please enter a valid email</Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" required onChange={handleUserPw}/>
                                <Form.Control.Feedback type="invalid">Please enter a password containing one upper case letter and at least 8 characters</Form.Control.Feedback>
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

/**
 * App.js näkymän päivitys funktio
 */
function refreshPage() {
    window.location.reload(false)
}

/**
 * Luokasta ulospäin näkyvät metodit
 */
export default App;
export {refreshPage}
