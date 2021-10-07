import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Cart from './components/Cart';
import FilterView from './components/FilterView';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

//TODO: category vaihtaa parametriksi filterin mukaan

function App() {
    const navBarStyle = {
        margin: 2
    };
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="App">
        <h1>Webstore</h1>
            <Router>
                <div>
                    <Link style={navBarStyle} to="/">Home</Link>
                    <Link style={navBarStyle} to="/category">All</Link>
                    <Link style={navBarStyle} to="/category">GPU</Link>
                    <Link style={navBarStyle} to="/category">CPU</Link>
                    <Link style={navBarStyle} to="/category">RAM</Link>
                    <Link style={navBarStyle} to="/category">Motherboards</Link>
                    <Link style={navBarStyle} to="/category">Other</Link>
                    <Link style={navBarStyle} to="/cart">Cart</Link>
                    <Button style={navBarStyle} variant="primary" onClick={handleShow}>Login</Button>
                    <Button style={navBarStyle}>Register</Button>

                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" />
                                <Form.Text className="text-muted">
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="primary" type="submit" onClick={handleClose}>Login </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Switch>
                    <Route path="/cart">
                        <Cart />
                    </Route>
                    <Route path="/category">
                        <FilterView />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}
export default App;
