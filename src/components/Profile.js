// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  const [editable, setEditable] = useState(false);
  const jwtToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [jwtToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:8080/user/me/profile', user, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      setEditable(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Perfil de Usuario
          </Typography>
          <Button color="inherit">
            <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>
              Volver a la tienda
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 16 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Información de Usuario
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre de Usuario"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  disabled={!editable}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Correo Electrónico"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  disabled={!editable}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  disabled={!editable}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Apellido"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  disabled={!editable}
                />
                <div style={{ marginTop: 16 }}>
                  {editable ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleSave}>
                        Guardar
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setEditable(false)} style={{ marginLeft: 8 }}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" color="primary" onClick={() => setEditable(true)}>
                      Editar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Profile;
