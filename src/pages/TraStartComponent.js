import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Container, Button, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

export default function TraStartComponent() {
  const navigate = useNavigate();

  const buttonStyle = { border: 'solid 2px', width: '100%' };

  const handleNavigate = (state) => {
    navigate('/traform', { state });
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: 'bold', marginBottom: 3 }}
              >
                OMLASTING/LÅSSETTING (TRA)
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ width: '100%' }}>
              <Button sx={{ ...buttonStyle, marginBottom: 2 }} onClick={() => navigate('/')}>
                Gå til start side
              </Button>
            </Grid>

            <Grid item xs={12} container spacing={2}>
              <Grid item xs={6}>
                <Button sx={buttonStyle} onClick={() => handleNavigate({ TF: 'TF' })}>
                  Jeg mottar fangst
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button sx={buttonStyle} onClick={() => handleNavigate({ TT: 'TT' })}>
                  Jeg avgir fangst/låssetting
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
