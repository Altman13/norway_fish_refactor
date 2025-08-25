import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Box, Button, Grid, TextField, Select, MenuItem, Container, Autocomplete,
  FormControl, InputLabel, Tooltip, Stack
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Header from './Header';
import Footer from './Footer';
import {
  API_DEP_ALL_STATUSES, API_STM32_SEND, DEFAULT_DELAY_MS,
  LATITUDE_REGEX, LONGITUDE_REGEX
} from './constants';

export default function DepForm() {
  const navigate = useNavigate();
  const [portOptions, setPortOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const [fishOptions, setFishOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [position, setPosition] = useState({ bredde: '', lengde: '', validBredde: true, validLengde: true });
  const [pdt, setPdt] = useState(null);
  const [zdt, setZdt] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const { control, handleSubmit } = useForm({ reValidateMode: 'onBlur' });
  const { fields: ob, append: appendFish, remove: removeFish, update: updateFish } = useFieldArray({ control, name: 'ob' });

  /** API helpers */
  const fetchJSON = async (url) => {
    const res = await fetch(url);
    return res.json();
  };

  const normalizePosition = (pos) => pos?.replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-');

  /** Initial data load */
  useEffect(() => {
    async function loadInitialData() {
      const [ports, activities, fishCodes, favs, depAuto, obData] = await Promise.all([
        fetchJSON('/api/dep/ports'),
        fetchJSON('/api/dep/activity'),
        fetchJSON('/api/dep/fish'),
        fetchJSON('/api/fav'),
        fetchJSON('/api/dep/get-dep-auto'),
        fetchJSON('/api/dep/get-ob')
      ]);

      setPortOptions(ports);
      setActivityOptions(activities);
      setFishOptions(fishCodes);
      setFavorites(favs);

      if (depAuto?.[0]) {
        const dep = depAuto[0];
        setPosition({
          bredde: dep.LAO.split(' ')[0],
          lengde: dep.LAO.split(' ')[1],
          validBredde: LATITUDE_REGEX.test(dep.LAO.split(' ')[0]),
          validLengde: LONGITUDE_REGEX.test(dep.LAO.split(' ')[1])
        });
        setPdt(new Date(dep.PDT));
        setZdt(new Date(dep.ZDT));
      }

      if (obData?.[0]?.fish?.length > 0) {
        obData[0].fish.forEach((f, i) => {
          const [code, weight] = f.split(' ');
          const fishObj = fishCodes.find((fc) => fc.code === code);
          appendFish({ fishcode: fishObj, fishweight: parseInt(weight, 10) });
        });
      }
    }
    loadInitialData();
  }, [appendFish]);

  /** Handlers */
  const handlePositionChange = (field, value) => {
    const regex = field === 'bredde' ? LATITUDE_REGEX : LONGITUDE_REGEX;
    setPosition((prev) => ({ ...prev, [field]: value, [`valid${field.charAt(0).toUpperCase() + field.slice(1)}`]: regex.test(value) }));
  };

  const handleRemoveFish = (index) => removeFish(index);

  const handleOnSubmit = async (data) => {
    setIsDisabled(true);
    const allStatuses = { dep: { src: '/static/illustrations/icons/Waiting.svg' }, lastMessage: { dep: { src: '/static/illustrations/icons/Waiting.svg' } } };
    localStorage.setItem('allStatusesSendingMessages', JSON.stringify(allStatuses));
    await fetchJSON(API_DEP_ALL_STATUSES, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(allStatuses) });

    await fetch(API_STM32_SEND, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { req: 'DATIPOS' } }) });
    await new Promise(r => setTimeout(r, DEFAULT_DELAY_MS));

    const mainPos = normalizePosition(localStorage.getItem('pos'));
    const bruker = localStorage.getItem('bruker')?.toUpperCase();
    const mainDate = new Date();

    const depPayload = {
      TM: 'DEP',
      AD: 'NOR',
      RC: localStorage.getItem('RCSIG')?.toUpperCase(),
      MA: bruker,
      RN: '',
      DATI: mainDate.toISOString().replace(/T|:|-/g, ' ').slice(0, 16),
      PO: data.port?.code,
      DS: data.malart?.code,
      OB: data.ob?.map((f) => `${f.fishcode.code} ${f.fishweight}`),
      PDT: pdt.toISOString().replace(/T|:|-/g, ' ').slice(0, 16),
      LAO: `${position.bredde} ${position.lengde}`,
      AC: data.planlagtAktivtet?.code,
      ZDT: zdt.toISOString().replace(/T|:|-/g, ' ').slice(0, 16),
      XTG: mainPos
    };

    await fetch(API_STM32_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: depPayload, flags: { send: true } })
    });

    navigate('/');
  };

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" component="form" onSubmit={handleSubmit(handleOnSubmit)}>
          <Grid container spacing={3}>
            <h1 style={{ textAlign: 'center', marginTop: '40px', width: '100%', fontFamily: 'cursive', fontSize: '20px' }}>HAVNEAVGANG (DEP)</h1>
            <Grid item xs={12}>
              <Button style={{ border: 'solid 2px', marginBottom: '20px', width: '100%' }} onClick={() => navigate('/')}>Gå til start side</Button>
            </Grid>

            {/* Port */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="port"
                render={({ field }) => (
                  <Autocomplete {...field} options={portOptions} getOptionLabel={(opt) => opt.name} onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => <TextField {...params} label="Avgangs Havn" required />} />
                )}
              />
            </Grid>

            {/* Planlagt aktivitet */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="planlagtAktivtet"
                render={({ field }) => (
                  <Autocomplete {...field} options={activityOptions} getOptionLabel={(opt) => opt.name} onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => <TextField {...params} label="Planlagt aktivitet" required />} />
                )}
              />
            </Grid>

            {/* Malart */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="malart"
                render={({ field }) => (
                  <Autocomplete {...field} options={fishOptions} getOptionLabel={(opt) => opt.name} onChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => <TextField {...params} label="Målart" required />} />
                )}
              />
            </Grid>

            {/* OB rows */}
            <Grid item xs={12}>
              <div>Kvantum ombord</div>
              {ob.map((field, index) => (
                <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      name={`ob.${index}.fishcode`}
                      render={({ field }) => (
                        <Autocomplete {...field} options={fishOptions} getOptionLabel={(opt) => opt.name}
                          onChange={(_, value) => field.onChange(value)}
                          renderInput={(params) => <TextField {...params} label="Målart" required />} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name={`ob.${index}.fishweight`}
                      render={({ field }) => (
                        <TextField {...field} label="Kg" type="number" required />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button color="error" variant="text" onClick={() => handleRemoveFish(index)}><DeleteForeverIcon fontSize='large' /></Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" style={{ marginTop: '5px' }} onClick={() => appendFish({})}>Legg til Kvantum ombord</Button>
            </Grid>

            {/* PDT */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DateTimePicker label="Fiskestart Dato og Tid" value={pdt} ampm={false} onChange={setPdt} renderInput={(params) => <TextField {...params} required />} />
                </Stack>
              </LocalizationProvider>
            </Grid>

            {/* Position */}
            <Grid item xs={12}>
              <TextField label="Bredde" value={position.bredde} error={!position.validBredde} onChange={(e) => handlePositionChange('bredde', e.target.value)} fullWidth required />
              <TextField label="Lengde" value={position.lengde} error={!position.validLengde} onChange={(e) => handlePositionChange('lengde', e.target.value)} fullWidth required />
            </Grid>

            {/* ZDT */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DateTimePicker label="Avgangs Dato og Tid" value={zdt} ampm={false} onChange={setZdt} renderInput={(params) => <TextField {...params} required />} />
                </Stack>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" disabled={isDisabled} fullWidth style={{ border: 'solid 2px', color: 'green' }}>Send DEP</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
