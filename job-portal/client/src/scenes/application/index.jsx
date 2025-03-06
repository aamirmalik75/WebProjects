import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Rating, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { tokens } from '../../theme';
import { useParams } from 'react-router-dom';
import { CallSharp, DescriptionSharp, EqualizerSharp, StyleSharp } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import { Formik } from 'formik';
import * as yup from 'yup';
import CustomAlert from '../../components/CustomAlert';

const Application = () => {
  const colors = tokens();
  const params = useParams();
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(state => state.user);
  const [application, setApplication] = useState([]);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState({
    rating: 0,
    comment: '',
    id: -1,
  });
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/application/${params.id}/get`);
        if (response.data.success) {
          setApplication(response.data.application);
          dispatch(loadingComplete());
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
        }
      } catch (error) {
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
    const check = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/rating/${params.id}/asAlreadyRated`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success) {
          setHasRated(response.data.hasRated);
        }
      } catch (error) {
      }

      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/rating/${params.id}/employer/${user.id}`);
        if (response.data.success && response.data.ratings.length > 0) {
          setRating({
            rating: response.data.ratings[0].rating,
            comment: response.data.ratings[0].comment,
            id: response.data.ratings[0].id,
          });
          setHasRated(true);
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
        }
      } catch (error) {
      }


    }
    if (user && user.role === 'employer')
      check();
  }, []);

  let variables = {};
  if (application.applicationable_type == 'App\\Models\\Job') {
    variables = {
      type: 'Job'
    }
  }
  if (application.applicationable_type === "App\\Models\\Project") {
    variables = {
      type: 'Project'
    }
  }
  if (application.applicationable_type === "App\\Models\\HourlyJob") {
    variables = {
      type: 'Hourly Job'
    }
  }

  const handleSubmit = async () => {
    let data = {};
    data = {
      rating: rating.rating,
      comment: rating.comment,
    }
    dispatch(setLoading());
    if (hasRated) {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/rating/${rating.id}/update`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: response.data.message,
          }
          dispatch(setAlert(payload));
          setRating({
            rating: response.data.rating.rating,
            comment: response.data.rating.comment,
            id: response.data.rating.id,
          });
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          dispatch(setAlert(payload));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.data?.status === 401 ? "You can only update your own rating" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }

    } else {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/rating/${params.id}/create`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        if (response.data.success) {
          const payload = {
            type: 'success',
            message: response.data.message,
          }
          dispatch(setAlert(payload));
          setRating({
            rating: response.data.rating.rating,
            comment: response.data.rating.comment,
            id: response.data.rating.id,
          });
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          dispatch(setAlert(payload));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.data?.status === 401 ? "You can only give rating of that application which submitted you." : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const handleClick = async (eventType) => {
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/application/${application.id}/${eventType}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const payload = {
          type: 'success',
          message: response.data.message,
        }
        dispatch(setAlert(payload));
        // window.location.reload();
      } else {
        const payload = {
          type: 'error',
          message: response.data.error || 'Something went wrong please try later!'
        }
        dispatch(setAlert(payload));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
      const payload = {
        type: 'error',
        message: error.response?.data?.status === 401 ? "You can not update status of those application which is not belongs you" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }


  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainM: '1rem',
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainM: '.7rem .4rem',
    }
  } else {
    config = {
      mainM: '.3rem',
    }
  }


  return (
    <>
      <Box sx={{ m: config.mainM, mt: '60px', height: '100vh', border: '1px solid', borderColor: '#CDD7E1' }} display='grid' gridTemplateColumns={`repeat(${isNonMediumScreen ? 2 : 1},1fr)`}>
        {
          !loading &&
          <Box height='100%' width={isNonMediumScreen ? undefined : '100%'} >
            <img src={application.cv_path} alt="" height='100%' width='100%' />
          </Box>
        }
        {
          !loading &&
          <Box m='10px'>
            <Box>
              <Typography variant={isNonMobileScreen ? 'h1' : 'h3'} sx={{ fontWeight: '700' }} >{application.name}</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <CallSharp />
              <Typography variant={isNonMobileScreen ? 'h4' : 'h6'} sx={{ fontWeight: '500' }} >{application.number}</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <EqualizerSharp />
              <Typography variant={isNonMobileScreen ? 'h4' : 'h6'} sx={{ fontWeight: '500' }} >{application.status && application.status.toUpperCase()}</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <StyleSharp />
              <Typography variant={isNonMobileScreen ? 'h4' : 'h6'} sx={{ fontWeight: '500' }} >{application.applicationable_type && variables.type.toUpperCase()}</Typography>
            </Box>
            <Box display='flex' alignItems='center' gap='8px'>
              <DescriptionSharp />
              <Typography variant={isNonMobileScreen ? 'h4' : 'h6'} sx={{ fontWeight: '500' }} >{application.cover_letter}</Typography>
            </Box>
            {
              user && user.role === 'employer' &&
              <Box m={config.mainM} display='flex' gap='5px' >
                {
                  user && user.role === 'employer' &&
                  <Box width='100%'>
                    <Formik
                      initialValues={rating}
                      validationSchema={yup.object().shape({
                        rating: yup.number().required(),
                        comment: yup.string(),
                      })}
                      onSubmit={handleSubmit}
                    >
                      {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
                        <form onSubmit={handleSubmit} >
                          <Stack spacing={1} >
                            <Rating size={isNonMobileScreen ? 'large' : 'medium'} name='rating' value={values.rating || rating.rating} defaultValue={rating.rating ? rating.rating : 0} onChange={(e) => { handleChange(e); setRating({ ...rating, rating: e.target.value }) }} />
                          </Stack>
                          <TextField
                            fullWidth
                            name='comment'
                            value={values.comment || rating.comment}
                            variant='filled'
                            type='text'
                            onBlur={handleBlur}
                            onChange={(e) => { handleChange(e); setRating({ ...rating, comment: e.target.value }) }}
                            error={touched.comment && errors.comment}
                            label="Comment"
                            helperText={touched.comment && errors.comment}
                            multiline
                            rows={5}
                            sx={{ width: '100%', mt: isNonMobileScreen ? undefined : '1rem' }}
                          />
                          <Button type='submit' variant='contained' sx={{ m: '5px' }} >{hasRated ? 'Update' : 'Create'}</Button>
                        </form>
                      )}
                    </Formik>
                  </Box>
                }
              </Box>
            }
            <Box display='flex' flexDirection={isNonMediumScreen ? 'row' : 'column'} gap='0.5rem'>
              {
                application && application.status !== 'rejected' && application.status !== 'hired' && application.status !== 'fired' &&
                <Button variant='contained' color='error' onClick={() => handleClick('reject')} >
                  Rejected
                </Button>
              }
              {
                application && application.status !== 'shortListed' && application.status === 'applied' && <Button variant='contained' onClick={() => handleClick('shortList')} >
                  ShortListed
                </Button>
              }
              {
                application && application.status !== 'hired' && application.status !== 'rejected' &&
                <Button variant='contained' color='success' onClick={() => handleClick('hire')} >
                  Hired
                </Button>
              }
              {
                application && application.status === 'hired' &&
                <Button variant='contained' sx={{ background: colors.redAccent[500] }} onClick={() => handleClick('fire')} >
                  Fired
                </Button>
              }
            </Box>
          </Box>
        }
      </Box >
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='primary' />
          )
        }
      </Box>
    </>
  )
}

export default Application
