import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Container,
  Autocomplete,
  FormControl,
  InputLabel,
  Stack,
  Tooltip
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Header from './Header';
import Footer from './Footer';

// Хук для управления массивом рыбы (OB/KG)
const useFishArray = (control, name) => {
  const { fields, append, remove, update } = useFieldArray({ control, name });
  const [fishNameArr, setFishNameArr] = useState([]);
  const [weightArr, setWeightArr] = useState([]);
  const [arArr, setArArr] = useState([]);

  const handleFishName = (value, index) => {
    if (!value?.code) return;
    fishNameArr[index] = value;
    setFishNameArr([...fishNameArr]);
    arArr[index] = `${value.code} ${weightArr[index] || 0}`;
    setArArr([...arArr]);
    update(index, { fishcode: value.code, fishweight: weightArr[index] || 0 });
  };

  const handleWeight = (value, index) => {
    weightArr[index] = parseInt(value, 10) || 0;
    setWeightArr([...weightArr]);
    if (fishNameArr[index]?.code) arArr[index] = `${fishNameArr[index].code} ${weightArr[index]}`;
    setArArr([...arArr]);
    update(index, { fishcode: fishNameArr[index]?.code || '', fishweight: weightArr[index] });
  };

  const addFish = () => append({ fishcode: '', fishweight: '' });
  const removeFish = (index) => {
    remove(index);
    fishNameArr.splice(index, 1);
    weightArr.splice(index, 1);
    arArr.splice(index, 1);
    setFishNameArr([...fishNameArr]);
    setWeightArr([...weightArr]);
    setArArr([...arArr]);
  };

  return { fields, fishNameArr, weightArr, arArr, handleFishName, handleWeight, addFish, removeFish };
};

// Валидация широты/долготы
const validateLatitude = (value) => /[NS]{1}([0-8]\d\.\d{2})/.test(value);
const validateLongitude = (value) => /[EW]{1}((0\d{2}|1[0-7]\d)\.\d{2})/.test(value);

export default function TraForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pdt, setPdt] = useState(dayjs().add(5, 'minute'));
  const [tt, setTt] = useState('');
  const [tf, setTf] = useState('');
  const [bredde, setBredde] = useState('');
  const [lengde, setLengde] = useState('');
  const [validBredde, setValidBredde] = useState(true);
  const [validLengde, setValidLengde] = useState(true);
  const [fiskerstartPosisjon, setFiskerstartPosisjon] = useState('');
  const [favorite, setFavorite] = useState([]);
  const [fishCode, setFishCode] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const { control, handleSubmit } = useForm({ reValidateMode: 'onBlur' });
  const ob = useFishArray(control, 'ob');
  const kg = useFishArray(control, 'kg');

  const handleOnSubmit = async () => {
    setIsDisabled(true);
    const tra = { src: '/static/illustrations/icons/Waiting.svg' };
    const allStatusesSendingMessages = JSON.parse(localStorage.getItem('allStatusesSendingMessages')) || {};
    allStatusesSendingMessages.tra = tra;
    allStatusesSendingMessages.lastMessage = { tra };

    await fetch('http://192.168.3.1:8000/api/dep/allstatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allStatusesSendingMessages),
    });

    const mainPos = (localStorage.getItem('pos') || '').replace(/[NEWS]/g, (m) => (['N','E'].includes(m)? '+':'-'));
    const mainDate = new Date();
    const bruker = localStorage.getItem('bruker');

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          TM: 'TRA',
          AD: 'NOR',
          RC: (localStorage.getItem('RCSIG') || '').toUpperCase(),
          MA: (bruker || '').toUpperCase(),
          RN: '',
          DATI: mainDate.toISOString().replace(/T|:|-/g, ' ').slice(0, -9),
          LAO: `${bredde} ${lengde}`,
          KG: kg.arArr.filter(Boolean),
          OB: ob.arArr.filter(Boolean),
          TT: tt,
          TF: tf,
          PDT: pdt.toISOString().replace(/T|:|-/g, ' ').slice(0, -9),
          XTG: mainPos,
        },
        flags: { send: true, isAsync: false, isSync: false, isCancel: false },
      }),
    };

    await fetch('http://192.168.3.1:8000/api/stm32/send', requestOptions);
    navigate('/');
  };

  useEffect(() => {
    fetch('http://192.168.3.1:8000/api/fav').then(res => res.json()).then(setFavorite);
    fetch('http://192.168.3.1:8000/api/dep/fish').then(res => res.json()).then(setFishCode);
  }, []);

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <Box component="form" onSubmit={handleSubmit(handleOnSubmit)} display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button fullWidth style={{ border: 'solid 2px', marginBottom: 20 }} onClick={() => navigate('/')}>
                Gå til start side
              </Button>
            </Grid>
            {location.state.TT && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField required value={tt} onChange={(e) => setTt(e.target.value)} label="Overført til" />
                </FormControl>
              </Grid>
            )}
            {location.state.TF && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField required value={tf} onChange={(e) => setTf(e.target.value)} label="Overført fra" />
                </FormControl>
              </Grid>
            )}
            {/* OB fish */}
            <Grid item xs={12}>
              {ob.fields.map((field, index) => (
                <Grid container spacing={1} key={field.id} alignItems="center">
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      name={`ob.${index}.fishcode`}
                      render={() => (
                        <Autocomplete
                          value={ob.fishNameArr[index] || ''}
                          onChange={(e, value) => ob.handleFishName(value, index)}
                          options={fishCode}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} required label="Målart" />}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      name={`ob.${index}.fishweight`}
                      render={() => (
                        <TextField
                          required
                          type="number"
                          value={ob.weightArr[index] || ''}
                          onChange={(e) => ob.handleWeight(e.target.value, index)}
                          label="Kg"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button color="error" onClick={() => ob.removeFish(index)}>
                      <DeleteForeverIcon fontSize="large" />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={ob.addFish} variant="contained">Legg til kvantum ombord</Button>
            </Grid>
            {/* DATE PICKER */}
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DateTimePicker label="Overføring start Dato og Tid" ampm={false} value={pdt} onChange={setPdt} renderInput={(props) => <TextField {...props} required />} />
                </Stack>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" disabled={isDisabled} fullWidth style={{ border: 'solid 2px', color: 'green' }}>Send TRA</Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
