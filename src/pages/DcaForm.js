import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Container } from '@mui/material';

import Header from './Header';
import Footer from './Footer';
import DcaCard from './DcaCard';
import Loop1 from './Loop1';
import { API_ALL_STATUSES, API_SEND, LS_KEYS, DCA_TM, DCA_AD, ONLY_BLOCK_A } from './constants';

// ========================
// Helpers
// ========================
const apiFetch = (url, options) => fetch(url, options).then((res) => res.json());
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const normalizePosition = (pos) =>
  pos?.replaceAll('N', '+')?.replaceAll('E', '+')?.replaceAll('W', '-')?.replaceAll('S', '-');

// ========================
// Component
// ========================
export default function DcaForm() {
  const navigate = useNavigate();
  const { handleSubmit } = useForm({ reValidateMode: 'onBlur' });

  const [dcaBlocks, setDcaBlocks] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  // ------------------------
  // Handlers
  // ------------------------
  const goToStartPage = () => navigate('/');

  const handleOnSubmit = useCallback(async () => {
    setIsDisabled(true);

    // сохраняем статус
    const dcaStatus = { src: '/static/illustrations/icons/Waiting.svg' };
    const allStatuses = JSON.parse(localStorage.getItem(LS_KEYS.ALL_STATUSES)) || {};
    allStatuses.dca = dcaStatus;
    allStatuses.lastMessage = { dca: dcaStatus };
    localStorage.setItem(LS_KEYS.ALL_STATUSES, JSON.stringify(allStatuses));

    await apiFetch(API_ALL_STATUSES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allStatuses),
    });

    // запрашиваем позицию
    await apiFetch(API_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { req: 'DATIPOS' } }),
    });

    await delay(2000);

    const pos = normalizePosition(localStorage.getItem(LS_KEYS.POS));
    const mainDate = new Date();

    const data = dcaBlocks.map((block) => ({
      ...block,
      TM: DCA_TM,
      AD: DCA_AD,
      MA: localStorage.getItem(LS_KEYS.BRUKER)?.toUpperCase(),
      AC: JSON.parse(localStorage.getItem(LS_KEYS.BLOCK_B))?.AC,
      QI: JSON.parse(localStorage.getItem(LS_KEYS.BLOCK_B))?.QI,
      RN: '',
      RC: localStorage.getItem(LS_KEYS.RCSIG)?.toUpperCase(),
      XTG: pos,
      DATI: JSON.stringify(mainDate)
        .substring(0, JSON.stringify(mainDate).length - 9)
        .substring(1)
        .replaceAll(':', ' ')
        .replaceAll('-', ' ')
        .replace('T', ' '),
    }));

    localStorage.setItem(
      LS_KEYS.BLOCK_MSG_STATE,
      JSON.stringify({ isBlock: false, dateTime: Date.now() })
    );

    await apiFetch(API_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });

    // чистим блоки B
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('blockB')) {
        const blockB = JSON.parse(localStorage.getItem(key));
        if (blockB?.isReady) localStorage.removeItem(key);
      }
    });

    navigate('/');
  }, [dcaBlocks, navigate]);

  // ------------------------
  // Effect: build DCA blocks
  // ------------------------
  useEffect(() => {
    const blocksB = Object.keys(localStorage)
      .filter((key) => key.includes('blockB'))
      .map((key) => JSON.parse(localStorage.getItem(key)))
      .filter((b) => b?.isReady);

    if (!blocksB.length) return;

    const sortedBlocks = [...blocksB].sort((a, b) => b.QI - a.QI || b.AC - a.AC);
    const bruker = localStorage.getItem(LS_KEYS.BRUKER);
    const pos = normalizePosition(localStorage.getItem(LS_KEYS.POS));
    const mainDate = new Date();

    const blockA = {
      TM: DCA_TM,
      AD: DCA_AD,
      MA: bruker?.toUpperCase(),
      AC: sortedBlocks[0]?.AC,
      QI: sortedBlocks[0]?.QI,
      RN: '',
      RC: localStorage.getItem(LS_KEYS.RCSIG)?.toUpperCase(),
      XTG: pos,
      DATI: JSON.stringify(mainDate)
        .substring(0, JSON.stringify(mainDate).length - 9)
        .substring(1)
        .replaceAll(':', ' ')
        .replaceAll('-', ' ')
        .replace('T', ' '),
    };

    const unionBlocks = [];
    let dcaWithEqual = {};
    let dcaNotEqual = {};

    sortedBlocks.forEach((b, i) => {
      const cleaned = { ...b };
      delete cleaned.AC;
      delete cleaned.QI;
      delete cleaned.isReady;
      delete cleaned.blockBWithIndex;
      delete cleaned.ZDT;

      if (blockA.QI === b.QI && blockA.AC === b.AC) {
        if (!Object.keys(dcaWithEqual).length) dcaWithEqual = { ...blockA };
        dcaWithEqual[`blockB${i || ''}`] = cleaned;
      } else {
        dcaNotEqual = { ...blockA, AC: b.AC, QI: b.QI, blockB: cleaned };
        unionBlocks.push(dcaNotEqual);
      }
    });

    if (Object.keys(dcaWithEqual).length) unionBlocks.push(dcaWithEqual);
    setDcaBlocks(unionBlocks);
  }, []);

  // ------------------------
  // Render
  // ------------------------
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
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <Grid container spacing={3} direction="row">
            <h1
              style={{
                textAlign: 'center',
                marginTop: '40px',
                width: '100%',
                fontFamily: 'cursive',
                fontSize: '20px',
              }}
            >
              Fangst Melding (DCA)
            </h1>

            <Grid item xs={12}>
              <Button
                style={{ border: 'solid 2px', marginBottom: '20px', width: '100%' }}
                onClick={goToStartPage}
              >
                Gå til start side
              </Button>

              {dcaBlocks.length > 0 &&
                dcaBlocks.map((block, idx) => (
                  <Grid container key={idx} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                    <DcaCard index={block} />
                  </Grid>
                ))}

              {dcaBlocks.length === 0 && <Loop1 index="blockB" onlyBlockA={ONLY_BLOCK_A} />}
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={isDisabled}
                fullWidth
                onClick={handleOnSubmit}
              >
                DCA til insending
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
