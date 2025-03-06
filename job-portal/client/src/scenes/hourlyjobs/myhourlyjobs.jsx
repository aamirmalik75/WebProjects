import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Pagination, Stack, Typography, useMediaQuery } from '@mui/material';
import CustomCard from '../../components/CustomCard';
import Header from '../../components/Header';
import axios from 'axios';
import { loadingComplete, setLoading } from '../../redux/userReducers';
import { useDispatch, useSelector } from 'react-redux';

const MyHourlyJobs = () => {
  const [myHourlyJobs, setMyHourlyJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { loading, token } = useSelector(state => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/hourlyJob/employerHourlyJobs?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setMyHourlyJobs(response.data.hourlyJobs.data);
          setTotalPages(response.data.hourlyJobs.last_page);
        }
      } catch (error) {
        dispatch(setAlert({ type: 'error', message: error.message }))
      } finally {
        dispatch(loadingComplete());
      }
    };
    fetch();
  }, [currentPage]);

  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainM: '1rem',
      resultGrid: 3,
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainM: '.7rem .4rem',
      resultGrid: 2,
    }
  } else {
    config = {
      mainM: '.3rem',
      resultGrid: 1,
    }
  }

  return (
    <Box m={config.mainM}>
      <Header title='My Hourly Jobs' subtitle='Manage your Hourly Jobs' />
      <Box display='grid' gridTemplateColumns={`repeat(${config.resultGrid},1fr)`} gap={isNonMediumScreen ? '10px' : '5px'}>
        {myHourlyJobs?.map((job) => (
          <CustomCard key={myHourlyJobs.id} job={job} type='Hourly Job' employer={true} />
        ))}
      </Box>
      {myHourlyJobs.length === 0 && (
        <Box>
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Hourly Job Found</Typography>
        </Box>
      )}
      {
        !loading &&
        <Stack spacing={2} m='10px auto'>
          <Pagination size={isNonMobileScreen ? 'medium' : 'small'} count={totalPages} page={currentPage} onChange={(e, v) => setCurrentPage(v)} color='secondary' />
        </Stack>
      }
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

export default MyHourlyJobs;
