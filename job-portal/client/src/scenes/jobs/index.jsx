import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Pagination, Stack, Typography, useMediaQuery } from '@mui/material';
import CustomCard from '../../components/CustomCard';
import Header from '../../components/Header';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import { useDispatch, useSelector } from 'react-redux';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/job/show?page=${currentPage}`);
        if (response.data.success) {
          setJobs(response.data.jobs.data);
          setTotalPages(response.data.jobs.last_page);
        }
      } catch (error) {
        dispatch(setAlert({ type: 'error', message: error.message }));
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
      <Header title='Jobs' subtitle='Find your Ideal Job' />
      <Box display='grid' gridTemplateColumns={`repeat(${config.resultGrid},1fr)`} gap={isNonMediumScreen ? '10px' : '5px'}>
        {jobs?.map((job) => (
          <CustomCard key={job.id} job={job} type='Job' />
        ))}
      </Box>
      {jobs.length === 0 && (
        <Box>
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Job Found</Typography>
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

export default Jobs
