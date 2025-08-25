import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, TextField, Container, FormControl, Slider, Tooltip } from '@mui/material'

import Footer from './Footer'
import Header from './Header'

const marks = [
  { value: 0, label: '0 min' },
  { value: 20, label: '20 min' },
  { value: 120, label: '120 min' },
]

const valuetext = (value) => `${value}`

const BORDER_STYLE = { border: '2px solid rgb(222,226,229)', borderRadius: '5px', p: 5 }

export default function FavoriteForm() {
  const navigate = useNavigate()
  const { handleSubmit } = useForm()

  const [navn, setNavn] = useState('')
  const [bredde, setBredde] = useState('')
  const [lengde, setLengde] = useState('')
  const [validBredde, setValidBredde] = useState(false)
  const [validLengde, setValidLengde] = useState(false)

  const validateBredde = (value) => {
    const reg = /([NS])(([0-8][0-9])\.(\d{2}))/ // N/S DD.dd
    setValidBredde(reg.test(value))
    setBredde(value)
  }

  const validateLengde = (value) => {
    const reg = /([EW])((0[0-9]{2}|1[0-7][0-9])\.(\d{2}))/ // E/W DDD.dd
    setValidLengde(reg.test(value))
    setLengde(value)
  }

  const handleSliderChange = (key) => (event, value) => {
    localStorage.setItem(key, value)
  }

  const handleFavoriteAdd = async () => {
    try {
      const response = await fetch('http://192.168.3.1:8000/api/fav/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, bredde, lengde }),
      })
      const data = await response.json()
      navigate('/')
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  const goToStartPage = () => navigate('/')

  return (
    <div className="App">
      <Header />
      <Container maxWidth="xl">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" component="form">
          <Grid container spacing={3}>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button fullWidth sx={{ mb: 2, border: '2px solid' }} onClick={goToStartPage}>
                Gå til start side
              </Button>
            </Grid>

            {/* Fiskestart transittid */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={BORDER_STYLE}>
                <Slider
                  aria-label="Fiskestart transittid"
                  defaultValue={Number(localStorage.getItem('timeInterval') || 0)}
                  step={20}
                  marks={marks}
                  max={120}
                  valueLabelDisplay="on"
                  getAriaValueText={valuetext}
                  onChange={handleSliderChange('timeInterval')}
                />
              </FormControl>
            </Grid>

            {/* Landing transittid */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={BORDER_STYLE}>
                <Slider
                  aria-label="Landing transittid"
                  defaultValue={Number(localStorage.getItem('timeIntervalForPor') || 0)}
                  step={20}
                  marks={marks}
                  max={120}
                  valueLabelDisplay="on"
                  getAriaValueText={valuetext}
                  onChange={handleSliderChange('timeIntervalForPor')}
                />
              </FormControl>
            </Grid>

            {/* Favorite input */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={BORDER_STYLE}>
                <TextField
                  required
                  label="Navn"
                  variant="filled"
                  value={navn}
                  onChange={(e) => setNavn(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Tooltip title="(Bredde N59.00)" arrow open={bredde.length < 2}>
                  <TextField
                    required
                    label="Bredde"
                    variant="filled"
                    value={bredde}
                    error={!validBredde}
                    onChange={(e) => validateBredde(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </Tooltip>
                <Tooltip title="(Lengde E005.00)" arrow open={lengde.length < 2}>
                  <TextField
                    required
                    label="Lengde"
                    variant="filled"
                    value={lengde}
                    error={!validLengde}
                    onChange={(e) => validateLengde(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </Tooltip>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth sx={{ border: '2px solid', color: 'green' }} onClick={handleFavoriteAdd}>
                Lage Favorite
              </Button>
            </Grid>
            
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
