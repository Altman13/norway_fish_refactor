import React, { useEffect, useState, useCallback } from 'react'
import {
  Grid,
  Container,
  TextField,
  FormControl,
  Button,
  Avatar,
  Box,
  Zoom,
  Fab,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { KeyboardArrowUp } from '@mui/icons-material'
import useScrollTrigger from '@mui/material/useScrollTrigger'

// --- helpers ---
const API_URL = 'http://192.168.3.1:8000/api/dep'

const fetchJson = (endpoint) => fetch(`${API_URL}/${endpoint}`).then((res) => res.json())

function normalizeArchive(data) {
  return data.map((row) => {
    const copy = { ...row }

    // обрабатываем даты и позиции
    if (copy.DATI) {
      copy.DA = copy.DATI.substring(0, 10).replaceAll(' ', '')
      copy.TI = copy.DATI.substring(11, 16).replaceAll(' ', '')
    }
    if (copy.XTG) {
      const [XT, XG] = copy.XTG.split(' ')
      copy.XT = XT
      copy.XG = XG
    }

    // обработка RET
    if (Array.isArray(copy.rets)) {
      copy.rets = copy.rets.map((r) => {
        const ret = { ...r.RET }
        ret.DA = ret.DATI?.substring(0, 10).replaceAll(' ', '')
        ret.TI = ret.DATI?.substring(11, 16).replaceAll(' ', '')
        delete ret.DATI
        return { RET: ret }
      })
    }

    delete copy._id
    delete copy.createdAt
    delete copy.updatedAt
    delete copy.DATI
    delete copy.XTG
    delete copy.LTG

    return copy
  })
}

function ScrollToTopFab() {
  const trigger = useScrollTrigger({ threshold: 100 })
  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <Zoom in={trigger}>
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1 }}>
        <Fab onClick={scrollToTop} color="primary" size="small">
          <KeyboardArrowUp fontSize="medium" />
        </Fab>
      </Box>
    </Zoom>
  )
}

function ArchiveCard({ msg, refs, original }) {
  const { fishCode, activityCode, kvoteCode, zoneCode, geCode, gsCode, gpCode, portCode } = refs

  const findName = (list, code) => list.find((el) => el.code === code)?.name

  return (
    <>
      <div style={{ border: '2px solid #dee2e5', borderRadius: '5px', padding: '20px' }}>
        <Typography align="center">{msg.TM}</Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          {msg.PO && <div>Avgangshavn: {findName(portCode, msg.PO)}</div>}
          {msg.OB && (
            <>
              <div>Kvantum om bord:</div>
              {msg.OB.map((fish) => (
                <div key={fish}>
                  {findName(fishCode, fish.split(' ')[0])} {fish.split(' ')[1]}
                </div>
              ))}
            </>
          )}
          {msg.AC && <div>Fiskeriaktivitet: {findName(activityCode, msg.AC)}</div>}
          {msg.DA && <div>Sendt: {msg.DA} {msg.TI}</div>}
        </FormControl>
      </div>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>NAF melding</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            readOnly
            style={{ backgroundColor: 'honeydew' }}
            label={msg.TM}
            value={`//SR//${JSON.stringify(msg)
              .replaceAll(':', '/')
              .replaceAll(',', '//')
              .replaceAll('"', '')
              .replaceAll(/[{}[\]]/g, '')}//ER//`}
          />
        </AccordionDetails>
      </Accordion>

      {original.rets?.map((element, idx) => (
        <React.Fragment key={idx}>
          <TextField
            fullWidth
            readOnly
            style={{ marginTop: '10px', backgroundColor: 'aliceblue' }}
            label={`${original.TM} ${element.RET.RN} RET`}
            value={`RN: ${element.RET.RN} DA: ${element.RET.DA} TI: ${element.RET.TI} RS: ${element.RET.RS}`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  {element.RET.RS === 'ACK' && <Avatar src="/static/illustrations/icons/OK.svg" alt="ack" />}
                  {element.RET.RS === 'NAK' && <Avatar src="/static/illustrations/icons/NG.svg" alt="nak" />}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            readOnly
            style={{ marginTop: '10px', marginBottom: '20px', backgroundColor: 'honeydew' }}
            label="RET NAF"
            multiline
            value={`//SR//FR/NOR//${JSON.stringify(element.RET)
              .replaceAll(':', '/')
              .replaceAll(',', '//')
              .replaceAll('"', '')
              .replaceAll(/[{}[\]]/g, '')}//ER//`}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default function Archive() {
  const navigate = useNavigate()

  const [archive, setArchive] = useState([])
  const [clearArchive, setClearArchive] = useState([])

  const [refs, setRefs] = useState({
    fishCode: [],
    activityCode: [],
    kvoteCode: [],
    zoneCode: [],
    geCode: [],
    gsCode: [],
    gpCode: [],
    portCode: [{ code: 'NOAAA', name: 'Å i Lofoten' }],
  })

  useEffect(() => {
    Promise.all([
      fetchJson('fish'),
      fetchJson('activity'),
      fetchJson('qi'),
      fetchJson('zo'),
      fetchJson('ge'),
      fetchJson('gs'),
      fetchJson('gp'),
      fetch('http://192.168.3.1:8000/api/archive').then((r) => r.json()),
    ]).then(([fish, activity, kvote, zone, ge, gs, gp, archiveData]) => {
      setRefs((prev) => ({ ...prev, fishCode: fish, activityCode: activity, kvoteCode: kvote, zoneCode: zone, geCode: ge, gsCode: gs, gpCode: gp }))
      setArchive(archiveData)
      setClearArchive(normalizeArchive(archiveData))
    })
  }, [])

  return (
    <Container maxWidth="xl">
      <h1 style={{ textAlign: 'center', marginTop: 40, fontFamily: 'cursive', fontSize: 20 }}>ARCHIVE</h1>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button fullWidth sx={{ border: '2px solid', mb: 2 }} onClick={() => navigate('/')}>Gå til start side</Button>
          <ScrollToTopFab />

          <FormControl fullWidth>
            {clearArchive.map((msg, idx) => (
              <ArchiveCard key={idx} msg={msg} refs={refs} original={archive[idx]} />
            ))}
          </FormControl>
        </Grid>
      </Grid>
    </Container>
  )
}
