// src/components/Orders.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, CircularProgress, Divider, IconButton } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Obtener el ID del cliente desde localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.id) {
          throw new Error('No se ha encontrado el ID del cliente');
        }

        const customerId = userInfo.id;
        const response = await axios.get(`http://localhost:8080/api/v1/order/${customerId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/product', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    };

    fetchOrders();
    fetchAllProducts();
  }, [jwtToken]);

  const handleOrderClick = (order) => {
    try {
      setLoading(true);
      // Suponiendo que `productIds` es una cadena de IDs separados por comas
      const productIds = order.productIds ? order.productIds.split(',') : [];
      if (productIds.length === 0) {
        setProductDetails([]);
        setSelectedOrder(order);
        return;
      }

      // Filtra los productos de `allProducts` para mostrar solo los que están en `productIds`
      const filteredProducts = allProducts.filter(product => productIds.includes(product.id.toString()));
      setProductDetails(filteredProducts);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error processing order details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Mis Órdenes
          </Typography>
          <Button color="inherit">
            <Link to="/home" style={{ color: 'inherit' }}>
              Volver a la tienda
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        <Grid container spacing={3}>
          {orders.length === 0 ? (
            <Typography variant="h6">No tienes órdenes</Typography>
          ) : (
            orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card onClick={() => handleOrderClick(order)} style={{ cursor: 'pointer' }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Orden #{order.orderId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: ${order.price || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estado: {order.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {/* Dialog for displaying order details */}
        <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
          <DialogTitle>
            Detalles de la Orden
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setSelectedOrder(null)}
              aria-label="close"
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </div>
            ) : (
              <div>
                <Typography variant="h6">Orden #{selectedOrder?.orderId} IDS{selectedOrder?.productIds}</Typography>
                <Typography variant="body1">Fecha: {new Date(selectedOrder?.createdAt).toLocaleDateString()}</Typography>
                <Typography variant="body1">Total: ${selectedOrder?.price || 'N/A'}</Typography>
                <Typography variant="body1">Estado: {selectedOrder?.status}</Typography>
                <Divider style={{ margin: '16px 0' }} />
                <Typography variant="h6">Productos:</Typography>
                {productDetails.length > 0 ? (
                  <List>
                    {productDetails.map((product) => (
                      <ListItem key={product.id}>
                        <ListItemText
                          primary={`${product.name} - ${product.quantity} x ${product.price ? product.price.toFixed(2) : 'N/A'}`}
                          secondary={product.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1">No se encontraron detalles de productos.</Typography>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Orders;
