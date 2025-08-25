import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material'

export default function DcaCard({ index }) {
  const [fisOperationBlocks, setFisOperationBlocks] = useState([])

  useEffect(() => {
    if (!index) return

    const blocks = Object.keys(index)
      .filter((key) => key.includes('blockB'))
      .map((key) => index[key])

    setFisOperationBlocks(blocks)
  }, [index])

  const routeChange = () => {
    // TODO: навигация при клике по карточке
  }

  return (
    <Grid item xs={12} justifyContent="flex-start">
      <Card sx={{ display: 'flex' }} onClick={routeChange}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }} xs={10}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            {fisOperationBlocks.map((el, idx) => (
              <div key={idx}>
                Start time: {el.BDT}
                <br />
              </div>
            ))}
            <Typography component="div" variant="h5">
              DCA
            </Typography>
          </CardContent>
        </Box>
        <CardMedia
          sx={{ width: 151, margin: 'auto' }}
          component="img"
          image="/static/illustrations/images.jpeg"
          alt="fish"
        />
      </Card>
    </Grid>
  )
}
