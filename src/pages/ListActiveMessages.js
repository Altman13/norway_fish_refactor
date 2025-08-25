import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Container, Button } from '@mui/material';

import Header from './Header';
import Footer from './Footer';
import EditMessageComponent from './EditMessageComponent';

export default function ListActiveMessages() {
  const [showNewMessageBtn, setShowNewMessageBtn] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const messages = location.state?.messages || [];

  useEffect(() => {
    if (!messages.length) return;

    const firstMessageTM = messages[0].TM?.toLowerCase();
    const eligibleTMs = ['dep', 'coe', 'cox', 'dca', 'por', 'tra'];

    if (eligibleTMs.includes(firstMessageTM) && (firstMessageTM !== 'dep' || messages[0]?.newMessageRender)) {
      setShowNewMessageBtn(true);
    }
  }, [messages]);

  const goToStartPage = () => {
    navigate('/');
  };

  const goToCreateNewMsg = (tm) => {
    const targetTM = tm.toLowerCase();
    const route = targetTM === 'tra' ? `/${targetTM}Start` : `/${targetTM}form`;
    navigate(route);
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
              <h1
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontFamily: 'cursive',
                  fontWeight: 'bold'
                }}
              >
                Kansellering og korrigering
              </h1>

              <Button
                style={{ border: '2px solid', marginBottom: '20px', width: '100%' }}
                onClick={goToStartPage}
              >
                Gå til start side
              </Button>

              {showNewMessageBtn && (
                <Button
                  name={messages[0].TM}
                  fullWidth
                  style={{ border: '2px solid', marginBottom: '10px' }}
                  onClick={(e) => goToCreateNewMsg(e.target.name)}
                >
                  Ny melding
                </Button>
              )}

              <div>
                {messages.map((message) => (
                  <EditMessageComponent key={message._id} message={message} />
                ))}
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
