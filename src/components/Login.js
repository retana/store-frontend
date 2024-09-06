import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Avatar, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Crear un tema (opcional)
const theme = createTheme();

function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    try {
      // Realizar la solicitud de inicio de sesión
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Enviar credenciales al backend
      });

      const result = await response.json();

      if (response.ok) {
        // Almacenar el token JWT en localStorage
        localStorage.setItem('token', result.token);

        // Obtener la información del usuario
        const userResponse = await fetch('http://localhost:8080/user/me', {
          headers: {
            'Authorization': `Bearer ${result.token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('No se pudo obtener la información del usuario');
        }

        const userInfo = await userResponse.json();
        // Almacenar la información del usuario en el localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Redirigir a la página principal o a la que desees después del login exitoso
        navigate('/home');
      } else {
        // Si hay un error en la autenticación, mostrar un mensaje
        setError(result.message || 'Error en la autenticación');
      }
    } catch (err) {
      setError('Error en la conexión con el servidor');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          {error && <Typography color="error">{error}</Typography>} {/* Mostrar error si existe */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
