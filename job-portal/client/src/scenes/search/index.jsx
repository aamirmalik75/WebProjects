import { Box, CircularProgress, Pagination, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter, removeFilter, removeSearch, setAlert, setLoading, loadingComplete } from '../../redux/userReducers'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import CustomCard from '../../components/CustomCard'
import FilterComp from '../../components/FilterComp'

const Search = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector(state => state.user);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

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


  useEffect(() => {
    dispatch(setFilter());
    const query = new URLSearchParams(location.search).toString();
    const fetch = async () => {
      try {
        dispatch(setLoading());
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/search?${query}&page=${currentPage}`);
        if (response.data.success) {
          setItems(response.data.result.data);
          setTotalPages(response.data.result.last_page);
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          dispatch(setAlert(payload));
        }
      } catch (error) {
        console.log(error)
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    fetch();
    return () => {
      dispatch(removeFilter())
      dispatch(removeSearch());
    };
  }, [location.search, currentPage]);
  return (
    <Box m={config.mainM} >
      <Header title='Records' />
      {(!isNonMediumScreen || !isNonMobileScreen) && <FilterComp sidebar={false} />}
      <Box display='grid' gridTemplateColumns={`repeat(${config.resultGrid},1fr)`} gap={isNonMediumScreen ? '10px' : '5px'}>
        {items?.map((item) => (
          <CustomCard key={item.id} job={item} type={item.model} />
        ))}
      </Box>
      {items.length === 0 && (
        <Box>
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Record Found</Typography>
        </Box>
      )}
      {
        !loading && items.length > 0 &&
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

export default Search
