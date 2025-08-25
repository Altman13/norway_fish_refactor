import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Autocomplete,
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function Loop4({ blockBIndex }) {
  const redskapCheckingFoRAdditionalFeilds = ['LHP','LHM','LLS','LLD','LL','LTL','LX','FPN','FPO','FYK','FSN','FWR','FAR','FIX'];
  const geStatusIfGNS = ['GNS','GND','GNC','GNF','GTR','GTN','GEN','GN'];

  const gpHardCode = [
    { code: 0, name: 'Ingen redskapsproblem' },
    { code: 1, name: 'Bomkast' },
    { code: 2, name: 'Notsprenging' },
    { code: 3, name: 'Splitt' },
    { code: 4, name: 'Hull i sekk' },
    { code: 5, name: 'Mistet redskap' },
    { code: 6, name: 'Annet' },
    { code: 7, name: 'Bomskudd hval' },
    { code: 8, name: 'Tapt hval' },
  ];

  const ssHardCode = [
    { code: 'NOR01', name: 'Norsk vårgytende sild' },
    { code: 'NOR02', name: 'Nordsjøsild' },
  ];

  const [fishCode, setFishCode] = useState([]);
  const [gpCode, setGpCode] = useState([]);
  const [fishName, setFishName] = useState([]);
  const [weight, setWeight] = useState([]);
  const [arOB, setArOB] = useState([]);
  
  const [redskapsproblemer, setRedskapsproblemer] = useState(0);
  const [fo, setFo] = useState('');
  const [ss, setSs] = useState('');
  const [validTeiner, setValidTeiner] = useState(true);
  
  const [renderAditionalBlockForSild, setRenderAditionalBlockForSild] = useState(false);
  const [render, setRender] = useState(false);
  const [renderGns, setRenderGns] = useState(false);

  const { control, handleSubmit } = useForm({ reValidateMode: 'onBlur' });
  const { fields: ob, append: appendFishRow, remove: removeFishRow, update: updateFishRow } = useFieldArray({ control, name: 'ob' });

  useEffect(() => {
    // Загрузка GP-кодов
    fetch('http://192.168.3.1:8000/api/dep/gp')
      .then(res => res.json())
      .then(setGpCode);

    const blockData = JSON.parse(localStorage.getItem(blockBIndex)) || {};
    setFo(blockData.FO || '');
    setSs(blockData.SS || '');
    setRedskapsproblemer(blockData.GP || 0);

    // Загрузка рыбных кодов
    fetch('http://192.168.3.1:8000/api/dep/fish')
      .then(res => res.json())
      .then((fs) => {
        setFishCode(fs);
        if (blockData.CA) {
          blockData.CA.forEach((item, index) => {
            appendFishRow({});
            const fish = fs.find(f => f.code === item.split(' ')[0]);
            fishName[index] = fish;
            weight[index] = item.split(' ')[1];
            arOB[index] = `${fish.code} ${weight[index]}`;
          });
          setFishName([...fishName]);
          setWeight([...weight]);
          setArOB([...arOB]);
        } else blockData.CA = [];
        localStorage.setItem(blockBIndex, JSON.stringify(blockData));
      });

  }, [blockBIndex]);

  const updateBlockB = (key, value) => {
    const blockData = JSON.parse(localStorage.getItem(blockBIndex)) || {};
    blockData[key] = value;
    localStorage.setItem(blockBIndex, JSON.stringify(blockData));
  };

  const handleRedskapsproblemerChange = (e) => {
    setRedskapsproblemer(e.target.value);
    updateBlockB('GP', e.target.value);
  };

  const handleFoChange = (e) => {
    const val = e.target.value;
    setFo(val);
    setValidTeiner(/^[0-9]*$/.test(val));
    updateBlockB('FO', val);
  };

  const handleSsChange = (e) => {
    setSs(e.target.value);
    updateBlockB('SS', e.target.value);
  };

  const handleFishName = (value, index) => {
    if (!value?.code) return;
    fishName[index] = value;
    setFishName([...fishName]);
    if (value.code === 'HER') setRenderAditionalBlockForSild(true);

    arOB[index] = `${value.code} ${weight[index] || 0}`;
    setArOB([...arOB]);
    updateBlockB('CA', arOB);
  };

  const handleWeight = (e, index) => {
    weight[index] = parseInt(e.target.value, 10) || 0;
    setWeight([...weight]);
    arOB[index] = `${fishName[index]?.code || ''} ${weight[index]}`;
    setArOB([...arOB]);
    updateBlockB('CA', arOB);
  };

  const handleRemoveFish = (index) => {
    fishName.splice(index, 1);
    weight.splice(index, 1);
    arOB.splice(index, 1);
    removeFishRow(index);
    setFishName([...fishName]);
    setWeight([...weight]);
    setArOB([...arOB]);
    updateBlockB('CA', arOB);
  };

  const addFishToOb = () => appendFishRow({});

  const toggleAccordion = () => {
    const blockData = JSON.parse(localStorage.getItem(blockBIndex)) || {};
    setRender(redskapCheckingFoRAdditionalFeilds.includes(blockData.GE));
    setRenderGns(geStatusIfGNS.includes(blockData.GE));
  };

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Accordion onClick={toggleAccordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Fangst</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ border: '2px solid rgb(222,226,229)', borderRadius: 5, padding: 20 }}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="redskapsproblemer-label">Var det Redskapsproblemer?</InputLabel>
              <Select
                fullWidth
                labelId="redskapsproblemer-label"
                value={redskapsproblemer}
                onChange={handleRedskapsproblemerChange}
              >
                {gpHardCode.map((d) => (
                  <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>
                ))}
              </Select>

              {render && (
                <TextField
                  required
                  label="Registrer antall TEINER / KROK"
                  variant="filled"
                  value={fo}
                  error={!validTeiner}
                  onChange={handleFoChange}
                  sx={{ mt: 2 }}
                />
              )}

              {renderGns && (
                <TextField
                  required
                  label="Registrer antall meter Garn"
                  variant="filled"
                  value={fo}
                  error={!validTeiner}
                  onChange={handleFoChange}
                  sx={{ mt: 2 }}
                />
              )}
            </FormControl>

            {ob.map((field, index) => (
              <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={7}>
                  <Controller
                    control={control}
                    name={`ob.${index}.fishcode`}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={fishName[index] || null}
                        options={fishCode}
                        getOptionLabel={(option) => option.name || ''}
                        onChange={(e, value) => handleFishName(value, index)}
                        renderInput={(params) => <TextField {...params} required label="Fangst" />}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Controller
                    control={control}
                    name={`ob.${index}.fishweight`}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={weight[index] || ''}
                        onChange={(e) => handleWeight(e, index)}
                        label="Kg"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        required
                        style={{ minWidth: 80 }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={1}>
                  <Button color="error" variant="text" onClick={() => handleRemoveFish(index)}>
                    <DeleteForeverIcon fontSize="large" />
                  </Button>
                </Grid>
              </Grid>
            ))}

            {renderAditionalBlockForSild && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="sild-label">Sild</InputLabel>
                <Select
                  labelId="sild-label"
                  value={ss}
                  onChange={handleSsChange}
                >
                  {ssHardCode.map((d) => (
                    <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button variant="contained" sx={{ mt: 1 }} onClick={addFishToOb}>
              Legg til Fangst
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
