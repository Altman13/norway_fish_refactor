import React, { useEffect, useState } from 'react';
import { Grid, Stack, TextField, FormControl } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';

export default function Loop3({ blockBIndex }) {
  const [duStartTime, setDuStartTime] = useState('');
  const [duStopTime, setDuStopTime] = useState('');
  const [favorite, setFavorite] = useState([]);

  const [breddeLTG, setBreddeLTG] = useState('');
  const [LengdeLTG, setLengdeLTG] = useState('');
  const [breddeXTG, setBreddeXTG] = useState('');
  const [LengdeXTG, setLengdeXTG] = useState('');

  const [validBreddeLTG, setValidBreddeLTG] = useState(true);
  const [validLengdeLTG, setValidLengdeLTG] = useState(true);
  const [validBreddeXTG, setValidBreddeXTG] = useState(true);
  const [validLengdeXTG, setValidLengdeXTG] = useState(true);

  useEffect(() => {
    const blockData = JSON.parse(localStorage.getItem(blockBIndex)) || {};

    if (blockData.BDT) {
      const bdt = moment(blockData.BDT, 'YYYYMMDDHHmm');
      setDuStartTime(bdt.format());
      setDuStopTime(bdt.add(blockData.DU || 0, 'minutes').format());
    }

    fetch('http://192.168.3.1:8000/api/fav')
      .then((res) => res.json())
      .then(setFavorite);

    if (blockData.LTG && blockData.XTG) {
      const [bLatLTG, bLngLTG] = blockData.LTG.split(' ');
      const [bLatXTG, bLngXTG] = blockData.XTG.split(' ');
      setBreddeLTG(bLatLTG);
      setLengdeLTG(bLngLTG);
      setBreddeXTG(bLatXTG);
      setLengdeXTG(bLngXTG);
    }
  }, [blockBIndex]);

  const updateBlockB = (key, value) => {
    const blockData = JSON.parse(localStorage.getItem(blockBIndex)) || {};
    blockData[key] = value;
    localStorage.setItem(blockBIndex, JSON.stringify(blockData));
  };

  const handleBDTStartTime = (newValue) => {
    setDuStartTime(newValue);
    updateBlockB('BDT', moment(new Date(newValue)).format());
    const zdt = JSON.parse(localStorage.getItem(blockBIndex))?.ZDT;
    if (zdt) {
      const diff = Math.abs(new Date(newValue) - new Date(zdt));
      updateBlockB('DU', Math.floor(diff / 1000 / 60));
    }
  };

  const handleZDTstopTime = (newValue) => {
    setDuStopTime(newValue);
    updateBlockB('ZDT', moment(new Date(newValue)).format());
    const bdt = JSON.parse(localStorage.getItem(blockBIndex))?.BDT;
    if (bdt) {
      const diff = Math.abs(new Date(newValue) - new Date(bdt));
      updateBlockB('DU', Math.floor(diff / 1000 / 60));
    }
  };

  const handlePositionChange = (value, type) => {
    const fav = favorite.find((el) => el.navn === value);
    if (!fav) return;

    const [latKey, lngKey] = type === 'start' ? ['LTG', 'LTG'] : ['XTG', 'XTG'];
    const [setLat, setLng] = type === 'start' ? [setBreddeLTG, setLengdeLTG] : [setBreddeXTG, setLengdeXTG];

    setLat(fav.bredde);
    setLng(fav.Lengde);
    updateBlockB(latKey, `${fav.bredde} ${fav.Lengde}`);
  };

  const handleCoordinateChange = (value, type) => {
    const regLat = /^([+-]{1})([0-8][0-9]\.\d{3})$/;
    const regLng = /^([+-]{1})(0[0-9]{2}|1[0-7][0-9])\.\d{3}$/;

    if (type === 'breddeLTG') {
      setValidBreddeLTG(regLat.test(value));
      setBreddeLTG(value);
    } else if (type === 'lengdeLTG') {
      setValidLengdeLTG(regLng.test(value));
      setLengdeLTG(value);
    } else if (type === 'breddeXTG') {
      setValidBreddeXTG(regLat.test(value));
      setBreddeXTG(value);
    } else if (type === 'lengdeXTG') {
      setValidLengdeXTG(regLng.test(value));
      setLengdeXTG(value);
    }
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Start/Stop FiOp</Typography>
        </AccordionSummary>
        <AccordionDetails>
          Du kan korrigere Dato/Tid/Posisjon manuelt
          <div style={{ border: '2px solid rgb(222,226,229)', borderRadius: '5px', padding: '20px' }}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                required
                label="Bredde start"
                variant="filled"
                value={breddeLTG}
                error={!validBreddeLTG}
                onChange={(e) => handleCoordinateChange(e.target.value, 'breddeLTG')}
                sx={{ mt: 2 }}
              />
              <TextField
                required
                label="Lengde start"
                variant="filled"
                value={LengdeLTG}
                error={!validLengdeLTG}
                onChange={(e) => handleCoordinateChange(e.target.value, 'lengdeLTG')}
                sx={{ mt: 2 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <DateTimePicker
                    label="Fiskerstart Dato og Tid"
                    ampm={false}
                    value={duStartTime}
                    onChange={handleBDTStartTime}
                    renderInput={(params) => <TextField required {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <TextField
                required
                label="Bredde stop"
                variant="filled"
                value={breddeXTG}
                error={!validBreddeXTG}
                onChange={(e) => handleCoordinateChange(e.target.value, 'breddeXTG')}
                sx={{ mt: 2 }}
              />
              <TextField
                required
                label="Lengde stop"
                variant="filled"
                value={LengdeXTG}
                error={!validLengdeXTG}
                onChange={(e) => handleCoordinateChange(e.target.value, 'lengdeXTG')}
                sx={{ mt: 2 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <DateTimePicker
                    label="Fiskestop Dato og Tid"
                    ampm={false}
                    value={duStopTime}
                    onChange={handleZDTstopTime}
                    renderInput={(params) => <TextField required {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </FormControl>
          </div>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
