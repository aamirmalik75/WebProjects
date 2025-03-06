import { Box, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import ApplicationCard from '../../components/CustomApplication'
import { loadingComplete, setLoading } from '../../redux/userReducers'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const EmployerApplications = () => {
  const { loading, token } = useSelector(state => state.user);
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/application/${params.id}/show`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setApplications(response.data.applications);
      }
      else {
        dispatch(loadingComplete());
      }
      dispatch(loadingComplete());
    }
    fetch();
  }, []);


  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainM: '1rem',
      grid: 3,
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainM: '.7rem .4rem',
      grid: 2,
    }
  } else {
    config = {
      mainM: '.3rem',
      grid: 1,
    }
  }

  return (
    <Box m='15px'>
      <Header title='Applications' />
      <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`} gap='10px' >
        {applications.length > 0 && applications?.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </Box>
      {applications.length === 0 && (
        <Box>
          <Typography variant='h3' textAlign='center' color='error'>No Application Found</Typography>
        </Box>
      )}
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='primary' />
          )
        }
      </Box>
    </Box>
  )
}

export default EmployerApplications
