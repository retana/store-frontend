// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, TextField, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAlt from '@mui/icons-material/ListAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom'; // Importa Link para la navegación
import axios from 'axios';

import productImage1 from '../assets/producto1.png';
import productImage2 from '../assets/producto2.png';
import productImage3 from '../assets/producto3.png';

const Home = ({ setCartItems }) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/product', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [jwtToken]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        product.description.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Cerrar sesión');
    navigate('/');

  };

  const handleAddToCart = (product) => {
    setCartItems(prevItems => [...prevItems, product]);
  };

  const getImageUrl = (imageName) => {
    const imageMap = {
      'producto1.png': productImage1,
      'producto2.png': productImage2,
      'producto3.png': productImage3,
    };
    return imageMap[imageName] || productImage1;
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Home
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Buscar productos"
            value={search}
            onChange={handleSearch}
            style={{ marginRight: 16, backgroundColor: 'white' }}
          />
          <IconButton color="inherit">
            <Link to="/cart" style={{ color: 'inherit' }}>
              <ShoppingCartIcon />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link to="/orders" style={{ color: 'inherit', textDecoration: 'none' }}>
            <ListAlt />
            </Link>
          </IconButton>
          <IconButton color="inherit">
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
              <AccountCircle/>
            </Link>
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="140"
                  image={getImageUrl(product.image)}
                  title={product.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {product.amount}
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
                    Agregar al Carrito
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
