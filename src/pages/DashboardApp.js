import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Avatar, Button, Box, Stack, Snackbar, Paper, BottomNavigation } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import Page from '../components/Page';
import Footer from './Footer';
import InfoBlock from './InfoBlock';

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const actionsList = [
  { id: 'dep', label: 'HAVNEAVGANG (DEP)', color: 'success' },
  { id: 'fis', label: 'FISKEOPERASJON' },
  { id: 'dca', label: 'FANGST (DCA)' },
  { id: 'por', label: 'HAVNEANLØP (POR)' },
  { id: 'coe', label: 'FISKESTART I SONE (COE)' },
  { id: 'cox', label: 'AVSLUTNING AV FISKE I SONE (COX)' },
  { id: 'tra', label: 'OMLASTING/LÅSSETTING (TRA)' },
];

export default function DashboardApp() {
  const [bruker, setBruker] = useState('');
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const history = useNavigate();

  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  const fetchBruker = async () => {
    try {
      const res = await fetch('http://192.168.3.1:8000/api/auth/login');
      const data = await res.json();
      setBruker(data);
      localStorage.setItem('bruker', data);
    } catch (err) {
      console.error('Ошибка fetchBruker:', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await fetch('http://192.168.3.1:8000/api/dep/allstatuses');
      const data = await res.json();
      localStorage.setItem(
        'allStatusesSendingMessages',
        JSON.stringify({ ...data.allStatusesSendingMessages })
      );
    } catch (err) {
      console.error('Ошибка fetchStatuses:', err);
    }
  };

  useEffect(() => {
    fetchBruker();
    fetchStatuses();
  }, []);

  const routeChange = (e) => {
    const tm = e.target.value;
    // Здесь можно вызвать вашу функцию getMsgForCorAndCancel или навигацию
    if (tm === 'fis') {
      history('/fisoperationform');
    } else {
      // пример вызова getMsgForCorAndCancel(tm)
      console.log('Navigate for:', tm);
    }
  };

  return (
    <div className="App">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="86vh" component="form">
        <Page title="Brommeland">
          <Container maxWidth="xl">
            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                  User interface was blocked
                </Alert>
              </Snackbar>
            </Stack>

            <Box>
              <Grid container spacing={2} alignItems="center">
                <InfoBlock bruker={bruker} />
                {actionsList.map((action) => (
                  <React.Fragment key={action.id}>
                    <Grid item xs={1}>
                      <Avatar id={action.id} src="/static/illustrations/icons/Grey.svg" alt={action.id} />
                    </Grid>
                    <Grid item xs={11}>
                      <Button
                        fullWidth
                        color={action.color || 'primary'}
                        value={action.id}
                        onClick={routeChange}
                      >
                        {action.label}
                      </Button>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Container>
        </Page>
      </Box>

      <Paper>
        <BottomNavigation showLabels style={{ background: '#F9FAFB' }}>
          <Footer />
        </BottomNavigation>
      </Paper>
    </div>
  );
}
