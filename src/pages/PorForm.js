import React, { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, TextField, Container, Autocomplete, FormControl, Stack } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import dayjs from 'dayjs'
import Header from './Header'
import Footer from './Footer'


export default function PorForm() {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm({ reValidateMode: 'onBlur' })

  const [port, setPort] = useState('')
  const [ls, setLs] = useState('')
  const [valid, setValid] = useState(false)
  const [dhl, setDhl] = useState(dayjs().startOf('date'))
  const [pdt, setPdt] = useState(dayjs().startOf('date'))
  const [isDisabled, setIsDisabled] = useState(false)

  const [fishCode, setFishCode] = useState([])
  const [portCode, setPortCode] = useState([])
  const [activityCode, setActivityCode] = useState([])

  const [arOB, setArOB] = useState([])
  const [arKG, setArKG] = useState([])

  const [weight, setWeight] = useState([])
  const [weightKg, setWeightKg] = useState([])
  const [fishName, setFishName] = useState([])
  const [fishNameKg, setFishNameKg] = useState([])

  const { fields: obFields, append: appendOb, remove: removeOb, update: updateOb } = useFieldArray({ control, name: 'ob' })
  const { fields: kgFields, append: appendKg, remove: removeKg, update: updateKg } = useFieldArray({ control, name: 'kg' })

  const goToStartPage = () => navigate('/')

  const handleValidation = (e) => {
    const reg = /[a-zA-Z0-9]{1,60}/
    setValid(reg.test(e.target.value))
    setLs(e.target.value)
  }

  const handleFishNameChange = (value, index) => {
    if (!value?.code) return
    const updatedFish = [...fishName]
    updatedFish[index] = value
    setFishName(updatedFish)

    const updatedArOB = [...arOB]
    updatedArOB[index] = `${value.code} ${weight[index] || 0}`
    setArOB(updatedArOB)
  }

  const handleWeightChange = (e, index) => {
    const val = parseInt(e.target.value, 10) || 0
    const updatedWeight = [...weight]
    updatedWeight[index] = val
    setWeight(updatedWeight)

    const updatedArOB = [...arOB]
    updatedArOB[index] = fishName[index]?.code ? `${fishName[index].code} ${val}` : `${fishName[index]} ${val}`
    setArOB(updatedArOB)
  }

  const handleFishNameKgChange = (value, index) => {
    if (!value?.code) return
    const updatedFishKg = [...fishNameKg]
    updatedFishKg[index] = value
    setFishNameKg(updatedFishKg)

    const updatedArKG = [...arKG]
    updatedArKG[index] = `${value.code} ${weightKg[index] || 0}`
    setArKG(updatedArKG)
  }

  const handleWeightKgChange = (e, index) => {
    const val = parseInt(e.target.value, 10) || 0
    const updatedWeightKg = [...weightKg]
    updatedWeightKg[index] = val
    setWeightKg(updatedWeightKg)

    const updatedArKG = [...arKG]
    updatedArKG[index] = fishNameKg[index]?.code ? `${fishNameKg[index].code} ${val}` : `${fishNameKg[index]} ${val}`
    setArKG(updatedArKG)
  }

  const handleRemoveFish = (index) => {
    removeOb(index)
    const updatedArOB = [...arOB]
    updatedArOB.splice(index, 1)
    setArOB(updatedArOB)

    const updatedWeight = [...weight]
    updatedWeight.splice(index, 1)
    setWeight(updatedWeight)

    const updatedFish = [...fishName]
    updatedFish.splice(index, 1)
    setFishName(updatedFish)
  }

  const handleRemoveFishKg = (index) => {
    removeKg(index)
    const updatedArKG = [...arKG]
    updatedArKG.splice(index, 1)
    setArKG(updatedArKG)

    const updatedWeightKg = [...weightKg]
    updatedWeightKg.splice(index, 1)
    setWeightKg(updatedWeightKg)

    const updatedFishKg = [...fishNameKg]
    updatedFishKg.splice(index, 1)
    setFishNameKg(updatedFishKg)
  }

  const copyObToKg = async () => {
    try {
      const res = await fetch('http://192.168.3.1:8000/api/dep/fish')
      const fishCodes = await res.json()
      setFishCode(fishCodes)

      arOB.forEach((item, i) => {
        appendKg({ fishcode: '', fishweight: '' })
        const [code, w] = item.split(' ')
        const fishObj = fishCodes.find((f) => f.code === code)
        setFishNameKg((prev) => [...prev, fishObj])
        setWeightKg((prev) => [...prev, parseInt(w, 10) || 0])
        setArKG((prev) => [...prev, `${code} ${w}`])
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    // Fetch ports, fish, activities
    const fetchData = async () => {
      try {
        const portsRes = await fetch('http://192.168.3.1:8000/api/dep/ports')
        const portsData = await portsRes.json()
        setPortCode(portsData)

        const fishRes = await fetch('http://192.168.3.1:8000/api/dep/fish')
        const fishData = await fishRes.json()
        setFishCode(fishData)

        const actRes = await fetch('http://192.168.3.1:8000/api/dep/activity')
        const actData = await actRes.json()
        setActivityCode(actData)

        const porRes = await fetch('http://192.168.3.1:8000/api/por/get-por-auto')
        const porData = await porRes.json()
        const currentPort = portsData.find((el) => el.code === porData[0]?.PO)
        setPort(currentPort)
        setLs(porData[0]?.LS)
        setValid(true)

        const obRes = await fetch('http://192.168.3.1:8000/api/dep/get-ob')
        const fishesOnBoard = await obRes.json()
        fishesOnBoard[0]?.fish.forEach((f, i) => {
          appendOb({ fishcode: '', fishweight: '' })
          const code = f.split(' ')[0]
          const w = parseInt(f.split(' ')[1], 10) || 0
          const fishObj = fishData.find((fish) => fish.code === code)
          setFishName((prev) => [...prev, fishObj])
          setWeight((prev) => [...prev, w])
          setArOB((prev) => [...prev, `${code} ${w}`])
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [appendOb])

  const handleOnSubmit = async () => {
    setIsDisabled(true)
    try {
      const mainDate = new Date()
      const mainPos = (localStorage.getItem('pos') || '').replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-')
      const bruker = localStorage.getItem('bruker')

      const payload = {
        TM: 'POR',
        AD: 'NOR',
        RC: localStorage.getItem('RCSIG')?.toUpperCase(),
        MA: bruker?.toUpperCase(),
        RN: '',
        DATI: mainDate.toISOString().replace('T', ' ').split('.')[0],
        PO: port.code,
        LS: ls,
        DHL: dhl.toISOString().replace('T', ' ').split('.')[0],
        PDT: pdt.toISOString().replace('T', ' ').split('.')[0],
        KG: arKG,
        OB: arOB,
        XTG: mainPos,
      }

      await fetch('http://192.168.3.1:8000/api/stm32/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      })
      navigate('/')
    } catch (err) {
      console.error(err)
      setIsDisabled(false)
    }
  }

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
            <h1 style={{ textAlign: 'center', marginTop: '40px', width: '100%', fontFamily: 'cursive', fontSize: '20px' }}>Havneanløp (POR)</h1>

            <Grid item xs={12}>
              <Button fullWidth style={{ border: 'solid 2px', marginBottom: '20px' }} onClick={goToStartPage}>
                Gå til start side
              </Button>

              <FormControl fullWidth>
                <Autocomplete
                  value={port}
                  onChange={(e, value) => setPort(value)}
                  options={portCode}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField required {...params} label="Anløps Havn" />}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Landingsanlegg"
                variant="outlined"
                value={ls}
                error={!valid}
                onChange={handleValidation}
              />
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DateTimePicker
                    label="Landing Dato og Tid"
                    value={dhl}
                    onChange={setDhl}
                    renderInput={(params) => <TextField required {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <DateTimePicker
                    label="Havneanløp Dato og Tid"
                    value={pdt}
                    onChange={setPdt}
                    renderInput={(params) => <TextField required {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <div>Kvantum ombord</div>
              {obFields.map((field, index) => (
                <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      name={`ob.${index}.fishcode`}
                      render={() => (
                        <Autocomplete
                          value={fishName[index]}
                          onChange={(e, value) => handleFishNameChange(value, index)}
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
                          type="number"
                          value={weight[index] || ''}
                          onChange={(e) => handleWeightChange(e, index)}
                          label="Kg"
                          InputLabelProps={{ shrink: true }}
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
              <Button variant="contained" sx={{ mt: 1 }} onClick={() => appendOb({ fishcode: '', fishweight: '' })}>
                Legg til Kvantum ombord
              </Button>
            </Grid>

            <Grid item xs={12}>
              <div>Kvantum til levering</div>
              {kgFields.map((field, index) => (
                <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      name={`kg.${index}.fishcode`}
                      render={() => (
                        <Autocomplete
                          value={fishNameKg[index]}
                          onChange={(e, value) => handleFishNameKgChange(value, index)}
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
                      name={`kg.${index}.fishweight`}
                      render={() => (
                        <TextField
                          required
                          type="number"
                          value={weightKg[index] || ''}
                          onChange={(e) => handleWeightKgChange(e, index)}
                          label="Kg"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button color="error" variant="text" onClick={() => handleRemoveFishKg(index)}>
                      <DeleteForeverIcon fontSize="large" />
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" sx={{ mt: 1 }} onClick={copyObToKg}>
                Legg til Kvantum til levering
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={isDisabled} sx={{ border: 'solid 2px', color: 'green' }}>
                Send POR
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
