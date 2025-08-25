import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'

export default function FisOperationCard({ index }) {
  const navigate = useNavigate()
  const [activity, setActivity] = useState('')
  const [bdt, setBdt] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('')

  useEffect(() => {
    const currentBlockB = JSON.parse(localStorage.getItem(index))
    if (!currentBlockB) return

    setActivity(currentBlockB.AC || '')
    setBdt(currentBlockB.BDT || '')

    if (currentBlockB.DU === undefined) {
      setBackgroundColor('aquamarine')
    } else if (currentBlockB.DU || currentBlockB.isReady === undefined) {
      setBackgroundColor('crimson')
    } 
    if (currentBlockB.isReady === true) {
      setBackgroundColor('greenyellow')
    }
  }, [index])

  const handleClick = () => {
    const currentBlockB = JSON.parse(localStorage.getItem(index))
    if (currentBlockB?.ZDT) {
      navigate('/loop2', { state: { blockBIndex: index } })
    }
  }

  return (
    <Grid item xs={10}>
      <Card
        sx={{ display: 'flex', cursor: 'pointer' }}
        onClick={handleClick}
        className={`fis${index}`}
        style={{ backgroundColor }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div">{activity}</Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {bdt}
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image="/static/illustrations/fish.png"
          alt="fish"
        />
      </Card>
    </Grid>
  )
}
