import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import productImage1 from '../assets/producto1.png';
import productImage2 from '../assets/producto2.png';
import productImage3 from '../assets/producto3.png';

// Función para obtener la URL de la imagen
const getImageUrl = (imageName) => {
  const imageMap = {
    'producto1.png': productImage1,
    'producto2.png': productImage2,
    'producto3.png': productImage3,
  };
  return imageMap[imageName] || productImage1; // Imagen por defecto en caso de que no haya coincidencia
};

const Cart = ({ cartItems, setCartItems }) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  useEffect(() => {
    // Obtener la información del usuario desde el localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.shippingAddress) {
      setShippingAddress(userInfo.shippingAddress);
    }
  }, []);

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleAddressChange = (event) => {
    setShippingAddress(event.target.value);
  };

  const handleCheckout = async () => {
    try {
      // Asegúrate de que el carrito no esté vacío
      if (cartItems.length === 0) {
        throw new Error('El carrito está vacío');
      }

      // Obtener el ID del cliente desde localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.id) {
        throw new Error('No se ha encontrado el ID del cliente');
      }

      const customerId = userInfo.id;
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se ha encontrado el token de autenticación');
      }

      // Preparar el payload
      const productIds = cartItems.map(item => item.id).join(',');
      const totalAmount = cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

      console.log('PRODUCTOS: '+productIds)

      const orderPayload = {
        customerId: customerId,
        productIds: productIds,
        quantity: cartItems.reduce((total, item) => total + (item.quantity || 1), 0),
        amount: totalAmount,
        shippingAddress,
        status: 'PENDING'
      };

      const response = await fetch('http://localhost:8080/api/v1/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok) {
        setOrderConfirmation({
          message: 'Pedido confirmado',
          orderId: result.orderId,
        });
        // Vaciar el carrito después de la compra
        setCartItems([]);
      } else {
        throw new Error(result.message || 'Error al realizar el pedido');
      }
    } catch (error) {
      console.error(error);
      //alert(error.message);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Carrito de Compras
          </Typography>
          <Button color="inherit">
            <Link to="/home" style={{ color: 'inherit' }}>
              Volver a la tienda
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        {cartItems.length === 0 ? (
          <Typography variant="h6">El carrito está vacío</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Imagen</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          style={{ width: 100, height: 100, objectFit: 'cover' }}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>${(product.price || 0).toFixed(2)}</TableCell>
                      <TableCell>{product.quantity || 1}</TableCell>
                      <TableCell>${((product.price || 0) * (product.quantity || 1)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="h6">Total: ${calculateTotal()}</Typography>
            </Box>
          </>
        )}
        {cartItems.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Dirección de Envío</Typography>
            {isEditingAddress ? (
              <TextField
                fullWidth
                variant="outlined"
                value={shippingAddress}
                onChange={handleAddressChange}
                label="Dirección de Envío"
                placeholder="Introduce tu dirección de envío"
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <Typography variant="body1">{shippingAddress}</Typography>
            )}
            <Button
              variant="outlined"
              onClick={isEditingAddress ? () => setIsEditingAddress(false) : handleEditAddress}
            >
              {isEditingAddress ? 'Guardar Dirección' : 'Editar Dirección'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{ marginTop: 2 }}
            >
              Finalizar Compra
            </Button>
          </Box>
        )}
        {orderConfirmation && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">{orderConfirmation.message}</Typography>
            <Typography variant="body1">Número de Orden: {orderConfirmation.orderId}</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default Cart;
