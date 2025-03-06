import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Pagination, Stack, Typography, useMediaQuery } from '@mui/material';
import CustomCard from '../../components/CustomCard';
import Header from '../../components/Header';
import axios from 'axios';
import { loadingComplete, setLoading } from '../../redux/userReducers';
import { useDispatch, useSelector } from 'react-redux';

const MyProjects = () => {
  const [myProjects, setMyProjects] = useState([]);
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
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/project/employerProjects?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setMyProjects(response.data.projects.data);
          setTotalPages(response.data.projects.last_page);
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
      <Header title='My Projects' subtitle='Manage Your Projects' />
      <Box display='grid' gridTemplateColumns={`repeat(${config.resultGrid},1fr)`} gap={isNonMediumScreen ? '10px' : '5px'}>
        {myProjects?.map((project) => (
          <CustomCard key={myProjects.id} job={project} type='Project' employer={true} />
        ))}
      </Box>
      {myProjects.length === 0 && (
        <Box>
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Project Found</Typography>
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

export default MyProjects;
