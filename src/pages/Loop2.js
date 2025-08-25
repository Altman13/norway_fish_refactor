import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Grid, Container } from '@mui/material';

import Header from './Header';
import Footer from './Footer';
import Loop1 from './Loop1';
import Loop3 from './Loop3';
import Loop4 from './Loop4';

export default function Loop2() {
  const location = useLocation();
  const navigate = useNavigate();
  const blockBIndex = location.state.blockBIndex;

  console.count('Loop2 rerender');

  const finishOperation = () => {
    const currentDataInBlockB = JSON.parse(localStorage.getItem(blockBIndex)) || {};
    currentDataInBlockB.isReady = true;
    localStorage.setItem(blockBIndex, JSON.stringify(currentDataInBlockB));

    console.log('FIS operation finished, ready to send', currentDataInBlockB);

    fetch('http://192.168.3.1:8000/api/fis/current', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentDataInBlockB),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Response from API:', data);
        navigate('/fisoperationform');
      })
      .catch((err) => console.error('Error sending FIS operation:', err));
  };

  const routeChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case 'loop1':
        navigate('/loop1');
        break;
      case 'goToStartPage':
      default:
        navigate('/fisoperationform');
        break;
    }
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
          component="form"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Loop4 blockBIndex={blockBIndex} />
              <Loop3 blockBIndex={blockBIndex} />
              <Loop1 blockBIndex={blockBIndex} />
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="outlined"
                value="goToStartPage"
                fullWidth
                sx={{ border: '2px solid' }}
                onClick={routeChange}
              >
                Gå til start side
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="error"
                value="finishOperation"
                fullWidth
                sx={{ border: '2px solid' }}
                onClick={finishOperation}
              >
                READY
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
