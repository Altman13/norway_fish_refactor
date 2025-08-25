import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Box, Button, Grid, Container } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

import Typography from '@mui/material/Typography'

import Loop1 from './Loop1'
import Loop4 from './Loop4'
import Loop3 from './Loop3'
import Header from './Header'
import Footer from './Footer'

export default function DcaEditForm() {
  const location = useLocation()
  const history = useNavigate()
  const goToStartPage = () =>{
    // eslint-disable-next-line no-lone-blocks
    {dcaBlocks.map((key) => (
      localStorage.removeItem(key)
    ))}
    history('/');
  }
  const [dcaBlocks, setDcaBlocks] = React.useState([])
  const [MV, setMV] = React.useState(undefined)
  const [isDisabled, setIsDisabled] = React.useState(false)
  console.count('app rerender')
  const handleOnSubmit = () => {
    setIsDisabled(true)
    let data ={}  
    let mainPos = localStorage.getItem('pos')
    mainPos = mainPos?.replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-')
    const mainDate = new Date ()
    const bruker = localStorage.getItem('bruker')
    localStorage.setItem('blockMsgState', true)
    const localStorageAllKeys = Object.keys(localStorage)
    
    const blockA = {
      TM: 'DCA',
      AD: 'NOR',
      MA: bruker.toUpperCase(),
      AC: location.state?.msg?.AC,
      QI: location.state?.msg?.QI,
      RN: location.state?.msg?.RN,
      RE: 511,
      MV ,
      RC: localStorage.getItem('RCSIG')?.toUpperCase(),
      XTG: mainPos,
      DATI: JSON.stringify(mainDate)
              .substring(0, JSON.stringify(mainDate).length - 9)
              .substring(1)
              .replaceAll(':', ' ')
              .replaceAll('-', ' ')
              .replace('T', ' '),
    }
    const dcaWithEqualAcQi = {}
    dcaBlocks.forEach((element) => {
      if (element.includes('blockB')) {
        const el = JSON.parse(localStorage.getItem(element))
        delete el.isReady
        dcaWithEqualAcQi[element] = { ...el} 
        data = {...blockA, ...dcaWithEqualAcQi}
      }
    })
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data
      }),
    }
    const dca = {
      src: '/static/illustrations/icons/Waiting.svg',
    };
    let allStatusesSendingMessages = localStorage.getItem('allStatusesSendingMessages')
    allStatusesSendingMessages=JSON.parse(allStatusesSendingMessages)
    if(allStatusesSendingMessages==null) allStatusesSendingMessages= {}
    allStatusesSendingMessages.dca = dca
    allStatusesSendingMessages.lastMessage = {}
    allStatusesSendingMessages.lastMessage.dca = dca
        const rOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...allStatusesSendingMessages
      }),
    }
    fetch('http://192.168.3.1:8000/api/dep/allstatuses', rOptions)
      .then((response) => response.json())
        .then(data => {
          console.log("🚀 ~ file: AudForm.js:112 ~ handleOnSubmit ~ data:", data)
        })

    fetch('http://192.168.3.1:8000/api/stm32/send', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        dcaBlocks.forEach(el => {
          localStorage.removeItem(el)
        })
        history('/')
      })
  }

  const { control, handleSubmit } = useForm({
    reValidateMode: 'onBlur',
  })
  // eslint-disable-next-line no-extend-native, func-names
  String.prototype.replaceAt = function(index, replacement) {
    // eslint-disable-next-line no-undef, react/no-this-in-sfc
    return this.substring(0, index) + replacement + this.substring(index + replacement.length)
  }
  const handleSetMV = (mv) => {
    const MV = mv === undefined ? 2 : mv      
    setMV(MV)
  }

  useEffect(() => {
    const blocksB = []
    if(location?.state?.msg){
      const localStorageAllKeys = Object.keys(location.state?.msg)
      console.log("🚀 ~ file: DcaEditForm.js:142 ~ useEffect ~ localStorageAllKeys", localStorageAllKeys)
      localStorageAllKeys.forEach((elBlockB) => {
        if (elBlockB.includes('blockB')) {
          blocksB.push(elBlockB)
          location.state.msg[elBlockB].isReady=true
          localStorage.setItem(elBlockB, JSON.stringify(location.state?.msg[elBlockB]))
        }
      })
      console.log("🚀 ~ file: DcaEditForm.js:140 ~ useEffect ~ location.state", location.state?.msg)
    }
    setDcaBlocks(blocksB)
    handleSetMV(location.state?.msg?.MV)
  
  }, [])

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
          <div style={{height: '50px', width: '100%', textAlign: 'center', lineHeight: '100px', fontWeight:'bold'}}>Korrigering DCA meldinger</div>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button style={{ border: 'solid 2px', marginBottom: '20px', width: '100%' }} onClick={goToStartPage}>
              Gå til start side
            </Button>
          </Grid>
            {dcaBlocks.map((key, index) => (
                <Grid item key={index} xs={12}>
                  <Typography>{key}</Typography>
                  <Loop4 blockBIndex = {key} />
                  <Loop3 blockBIndex = {key}/>
                  <Loop1 blockBIndex = {key} dcaCorrection='true' />
                </Grid>
              ))}
            <Grid item xs={12}>
              <Button variant="contained" disabled = { isDisabled } fullWidth onClick={() => handleOnSubmit()}>
                  DCA til corrigering
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
