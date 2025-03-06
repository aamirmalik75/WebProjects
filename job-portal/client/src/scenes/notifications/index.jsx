import { Box, CircularProgress, Pagination, Stack, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../components/Header';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading, setUnRead } from '../../redux/userReducers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { token, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/notification/notifications?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setNotifications(response.data.notifications.data);
          setTotalPages(response.data.notifications.last_page);
        }
      } catch (error) {
        dispatch(setAlert({ type: 'error', message: error.message }))
      } finally {
        dispatch(loadingComplete());
      }
    }
    fetch();
    const markAsReadTimeout = setTimeout(() => {
      markAllAsRead();
    }, 5000);
    return () => clearTimeout(markAsReadTimeout);
  }, [currentPage]);

  const markAllAsRead = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/notification/markAllAsRead`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (error) {

    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/notification/notifications?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setNotifications(response.data.notifications.data);
        setTotalPages(response.data.notifications.last_page);
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/notification/unreadNotifications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success) {
          if (res.data.unReadNotifications.length > 0)
            dispatch(setUnRead(res.data.unReadNotifications.length));
          else
            dispatch(setUnRead(undefined));
        }
      }
    } catch (error) {
    }
  }


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
    <Box m={config.mainM}  >
      <Header title='Notifications' />
      {notifications && notifications.map((notification) => (
        <Box width='100%' sx={{ background: notification.read_at ? '#e9fce9' : '#bcf5bc', m: '5px 0px', p: '5px', borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h4' : 'h6'} fontWeight='600' >{notification.data.greeting}</Typography>
          <Typography variant={isNonMobileScreen ? 'h6' : 'body2'} >{notification.data.message}</Typography>
        </Box>
      ))}
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

export default Notifications
