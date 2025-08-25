import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Loop1({ blockBIndex, dcaCorrection, onlyBlockA }) {
  const [headerText, setHeaderText] = useState('');
  const [activity, setActivity] = useState('');
  const [zone, setZone] = useState('');
  const [kvote, setKvote] = useState('');
  const [ge, setGe] = useState('');
  const [gs, setGs] = useState('');
  const [me, setMe] = useState('');
  const [go, setGo] = useState('');
  const [tf, setTf] = useState('');

  const [renderAdditional, setRenderAdditional] = useState(false);
  const [renderTf, setRenderTf] = useState(false);
  const [renderSelect, setRenderSelect] = useState(false);

  const [kvoteCode, setKvoteCode] = useState([]);
  const [zoneCode, setZoneCode] = useState([]);
  const [activityCode, setActivityCode] = useState([]);
  const [geCode, setGeCode] = useState([]);
  const [gsCode, setGsCode] = useState([]);

  const ActivityHardCode = [
    { code: 'FIS', name: 'Fiske' },
    { code: 'REL', name: 'Fangst relokalisering (overføring av fangst)' },
    { code: 'SCR', name: 'Vitenskapelig forskning' },
    { code: 'OTH', name: 'Annet' },
  ];

  const redskapAdditionalSelect = [
    'TBB', 'OTB', 'PTB', 'TBN', 'TBS', 'TB', 'OMT', 'PTM', 'TMS', 'TM', 'OTT', 'OT', 'PT', 'TY',
  ];
  const redskapAdditionalFields = [
    'SB','SV','SDN','SSC','SPR','SX','GNS','GND','GNC','GNF','GTR','GTN','GEN','GN',
  ];

  const updateBlockB = (key, value) => {
    const current = JSON.parse(localStorage.getItem(blockBIndex)) || JSON.parse(localStorage.getItem('blockB')) || {};
    current[key] = value;
    localStorage.setItem(blockBIndex || 'blockB', JSON.stringify(current));
  };

  const handleChange = (setter, key) => (e) => {
    const value = e.target.value;
    setter(value);
    updateBlockB(key, value);
  };

  const handleActivityChange = (e) => {
    const value = e.target.value;
    setActivity(value);
    if (value === 'REL') setRenderTf(true);
    updateBlockB('AC', value);
  };

  const handleGeChange = (e) => {
    const value = e.target.value;
    setGe(value);
    const additionalFields = redskapAdditionalFields.includes(value) || redskapAdditionalSelect.includes(value);
    setRenderAdditional(additionalFields);
    setRenderSelect(redskapAdditionalSelect.includes(value));
    updateBlockB('GE', value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [qi, zo, ac, geData, gsData] = await Promise.all([
        fetch('http://192.168.3.1:8000/api/dep/qi').then(r => r.json()),
        fetch('http://192.168.3.1:8000/api/dep/zo').then(r => r.json()),
        fetch('http://192.168.3.1:8000/api/dep/activity').then(r => r.json()),
        fetch('http://192.168.3.1:8000/api/dep/ge').then(r => r.json()),
        fetch('http://192.168.3.1:8000/api/dep/gs').then(r => r.json()),
      ]);
      setKvoteCode(qi);
      setZoneCode(zo);
      setActivityCode(ac);
      setGeCode(geData);
      setGsCode(gsData);
    };
    fetchData();

    setHeaderText(dcaCorrection || onlyBlockA ? 'Melding uten FiOp' : 'Operasjon info');

    const block = JSON.parse(localStorage.getItem(blockBIndex)) || JSON.parse(localStorage.getItem('blockB')) || {};
    setActivity(block.AC || '');
    setZone(block.ZO || '');
    setKvote(block.QI || '');
    setGe(block.GE || '');
    setGs(block.GS || '');
    setMe(block.ME || '');
    setGo(block.GO || '');
    setTf(block.TF || '');
  }, [blockBIndex, dcaCorrection, onlyBlockA]);

  return (
    <Grid item xs={12} sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{headerText}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ border: '2px solid rgb(222,226,229)', borderRadius: '5px', padding: '20px' }}>
            {!dcaCorrection && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Kvote</InputLabel>
                <Select value={kvote} onChange={handleChange(setKvote, 'QI')}>
                  {kvoteCode.map(d => <MenuItem key={d.id} value={d.code}>{d.name}</MenuItem>)}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Sone</InputLabel>
              <Select value={zone} onChange={handleChange(setZone, 'ZO')}>
                {zoneCode.map(d => <MenuItem key={d.id} value={d.code}>{d.name}</MenuItem>)}
              </Select>
            </FormControl>

            {!dcaCorrection && (
              <>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Aktivitet</InputLabel>
                  <Select value={activity} onChange={handleActivityChange}>
                    {(onlyBlockA || ActivityHardCode).map(el => (
                      <MenuItem key={el.id} value={el.code}>{el.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {!onlyBlockA && (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Redskap</InputLabel>
                    <Select value={ge} onChange={handleGeChange}>
                      {geCode.map(el => <MenuItem key={el.id} value={el.code}>{el.name}</MenuItem>)}
                    </Select>

                    {renderSelect && (
                      <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Type Trål</InputLabel>
                        <Select value={gs} onChange={handleChange(setGs, 'GS')}>
                          {gsCode.map(el => <MenuItem key={el.id} value={el.code}>{el.name}</MenuItem>)}
                        </Select>
                      </FormControl>
                    )}

                    {renderAdditional && (
                      <>
                        <TextField label="Maskevidde (mm)" variant="filled" value={me} onChange={handleChange(setMe, 'ME')} fullWidth sx={{ mt: 2 }} />
                        <TextField label="Spileavstand i Rist (mm)" variant="filled" value={go} onChange={handleChange(setGo, 'GO')} fullWidth sx={{ mt: 2 }} />
                      </>
                    )}

                    {renderTf && (
                      <TextField label="TF (Pumpet fra)" variant="filled" value={tf} onChange={handleChange(setTf, 'TF')} fullWidth sx={{ mt: 2 }} />
                    )}
                  </FormControl>
                )}
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
