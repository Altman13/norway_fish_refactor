import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Container, Button, FormControl, Typography } from '@mui/material'
import FileUpload from 'react-mui-fileuploader'

import Header from './Header'
import Footer from './Footer'

export default function FileUploader() {
  const [filesToUpload, setFilesToUpload] = useState([])
  const navigate = useNavigate()

  const goToStartPage = () => navigate('/')

  const handleFilesChange = (files) => setFilesToUpload([...files])

  const uploadFiles = async () => {
    if (!filesToUpload.length) return
    const formData = new FormData()
    filesToUpload.forEach((file) => formData.append('firmwarefile', file))

    try {
      const response = await fetch('http://192.168.3.1:8000/api/firmware/', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      console.log('Upload response:', data)
      // Optionally show success message or redirect
    } catch (error) {
      console.error('Upload failed:', error)
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
          minHeight="90vh"
          component="form"
          flexDirection="column"
        >
          <Typography
            variant="h5"
            sx={{ textAlign: 'center', my: 3, fontFamily: 'cursive' }}
          >
            FIRMWARE UPDATE
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 3 }}
            onClick={goToStartPage}
          >
            Gå til start side
          </Button>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <FileUpload
              title=""
              multiFile
              onFilesChange={handleFilesChange}
              onContextReady={() => console.log('context ready')}
            />
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            onClick={uploadFiles}
            disabled={!filesToUpload.length}
          >
            Upload
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  )
}
