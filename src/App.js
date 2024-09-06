import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';   
import Cart from './components/Cart';
import Orders from './components/Orders';
import Profile from './components/Profile'; // Asegúrate de importar el componente Profile

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Define la ruta principal como la página de Login */}
        <Route path="/" element={<Login />} />
        {/* Define otras rutas, por ejemplo, una vez que el usuario haya iniciado sesión */}
        <Route path="/home" element={<Home setCartItems={setCartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} /> 

      </Routes>
    </Router>
  );
}

export default App;
