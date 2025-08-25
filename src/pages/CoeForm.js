import React, { useEffect, useState, forwardRef } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { Box, Button, Grid, TextField, Select, MenuItem, Container, Autocomplete, Stack, Tooltip } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import Header from './Header'
import Footer from './Footer'

// Helpers
const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const normalizePosition = (pos) =>
  pos?.replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-')
const formatDate = (date) =>
  JSON.stringify(date)
    .substring(0, JSON.stringify(date).length - 9)
    .substring(1)
    .replaceAll(':', ' ')
    .replaceAll('-', ' ')
    .replace('T', ' ')

const Alert = forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />)

export default function CoeForm() {
  const history = useNavigate()
  const location = useLocation()

  const [MV, setMV] = useState(undefined)
  const [RE, setRE] = useState(undefined)
  const [fishCode, setFishCode] = useState([])
  const [activityCode, setActivityCode] = useState([])
  const [weight, setWeight] = useState([])
  const [fishName, setFishName] = useState([])
  const [arOB, setArOB] = useState([])

  const [malart, setMalart] = useState('')
  const [pdt, setPdt] = useState('')
  const [lengde, setLengde] = useState('')
  const [bredde, setBredde] = useState('')
  const [favorite, setFavorite] = useState([])
  const [validLengde, setValidLengde] = useState('')
  const [validBredde, setValidBredde] = useState('')
  const [render, setRender] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const [fiskerstartPosisjon, setFiskerstartPosisjon] = useState('')
  const [open, setOpen] = useState(false)

  const { control, handleSubmit } = useForm({ reValidateMode: 'onBlur' })
  const { fields: ob, append: appendFishRow, remove: removeFishRow, update: updateFishRow } = useFieldArray({ control, name: 'ob' })

  const handleFishName = (value, index) => {
    if (!value?.code) return
    const updatedNames = [...fishName]
    updatedNames[index] = value
    setFishName(updatedNames)

    const updatedArOB = [...arOB]
    updatedArOB[index] = `${value.code} ${weight[index]}`
    setArOB(updatedArOB)
  }

  const handleWeight = (e, index) => {
    const newWeight = parseInt(e.target.value, 10)
    const updatedWeights = [...weight]
    updatedWeights[index] = newWeight
    setWeight(updatedWeights)

    const updatedArOB = [...arOB]
    updatedArOB[index] = `${fishName[index]?.code || fishName[index]} ${newWeight}`
    setArOB(updatedArOB)
    updateFishRow()
  }

  const handleSetFiskerstartPosisjon = (name) => {
    setFiskerstartPosisjon(name)
    const fav = favorite.find((el) => el.navn === name)
    if (!fav) return

    const regBredde = /([NS])((\d{2})\.(\d{2}))/
    const regLengde = /([EW])((\d{3})\.(\d{2}))/

    if (fav.bredde.length <= 6) {
      setBredde(fav.bredde)
      setValidBredde(regBredde.test(fav.bredde))
    }
    if (fav.lengde.length <= 7) {
      setLengde(fav.lengde)
      setValidLengde(regLengde.test(fav.lengde))
    }
  }

  const handleOnSubmit = async () => {
    try {
      setIsDisabled(true)
      const coe = { src: '/static/illustrations/icons/Waiting.svg' }
      const allStatuses = JSON.parse(localStorage.getItem('allStatusesSendingMessages')) || {}
      allStatuses.coe = coe
      allStatuses.lastMessage = { coe }

      await fetch('http://192.168.3.1:8000/api/dep/allstatuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allStatuses),
      })

      await fetch('http://192.168.3.1:8000/api/stm32/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { req: 'DATIPOS' } }),
      })

      await delay(2000)
      const mainPos = normalizePosition(localStorage.getItem('pos'))
      const mainDate = new Date()
      const bruker = localStorage.getItem('bruker') || ''

      localStorage.setItem('blockMsgState', JSON.stringify({ isBlock: false, dateTime: Date.now() }))

      await fetch('http://192.168.3.1:8000/api/stm32/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            TM: 'COE',
            AD: 'NOR',
            RC: localStorage.getItem('RCSIG')?.toUpperCase(),
            MA: bruker.toUpperCase(),
            RN: location.state?.msg.RN || '',
            RE,
            MV,
            DATI: formatDate(mainDate),
            LAO: `${bredde} ${lengde}`,
            DS: malart.code,
            OB: arOB.filter((el) => el !== ' '),
            PDT:
              location.state?.msg.PDT ||
              formatDate(pdt),
            XTG: mainPos,
          },
          flags: { send: true, isAsync: false, isSync: false, isCancel: false },
        }),
      })

      history('/')
    } catch (err) {
      console.error('Submit error:', err)
      setIsDisabled(false)
      setOpen(true)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ports, activities, favs, fishCodes, ob] = await Promise.all([
          fetch('http://192.168.3.1:8000/api/dep/ports').then((res) => res.json()),
          fetch('http://192.168.3.1:8000/api/dep/activity').then((res) => res.json()),
          fetch('http://192.168.3.1:8000/api/fav').then((res) => res.json()),
          fetch('http://192.168.3.1:8000/api/dep/fish').then((res) => res.json()),
          fetch('http://192.168.3.1:8000/api/dep/get-ob').then((res) => res.json()),
        ])

        setActivityCode(activities)
        setFavorite(favs)
        setFishCode(fishCodes)

        if (ob[0]?.fish) {
          ob[0].fish.forEach((f) => {
            appendFishRow({})
            const code = f.split(' ')[0]
            const w = f.split(' ')[1]
            const fishObj = fishCodes.find((el) => el.code === code)
            setFishName((curr) => [...curr, fishObj])
            setWeight((curr) => [...curr, w])
            setArOB((curr) => [...curr, `${fishObj.code} ${w}`])
          })
        }

        setBredde(location.state?.msg.LAO.split(' ')[0])
        setLengde(location.state?.msg.LAO.split(' ')[1])
        setMalart(location.state?.msg.DS)

        if (location.state?.msg.MV) {
          setMV(location.state.msg.MV)
          setRE(511)
        }

        if (location.state?.msg.PDT) {
          setRender(false)
          setPdt(location.state.msg.PDT)
        } else {
          const d1 = new Date()
          const d2 = new Date(d1)
          let timeInterval = parseInt(localStorage.getItem('timeInterval'), 10)
          if (Number.isNaN(timeInterval)) timeInterval = 0
          d2.setMinutes(d1.getMinutes() + 5 + timeInterval)
          setPdt(d2)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }
    fetchData()
  }, [location.state])

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
          <Grid container spacing={3}>
            <h1 style={{ textAlign: 'center', marginTop: '40px', width: '100%', fontFamily: 'cursive', fontSize: '20px' }}>FISKESTART I SONE (COE)</h1>

            <Stack spacing={2} sx={{ width: '100%' }}>
              <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert severity="warning" sx={{ width: '100%' }}>
                  User interface was blocked
                </Alert>
              </Snackbar>
            </Stack>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button fullWidth style={{ border: 'solid 2px', marginBottom: '20px' }} onClick={() => history('/')}>
                Gå til start side
              </Button>
            </Grid>

            {render && (
              <>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <div style={{ marginTop: '20px' }}>Fiskestart Posisjon i Sone</div>
                  <FormControl fullWidth style={{ border: '2px solid rgb(222,226,229)', borderRadius: '5px' }} sx={{ p: 5 }}>
                    <InputLabel id="fiskerstart-posisjon-label" sx={{ m: 5 }}>
                      Hente fra Favoriter
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="fiskerstart-posisjon-label"
                      value={fiskerstartPosisjon}
                      onChange={(e) => handleSetFiskerstartPosisjon(e.target.value)}
                    >
                      {favorite.map((d) => (
                        <MenuItem key={d.id} value={d.navn}>
                          {d.navn}
                        </MenuItem>
                      ))}
                    </Select>
                    <Tooltip title="(Bredde N59.00)" arrow>
                      <TextField
                        required
                        label="Bredde"
                        variant="filled"
                        value={bredde}
                        error={!validBredde}
                        sx={{ mt: 2 }}
                        onChange={(e) => setBredde(e.target.value)}
                      />
                    </Tooltip>
                    <Tooltip title="(Lengde E005.00)" arrow>
                      <TextField
                        required
                        label="Lengde"
                        variant="filled"
                        value={lengde}
                        error={!validLengde}
                        sx={{ mt: 2 }}
                        onChange={(e) => setLengde(e.target.value)}
                      />
                    </Tooltip>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <Autocomplete
                      value={malart}
                      onChange={(e, value) => setMalart(value)}
                      options={fishCode}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => <TextField required {...params} label="Målart" />}
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <div>Kvantum ombord</div>
              {ob.map((field, index) => (
                <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      name={`arOB.${index}.fishcode`}
                      render={() => (
                        <Autocomplete
                          value={fishName[index]}
                          onChange={(e, value) => handleFishName(value, index)}
                          options={fishCode}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField required {...params} label="Målart" />}
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
                          value={weight[index]}
                          onChange={(e) => handleWeight(e, index)}
                          label="Kg"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button color="error" variant="text" onClick={() => removeFishRow(index)}>
                      <DeleteForeverIcon fontSize="large" />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" style={{ marginTop: '5px' }} onClick={() => appendFishRow({})}>
                Legg til Kvantum ombord
              </Button>
            </Grid>

            {render && (
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={3}>
                    <DateTimePicker
                      label="Fiskestart i Sone Dato og Tid"
                      ampm={false}
                      value={pdt}
                      onChange={setPdt}
                      renderInput={(params) => <TextField required {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" disabled={isDisabled} fullWidth style={{ border: 'solid 2px', color: 'green' }}>
                Send COE
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
