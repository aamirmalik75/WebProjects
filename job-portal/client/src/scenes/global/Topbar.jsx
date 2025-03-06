import React, { useState } from 'react'
import { tokens } from '../../theme';
import { Autocomplete, Badge, Box, Button, IconButton, InputBase, MenuItem, Modal, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { CircleNotificationsSharp, LogoutSharp, SearchSharp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, setAlert, setFilter, setUnRead } from '../../redux/userReducers';
import { useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import MenuListComp from '../../components/MenuListComp';

const Topbar = () => {
  const colors = tokens();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, unRead, filter } = useSelector(state => state.user);
  const [open, setOpen] = useState(false);
  const [n, setN] = useState([]);
  const [autoComplete, setAutoComplete] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  const handleLogOut = async () => {
    dispatch(logOut());
    dispatch(setAlert({ type: 'success', message: 'Logged Out Successfully!' }))
    navigate('/sign-in');
  }

  useEffect(() => {
    const fetch = async () => {
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
      const RESPONSE = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/keywords');
      const formattedOptions = Object.entries(RESPONSE.data.keywords).map(([key, label]) => ({
        label: label,
        value: key
      }));
      setAutoComplete(formattedOptions);
    }
    fetch();
    const pusher = new Pusher('4470b7912bcb91d7f4a9', {
      cluster: 'mt1',
      forceTLS: true,
    });
    const channel = pusher.subscribe('notify-user');
    channel.bind('user-notification', (notifi) => {
      setN(prev => [...prev, notifi]);
      alert(JSON.stringify(notifi));
    });
    channel.bind('pusher:subscription_succeeded', function () {
      console.log('Subscription to notifications channel succeeded');
    });

    return () => {
      channel.unbind('user-notification');
      pusher.unsubscribe('notify-user');
    };
  }, []);

  return (
    <Box width='100%' position='fixed' zIndex='100' sx={{ mb: '30px' }}>
      <Box display='flex' flexDirection={isNonMediumScreen ? 'row' : 'column'} sx={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }} justifyContent='space-between' alignItems='center' p={1} backgroundColor={colors.primary[500]} width='100%' >
        <Box width={isNonMediumScreen ? undefined : '100%'} display='flex' justifyContent='space-between' alignItems='center' ml="10px">
          <Link to='/' style={{ textDecoration: 'none' }} >
            <Typography color='#fff' variant='h3' ml='70px' >Job Portal</Typography>
          </Link>
          {
            !isNonMediumScreen &&
            <MenuListComp>
              {(user && user.role === 'employer' ) ? <MenuItem variant='contained' sx={{ background: 'transparent', color: '#fff' }} onClick={() => setOpen(true)} >Post A Job</MenuItem> :
                <></>
              }
              {
                user ?
                  <IconButton title='Notifications' sx={{ fontSize: '20px' }} onClick={() => navigate('/notifications')} >
                    <Badge color='secondary' badgeContent={unRead} >
                      <CircleNotificationsSharp sx={{ fontSize: '27px', color: '#fff' }} />
                    </Badge>
                  </IconButton>
                  : <></>
              }
              {!user ? <Button onClick={() => navigate('/sign-in')} variant='contained' sx={{ background: colors.orangeAccent[500] }} >Sign In</Button> :
                <IconButton title='Log Out' onClick={handleLogOut}>
                  <LogoutSharp sx={{ color: '#fff' }} />
                </IconButton>
              }
            </MenuListComp>

          }
        </Box>
        <Box display='flex' width={isNonMediumScreen ? undefined : '60%'} alignSelf={isNonMediumScreen ? undefined : 'flex-end'} backgroundColor={colors.whiteAccent[500]} borderRadius='4px' mr={isNonMediumScreen ? undefined : '.8rem'}>
          <Autocomplete
            disablePortal
            options={autoComplete}
            value={selectedOption}
            onChange={(e, value) => setSelectedOption(value)}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField label='search...' {...params} />}
            renderOption={(props, option) => (
              <Box {...props} style={{ cursor: 'pointer' }} >
                <Typography variant='h5' p='3px' onClick={(e) => { setSelectedOption(option.label); navigate(`/search?keyword=${option.label}`) }} >
                  {option.label}
                </Typography>
              </Box>
            )}
            sx={{ width: isNonMediumScreen ? 300 : '100%', color: '#fff' }}
          />
        </Box>
        {
          isNonMediumScreen &&
          <Box display='flex' >
            {user && user.role === 'employer' && <Button variant='contained' sx={{ background: colors.whiteAccent[500], color: '#000' }} onClick={() => setOpen(true)} >Post A Job</Button>}
            {
              user &&
              <IconButton title='Notifications' sx={{ fontSize: '20px' }} onClick={() => navigate('/notifications')} >
                <Badge color='secondary' badgeContent={unRead} >
                  <CircleNotificationsSharp sx={{ fontSize: '27px', color: '#fff' }} />
                </Badge>
              </IconButton>
            }
            {!user ? <Button onClick={() => navigate('/sign-in')} variant='contained' sx={{ background: colors.orangeAccent[500] }} >Sign In</Button> :
              <IconButton title='Log Out' onClick={handleLogOut}>
                <LogoutSharp sx={{ color: '#fff' }} />
              </IconButton>
            }
          </Box>
        }
      </Box >
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          p: '5px',
          position: 'absolute',
          top: '20%', borderRadius: '5px',
          left: '50%', width: isNonMediumScreen ? '50%' : '95%', backgroundColor: colors.orangeAccent[500], transform: 'translate(-50%, -50%)',
        }} >
          <Button variant='contained' onClick={() => { setOpen(false); navigate('/jobs/create') }} sx={{ width: '100%', background: colors.primary[500] }} >Post A Job</Button>
          <Button variant='contained' onClick={() => { setOpen(false); navigate('/projects/create') }} sx={{ width: '100%', background: colors.primary[500] }} >Post A Project</Button>
          <Button variant='contained' onClick={() => { setOpen(false); navigate('/hourlyJobs/create') }} sx={{ width: '100%', background: colors.primary[500] }} >Post A Hourly Job</Button>
        </Box>
      </Modal>
    </Box >
  )
}

export default Topbar
