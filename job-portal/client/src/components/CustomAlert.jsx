import { Alert, useMediaQuery } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { alertComplete } from '../redux/userReducers';

const CustomAlert = () => {
  const { alertType, alertMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');

  setTimeout(() => dispatch(alertComplete()), 5000);

  return (
    <Alert severity={alertType} sx={{ position: 'absolute', bottom: '10px', right: '10px', width: isNonMobileScreen ? '50%' : '90%', zIndex: 300 }} onClose={() => dispatch(alertComplete())} variant='filled' >{alertMessage}</Alert>
  )
}

export default CustomAlert
