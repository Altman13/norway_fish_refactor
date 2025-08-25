import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    // email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const handleOnSubmit = (evt) => {
      console.log(document.getElementsByName("login")[0].value)

      const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          login,
          password,
        }
      }),
    }
    fetch('http://192.168.3.1:8000/api/auth/register', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        localStorage.setItem('bruker', login)
        navigate('/')
    })
  }  

  const handleSetLogin = (e) => {
    console.log(e)
    setLogin(e)
  }
  const handleSetPassword = (e) => {
    console.log(e)
    setPassword(e)
  }
  const onSubmit = async () => {
    navigate('/dashboard', { replace: true });
  }

  return (
    <FormProvider methods={methods}>
      <Stack spacing={3}>
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack> */}

        <RHFTextField name="login" label="Bruker" value={login} onChange={(e) => handleSetLogin(e.target.value)} />

        <RHFTextField
          id="password"
          name="password"
          label="Password"
          value={password}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => handleSetPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" variant="contained" onClick={handleOnSubmit}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
