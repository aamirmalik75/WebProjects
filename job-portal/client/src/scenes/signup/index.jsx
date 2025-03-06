import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, TextareaAutosize, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup';
import Header from '../../components/Header';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { setLoading, loadingComplete, setAlert, alertComplete } from '../../redux/userReducers';

const SignUp = () => {
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery("(min-width: 600px)");
  const colors = tokens();
  const dispatch = useDispatch();
  const { user, loading, alert, alertType, alertMessage } = useSelector(state => state.user);

  useEffect(() => {
    if (user)
      navigate('/');
  })

  const handleSubmit = async (data) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/auth/register', data);
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message,
        }
        dispatch(setAlert(payload));
        dispatch(loadingComplete());
        navigate('/sign-in');
      }
    } catch (error) {
      const payload = {
        type: 'error',
        message: 'Server Error'
      }
      dispatch(loadingComplete());
      dispatch(setAlert(payload));
    }
  };
  const initialValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'employee',
  };

  const userSchema = yup.object().shape({
    name: yup.string().required('required'),
    email: yup.string().email('This email is invalid').required('required'),
    password: yup.string().required('required').min(6, 'Password must be at least 6 characters'),
    password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('required'),
    role: yup.string().required("Role is required"),
  });

  return (
    <Box width='100%'>
      <Box m=' 40px auto' width={isNonMobileScreen ? '60%' : '95%'} height='auto' sx={{ borderRadius: '5px' }}>
        <Header title='Sign Up' />
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display='grid'
                gap='20px'
                sx={{
                  "& > div": { gridColumn: isNonMobileScreen ? undefined : 'span 4' }
                }}
                gridTemplateColumns='repeat(4,minmax(0,1fr))'
              >
                <TextField
                  fullWidth
                  name='name'
                  value={values.name}
                  variant='filled'
                  type='text'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.name && errors.name}
                  label="Name"
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  name='email'
                  value={values.email}
                  variant='filled'
                  type='email'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.email && errors.email}
                  label="Email"
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  name='password'
                  value={values.password}
                  variant='filled'
                  type='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.password && errors.password}
                  label="Password"
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  fullWidth
                  name='password_confirmation'
                  value={values.password_confirmation}
                  variant='filled'
                  type='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.password_confirmation && errors.password_confirmation}
                  label="Confirm Password"
                  helperText={touched.password_confirmation && errors.password_confirmation}
                  sx={{ gridColumn: 'span 2' }}
                />
                <FormControl fullWidth sx={{ gridColumn: 'span 4' }} variant='filled' >
                  <InputLabel>Role</InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.role}
                    onChange={handleChange}
                    name='role'
                  >
                    <MenuItem value='employee'>
                      Employee
                    </MenuItem>
                    <MenuItem value='employer'>
                      Employer
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box display='flex' justifyContent='end' mt='15px'>
                <Button disabled={loading} type='submit' variant='contained' color='secondary'>Sign Up</Button>
              </Box>
            </form>
          )}
        </Formik>
        <Box display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px'>
          <Typography>Already have an account? </Typography>
          <Link to='/sign-in' style={{ color: colors.redAccent[500] }}>Sign In</Link>
        </Box>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
    </Box>
  )
}

export default SignUp;
