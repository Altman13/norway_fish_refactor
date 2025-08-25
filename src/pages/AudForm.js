import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import FormControl from '@mui/material/FormControl'
import { Box, Button, Grid, TextField, Container } from '@mui/material'

import Footer from './Footer'
import Header from './Header'

// Helpers
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const normalizePosition = (pos) =>
  pos
    ?.replaceAll('N', '+')
    .replaceAll('E', '+')
    .replaceAll('W', '-')
    .replaceAll('S', '-')

const formatDate = (date) =>
  JSON.stringify(date)
    .substring(0, JSON.stringify(date).length - 9)
    .substring(1)
    .replaceAll(':', ' ')
    .replaceAll('-', ' ')
    .replace('T', ' ')

export default function AudForm() {
  const navigate = useNavigate()
  const [ms, setMs] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)

  const { handleSubmit } = useForm({ reValidateMode: 'onBlur' })

  const goToStartPage = () => navigate('/')

  const handleOnSubmit = async () => {
    setIsDisabled(true)

    // --- Step 1: update statuses ---
    const aud = { src: '/static/illustrations/icons/Waiting.svg' }
    const allStatuses = JSON.parse(localStorage.getItem('allStatusesSendingMessages')) || {}
    allStatuses.aud = aud
    allStatuses.lastMessage = { aud }

    await fetch('http://192.168.3.1:8000/api/dep/allstatuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allStatuses),
    })

    // --- Step 2: request DATIPOS ---
    await fetch('http://192.168.3.1:8000/api/stm32/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { req: 'DATIPOS' } }),
    })

    // --- Step 3: wait and send final AUD message ---
    await delay(2000)

    const bruker = localStorage.getItem('bruker') || ''
    const mainPos = normalizePosition(localStorage.getItem('pos'))
    const mainDate = new Date()

    localStorage.setItem('blockMsgState', JSON.stringify({ isBlock: false, dateTime: Date.now() }))

    await fetch('http://192.168.3.1:8000/api/stm32/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          TM: 'AUD',
          AD: 'NOR',
          RC: localStorage.getItem('RCSIG')?.toUpperCase(),
          MA: bruker.toUpperCase(),
          RN: '',
          DATI: formatDate(mainDate),
          LTG: mainPos,
          MS: ms,
        },
      }),
    })

    navigate('/')
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
            <Grid item xs={12}>
              <h1 style={{ textAlign: 'center', marginTop: '40px', width: '100%', fontFamily: 'cursive', fontSize: '20px' }}>
                TEST MELDING (AUD)
              </h1>
              <Button style={{ border: 'solid 2px', marginBottom: '20px', width: '100%' }} onClick={goToStartPage}>
                Gå til start side
              </Button>
              <FormControl
                fullWidth
                style={{ border: '2px solid rgb(222,226,229)', borderRadius: '5px' }}
                sx={{ p: 5 }}
              >
                <TextField
                  required
                  id="filled-textarea"
                  label="Fri tekst"
                  placeholder="Fri tekst"
                  multiline
                  variant="filled"
                  onChange={(e) => setMs(e.target.value)}
                  value={ms}
                  sx={{ mt: 2 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={isDisabled} style={{ border: 'solid 2px', color: 'green' }}>
                SEND AUD
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
