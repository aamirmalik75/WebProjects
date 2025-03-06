import React, { useRef, useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import { app } from '../../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers.js';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Box, TextField } from '@mui/material';
import Header from '../../components/Header.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ApplicationForm = ({ type }) => {

  const { loading, token, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
  }

  const handleFileSubmit = async (values) => {
    dispatch(setLoading());
    try {
      if (files) {
        const downloadUrl = await storeCVInFirebase(files)
        setFiles(downloadUrl);
        values.cv_path = downloadUrl;
        dispatch(setAlert({ type: 'success', message: 'CV uploaded Successfully' }));
      } else {
        dispatch(setAlert({ type: 'error', message: 'Please choose CV image' }));
      }
    } catch (error) {
      dispatch(setAlert({ type: 'error', message: 'Something went wrong please try later' }));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const storeCVInFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_ changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      )
    })
  }

  const handleSubmit = async (data) => {
    data.applicationable_id = params.id;
    data.applicationable_type = type;
    dispatch(setLoading());
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/application/create', data, {
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
        navigate(`/applications/${user.id}`);
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
        message: error.response?.data?.status === 401 ? "Please try with your secured account" : errorMessage,
      }
      dispatch(setAlert(payload));
    } finally {
      dispatch(loadingComplete());
    }
  }

  const initialValues = {
    name: '',
    number: '',
    cover_letter: '',
    cv_path: '',
  }

  const schema = yup.object().shape({
    name: yup.string().required(),
    number: yup.number().required(),
    cover_letter: yup.string(),
    cv_path: yup.string().required(),
  });


  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainM: '1rem',
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainM: '.7rem',
    }
  } else {
    config = {
      mainM: '.3rem',
    }
  }

  return (
    <Box width='100%' >
      <Box m={config.mainM} width={'95%'} mt="40px" >
        <Header title='Submit Application' subtitle='Your Application is Representer of You.' />
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={schema}
        >
          {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
            <form onSubmit={handleSubmit} style={{ width: '100%' }} >
              <Box
                display='grid'
                gap='20px'
                gridTemplateColumns='repeat(2,minmax(0,1fr))'
                width='100%'
              >
                <TextField
                  fullWidth
                  name='name'
                  value={values.name}
                  variant='filled'
                  type='name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.name && errors.name}
                  label="Applicant Name"
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  name='number'
                  value={values.number}
                  variant='filled'
                  type='number'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.number && errors.number}
                  label="Applicant Phone Number"
                  helperText={touched.number && errors.number}
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  fullWidth
                  name='cover_letter'
                  value={values.cover_letter}
                  variant='filled'
                  type='text'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.cover_letter && errors.cover_letter}
                  label="Applicant Cover Letter"
                  helperText={touched.cover_letter && errors.cover_letter}
                  multiline
                  rows='7'
                  sx={{ gridColumn: 'span 4' }}
                />
                <TextField
                  name='cv_path'
                  type='text'
                  value={values.cv_path}
                  variant='filled'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.cv_path && errors.cv_path}
                  label="Applicant CV"
                  helperText={touched.cv_path && errors.cv_path}
                  sx={{ gridColumn: isNonMediumScreen ? 'span 2' : 'span 4' }}
                  onClick={() => fileInputRef.current.click()}
                />
                <input name='cv_path' type='file' accept='image/*' ref={fileInputRef} onChange={(e) => {
                  handleFileChange(e);
                  handleChange(e);
                }} onBlur={handleBlur} hidden />
                <Button disabled={loading} sx={{ gridColumn: isNonMediumScreen ? 'span 2' : 'span 4' }} variant='contained' onClick={() => handleFileSubmit(values)} >Upload CV</Button>
                <Box>
                  <Button disabled={loading} type='submit' variant="contained" color="primary" >
                    Send
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default ApplicationForm;
