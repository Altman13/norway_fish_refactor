import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, FormControl, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { API_DEP_ALL_STATUSES, API_STM32_SEND, DEFAULT_DELAY_MS } from './constants'

export default function EditMessageComponent({ message }) {
  const navigate = useNavigate()
  const [showCorrectionBtn, setShowCorrectionBtn] = useState(false)
  const [showCancelBtn, setShowCancelBtn] = useState(true)

  const formatPosition = (pos) =>
    pos?.replaceAll('N', '+').replaceAll('E', '+').replaceAll('W', '-').replaceAll('S', '-')

  const formatDateTime = (date) =>
    JSON.stringify(date)
      .slice(1, -9)
      .replaceAll(':', ' ')
      .replaceAll('-', ' ')
      .replace('T', ' ')

  const correctionClick = () => {
    const msgCopy = { ...message }
    msgCopy.TM = msgCopy.TM.toLowerCase()
    msgCopy.MV = msgCopy.MV === undefined ? 2 : msgCopy.MV + 1
    msgCopy.RE = 511

    const path = msgCopy.TM.toUpperCase() === 'DCA' ? `/${msgCopy.TM}editform` : `/${msgCopy.TM}form`
    navigate(path, { state: { msg: msgCopy } })
  }

  const cancelClick = async () => {
    const msgCopy = { ...message, RE: 521 }
    delete msgCopy.createdAt
    delete msgCopy.updatedAt
    delete msgCopy.cancelBtnRender
    delete msgCopy.newMessageRender
    delete msgCopy._id
    msgCopy.TM = msgCopy.TM.toLowerCase()

    const allStatuses = JSON.parse(localStorage.getItem('allStatusesSendingMessages')) || {}
    allStatuses[msgCopy.TM] = { src: '/static/illustrations/icons/Waiting.svg' }
    allStatuses.lastMessage = { [msgCopy.TM]: { src: '/static/illustrations/icons/Waiting.svg' } }

    await fetch(API_DEP_ALL_STATUSES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allStatuses),
    })

    const blockMsgState = { isBlock: false, dateTime: Date.now() }
    localStorage.setItem('blockMsgState', JSON.stringify(blockMsgState))

    await fetch(API_STM32_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { req: 'DATIPOS' } }),
    })

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_DELAY_MS))

    const mainPos = formatPosition(localStorage.getItem('pos'))
    const mainDate = new Date()
    msgCopy.DATI = formatDateTime(mainDate)
    msgCopy.XTG = mainPos

    await fetch(API_STM32_SEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: msgCopy, flags: { send: true, isAsync: false, isSync: false, isCancel: true } }),
    })

    navigate('/')
  }

  useEffect(() => {
    if (['COE', 'DCA'].includes(message.TM)) setShowCorrectionBtn(true)
    if (message.TM.toUpperCase() === 'DCA') setShowCancelBtn(false)
    if (message.TM.toUpperCase() === 'DEP' && message.cancelBtnRender === false) setShowCancelBtn(false)
  }, [message])

  return (
    <FormControl
      fullWidth
      sx={{ mb: 2, border: '2px solid rgb(222,226,229)', borderRadius: '15px' }}
    >
      <Grid container justifyContent="center">
        <Card sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 12, lineHeight: 2.5 }}>
                {message.TM} {message.RN} {message.DATI}
              </Typography>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 125 }}
            image="/static/illustrations/images.jpeg"
            alt="status"
          />
        </Card>

        {showCorrectionBtn && (
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={correctionClick}>
            Korrigere
          </Button>
        )}

        {showCancelBtn && (
          <Button fullWidth variant="contained" sx={{ mt: 1, backgroundColor: 'red' }} onClick={cancelClick}>
            Kansellere
          </Button>
        )}
      </Grid>
    </FormControl>
  )
}
