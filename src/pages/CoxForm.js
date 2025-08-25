import React, { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'

import { Box, Button, Grid, TextField, Container, Autocomplete } from '@mui/material'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import Header from './Header';
import Footer from './Footer';

export default function CoxForm() {
  const history = useNavigate()
  const fishCodeHardCode = [
    {
      code: 'AAS',
      name: 'Edelkreps (ferskvann)',
    },
    {
      code: 'ABZ',
      name: 'Småsil',
    },
    {
      code: 'ACH',
      name: 'Røye',
    },
    {
      code: 'ACH',
      name: 'Røye (oppdrett)',
    },
  ];

  const portCodeHardCode = [
    {
      code: 'NOAAA',
      name: 'Å i Lofoten',
    },
    {
      code: 'NOABE',
      name: 'Abelnes',
    },
    {
      code: 'NOABV',
      name: 'Abelvær',
    },
    {
      code: 'NOAAF',
      name: 'Åfjord',
    },
  ];

  const ActivityHardCode = [
    {
      code: 'FIS',
      name: 'Fiske',
    },
    {
      code: 'REL',
      name: 'Fangst relokalisering (overføring av fangst)',
    },
    {
      code: 'SCR',
      name: 'Vitenskapelig forskning',
    },
    {
      code: 'STE',
      name: 'Stimer',
    },
    {
      code: 'TRX',
      name: 'Omlasting',
    },
    {
      code: 'SET',
      name: 'Setting av redskap',
    },
    {
      code: 'ANC',
      name: 'Ankring',
    },
    {
      code: 'DRI',
      name: 'Driving',
    },
  ];

  const [weight, setWeight] = React.useState([])
  const [fishName, setFishName] = React.useState([])
  const [fishCode, setFishCode] = React.useState([])
  const [arOB, setArOB] = React.useState([])
  const [isDisabled, setIsDisabled] = React.useState(false)
  
  const { control, handleSubmit } = useForm({
    reValidateMode: 'onBlur',
  });

  console.count('app rerender');

  const handleOnSubmit = (evt) => {
    setIsDisabled(true)
    const cox = {
      src: '/static/illustrations/icons/Waiting.svg',
    };
    let allStatusesSendingMessages = localStorage.getItem('allStatusesSendingMessages')
    allStatusesSendingMessages=JSON.parse(allStatusesSendingMessages)
    if(allStatusesSendingMessages==null) allStatusesSendingMessages= {}
    allStatusesSendingMessages.cox = cox
    allStatusesSendingMessages.lastMessage ={}
    allStatusesSendingMessages.lastMessage.cox = cox
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
    const delay = ms => new Promise(_ => setTimeout(_, ms));
    
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data : {"req":"DATIPOS"}
      }),
    }

    fetch('http://192.168.3.1:8000/api/stm32/send', requestOptions)
      .then((response) => response.json())
      delay(2000).then(data => {
        let mainPos = localStorage.getItem('pos')
        mainPos = mainPos?.replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-')
        const mainDate = new Date ()
        console.log("🚀 ~ file: DepForm.js:184 ~ delay ~ data", data)
        const bruker = localStorage.getItem('bruker')
        const blockMsgState = { isBlock : false, dateTime: Date.now()}
        localStorage.setItem('blockMsgState', JSON.stringify(blockMsgState))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          TM: 'COX',
          AD: 'NOR',
          RC: localStorage.getItem('RCSIG')?.toUpperCase(),
          MA: bruker?.toUpperCase(),
          RN: "",
          DATI: JSON.stringify(mainDate)
              .substring(0, JSON.stringify(mainDate).length - 9)
              .substring(1)
              .replaceAll(':', ' ')
              .replaceAll('-', ' ')
              .replace('T', ' '),
          LTG: mainPos,
          OB: arOB,
          XTG: mainPos,
        },
        flags: {
          send: true,
          isAsync: false,
          isSync: false,
          isCancel: false,
        },
      }),
    }
    fetch('http://192.168.3.1:8000/api/stm32/send', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        history('/')
      })
    })
  }
  
  useEffect(() => {

      fetch('http://192.168.3.1:8000/api/dep/fish')
      .then((response) => response.json())
      .then((fishCodes) => {
        setFishCode(fishCodes)
        let ob
        fetch('http://192.168.3.1:8000/api/dep/get-ob')
          .then((response) => response.json())
          .then((data) => {
            ob = data
          // eslint-disable-next-line no-plusplus
          for(let i=0; i<ob[0]?.fish.length; i++){
            addFishToOb()
            // eslint-disable-next-line no-loop-func
            const currentIndexObFishCode =fishCodes.find((el) => el.code === ob[0].fish[i].split(' ')[0])
            console.log("🚀 ~ file: Loop4.js:225 ~ .then ~ objFish:", currentIndexObFishCode)
            setFishName(current => [...current, currentIndexObFishCode])
            weight[i]=ob[0].fish[i].split(' ')[1]
            arOB[i]=(`${currentIndexObFishCode.code} ${weight[i]}`)
          }
        })
      
    })
  }, [])
  const handleRemoveFish = (index) => {
    arOB.splice(index, 1)
    weight.splice(index, 1)
    fishName.splice(index, 1)
    removeFishRow(index)
  }
  const goToStartPage = () =>{
    history('/');
  }
  const { fields: ob, append: appendFishRow, remove: removeFishRow, update : updateFishRow } = useFieldArray({ control, name: 'ob' })
  const addFishToOb = () => appendFishRow({})

  
  const handleFishName = (value, index) => {
    console.log("🚀 ~ file: DepForm.js:60 ~ handleFishName ~ value:", value)
    if(value?.code){
      fishName[index]=value
      console.log("🚀 ~ file: DepForm.js:72 ~ handleFishName ~ fishName:", fishName)
      setFishName(fishName)
      arOB[index]=(`${value.code} ${weight[index]}`)
      console.log("🚀 ~ file: DepForm.js:60 ~ handleFishName ~ arOB", arOB)
    }
  }
  const handleWeight = (e, index) => {
    console.log("🚀 ~ file: DepForm.js:67 ~ handleWeight ~ index", index)
    console.log("🚀 ~ file: DepForm.js:67 ~ handleWeight ~ weight[index]", weight[index])
    updateFishRow()

    // eslint-disable-next-line radix
    weight[index]=parseInt(e.target.value)
    if(fishName[index]?.code){
      arOB[index]=(`${fishName[index].code} ${weight[index]}`)
    }else{
      arOB[index]=(`${fishName[index]} ${weight[index]}`)
    }
    console.log("🚀 ~ file: DepForm.js:64 ~ handleWeight ~ arOB", arOB)
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
          <h1 style={{ textAlign: 'center', marginTop: '40px', width: '100%', fontFamily: 'cursive', fontSize: '20px' }}>AVSLUTING AV FISKE I SONE (COX)</h1>
          
          <Grid item xs={12} sm={{ mt: 2 }}>
          <Button xs={2} style={{ border: 'solid 2px', marginBottom: '20px', width: '100%' }} onClick={goToStartPage}>
            Gå til start side
              </Button>
          </Grid>
          <Grid item xs={12}>
          <div fullWidth  style={{marginTop: '20px'}}>Kvantum ombord</div>
              {ob.map((field, index) => (
                <Grid container key={field.id} spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={7}>
                    <Controller
                      control={control}
                      // must use . for the object key!!!
                      name={`arOB.${index}.fishcode`}
                      render={({ field }) => (
                        <Autocomplete
                          value={fishName[index]}
                          onChange={(e, value) => handleFishName(value, index, e)}
                          id="Kvantum ombord"
                          options={fishCode}
                          onInputChange={(event, newInputValue) => {
                            console.log("🚀 ~ file: DepForm.js:523 ~ DepForm ~ event:", event?.target)
                            console.log("🚀 ~ file: DepForm.js:524 ~ DepForm ~ newInputValue:", newInputValue)
                            if(fishName[index] && newInputValue){
                              console.log("🚀 ~ file: DepForm.js:526 ~ DepForm ~ newInputValue:", newInputValue)
                              console.log("🚀 ~ file: DepForm.js:528 ~ DepForm ~ fishName[index]:", fishName[index])
                              const onbordFishCodes =fishCode.find((el) => el.name === newInputValue)
                              console.log("🚀 ~ file: DepForm.js:530 ~ DepForm ~ onbordFishCodes:", onbordFishCodes)
                              if(onbordFishCodes?.name)
                              { 
                                fishName[index] = onbordFishCodes
                                arOB[index]=(`${fishName[index].code} ${weight[index]}`)
                                setFishName(fishName)
                                updateFishRow()
                              }
                              
                            }
                          }}
                          getOptionLabel={(option) => option.name}
                          renderInput={(field) =>                 
                          <TextField
                            required {...field} label="Målart" />}
                          />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Controller
                      control={control}
                      // must use . for the object key!!!
                      name={`ob.${index}.fishweight`}
                      render={({ field }) => (
                        <TextField
                          required
                          {...field}
                          value={weight[index]}
                          autoFocus
                          onChange={(e) => handleWeight(e, index)}
                          id="standard-number"
                          label="Kg"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button color="error" variant="text" onClick={() => handleRemoveFish(index)}>
                      <DeleteForeverIcon fontSize='large'/>
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Button variant="contained" style={{ marginTop: '5px' }} onClick={addFishToOb}>
              Legg til Kvantum ombord
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" disabled={isDisabled} fullWidth style={{ border: 'solid 2px', color: 'green' }}>
              Send COX
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
