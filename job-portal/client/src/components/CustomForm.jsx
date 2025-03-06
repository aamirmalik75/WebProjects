import { Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import Header from './Header'
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from '../theme';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CustomForm = ({ type, JOB = null }) => {

  const industryType = [
    { value: 'it_software', label: 'IT / Software' },
    { value: 'finance', label: 'Finance' },
    { value: 'health', label: 'Health Care' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'construction', label: 'Construction' },
    { value: 'tourism', label: 'Tourism' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'media_entertainment', label: 'Media and Entertainment' },
  ]

  let initialVariables = {};
  if (type === 'Job') {
    initialVariables = {
      prefix: 'job',
      redirect: 'myjobs',
      name: 'Job',
      functionality: !JOB ? 'Create' : 'Update'
    }
  }
  if (type === 'Project') {
    initialVariables = {
      prefix: 'project',
      redirect: 'myprojects',
      name: 'Project Job',
      functionality: !JOB ? 'Create' : 'Update'
    }
  }
  if (type === 'Hourly Job') {
    initialVariables = {
      prefix: 'hourlyJob',
      redirect: 'myhourlyjobs',
      name: 'Hourly Job',
      functionality: !JOB ? 'Create' : 'Update'
    }
  }

  const colors = tokens();
  const { loading, token } = useSelector(state => state.user);
  const [step, setStep] = useState(1);
  const [newSkill, setNewSkill] = useState('');
  const [skills_req, setSkills_req] = useState([]);
  const [variables, setVariables] = useState(initialVariables);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  const deleteSkill = (skill) => {
    const skillValues = skills_req.filter(s => s !== skill);
    setSkills_req(skillValues);
  }

  const handleSubmit = async (data) => {
    data.skills_required = skills_req;
    dispatch(setLoading());
    if (!JOB) {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/${variables.prefix}/create`, data, {
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
          navigate(`/${variables.redirect}`);
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
          message: errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    else {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/${variables.prefix}/update`, data, {
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
          navigate(`/${variables.redirect}`);
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
          message: error.response?.data?.status === 401 ? `You can only update your own ${type}` : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const handleSkill = (skills) => {
    skills.push(newSkill);
    setSkills_req(prev => [...prev, newSkill]);
    setNewSkill('');
  }

  const data = {
    title: JOB ? JOB.title : '',
    description: JOB ? JOB.description : '',
    requirement: 'Fresher',
    skills_required: [],

    job_type: '',
    min_salary: 0,
    max_salary: 0,
    project_type: '',
    min_hour_rate: 0,
    max_hour_rate: 0,
    company: '',
    company_employees: 0,
    location: '',
    company_details: '',
    industry_type: '',

  };

  const inputSchema1 = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    requirement: yup.string().required(),
    skills_required: yup.array().of(yup.string()).required('Skills are required'),

    ...(type === 'Job' && {
      job_type: yup.string().required(),
      min_salary: yup.number().max(9999999999, "Only 10 digits are allowed").required(),
      max_salary: yup.number().min(yup.ref('min_salary'), 'Maximum salary must be greater than minimum salary').max(9999999999, "Only 10 digits are allowed").required(),
    }),
    ...(type === 'Project' && {
      project_type: yup.string().required(),
      min_salary: yup.number().max(9999999999, "Only 10 digits are allowed").required(),
      max_salary: yup.number().min(yup.ref('min_salary'), 'Maximum salary must be greater than minimum salary').max(9999999999, "Only 10 digits are allowed").required(),
    }),
    ...(type === 'Hourly Job' && {
      job_type: yup.string().required(),
      min_hour_rate: yup.number().max(9999999999, "Only 10 digits are allowed").required(),
      max_hour_rate: yup.number().min(yup.ref('min_hour_rate'), 'Maximum hour rate must be greater than minimum hour rate').max(9999999999, "Only 10 digits are allowed").required(),
    })
  });

  const inputSchema2 = yup.object().shape({
    company: yup.string().required(),
    company_employees: yup.number().required(),
    location: yup.string().required(),
    company_details: yup.string().required(),
    industry_type: yup.string().required(),
  });


  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainP: '1rem',
      skillGrid: 6,
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainP: '.7rem .4rem',
      skillGrid: 4,
    }
  } else {
    config = {
      mainP: '.3rem',
      skillGrid: 1,
    }
  }

  return (
    <Box width='100%'>
      <Box m='0px auto' width='100%' height='auto' sx={{ borderRadius: '5px', p: config.mainP, mt: '-4rem' }}>
        <Header title={!JOB ? `${variables.functionality} new ${variables.name}` : `${variables.functionality} ${variables.name}`} />
        <Formik
          initialValues={data}
          onSubmit={handleSubmit}
          validationSchema={step === 1 ? inputSchema1 : inputSchema2}
        >
          {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => (
            <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box
                display='grid'
                gap='20px'
                gridTemplateColumns='repeat(4,minmax(0,1fr))'
                width='100%'
              >
                {step === 1 ? (
                  <>
                    <TextField
                      fullWidth
                      name='title'
                      value={values.title}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.title && errors.title}
                      label={type === 'Project' ? "Project Title" : "Job Title"}
                      helperText={touched.title && errors.title}
                      sx={{ gridColumn: 'span 4' }}
                    />
                    <TextField
                      fullWidth
                      name='description'
                      value={values.description}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!(touched.description && errors.description)}
                      label={type === 'Project' ? "Project Description" : "Job Description"}
                      helperText={touched.description && errors.description}
                      multiline
                      rows={5}
                      sx={{ gridColumn: 'span 4' }}
                    />
                    <FormControl fullWidth sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }} variant='filled' >
                      <InputLabel>Requirement</InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={values.requirement}
                        onChange={handleChange}
                        name='requirement'
                      >
                        <MenuItem value='Fresher'>
                          Fresher
                        </MenuItem>
                        <MenuItem value='1 Year Experience'>
                          1 Year Experience Minimum
                        </MenuItem>
                        <MenuItem value='5 Year Experience'>
                          5 Year Experience Minimum
                        </MenuItem>
                        <MenuItem value='10 Year Experience'>
                          10 Year Experience Minimum
                        </MenuItem>
                        <MenuItem value='10 Year Experience+'>
                          More than 10 Year Experience
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }} variant='filled' >
                      <InputLabel>{type === 'Project' ? 'Project Type' : 'Job Type'}</InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={type === 'Project' ? values.project_type : values.job_type}
                        onChange={handleChange}
                        name={type === 'Project' ? 'project_type' : 'job_type'}
                      >
                        <MenuItem value='Traditional'>
                          Traditional {type === 'Project' ? 'Project' : 'Job'}
                        </MenuItem>
                        <MenuItem value='Remotely'>
                          Remotely {type === 'Project' ? 'Project' : 'Job'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      name={type === 'Hourly Job' ? 'min_hour_rate' : 'min_salary'}
                      value={type === 'Hourly Job' ? values.min_hour_rate : values.min_salary}
                      variant='filled'
                      type='number'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={type === 'Hourly Job' ? touched.min_hour_rate : touched.min_salary && type === 'Hourly Job' ? errors.min_hour_rate : errors.min_salary}
                      label={type === 'Hourly Job' ? 'Minimum Hour Rate' : 'Minimum Salary'}
                      helperText={type === 'Hourly Job' ? touched.min_hour_rate : touched.min_salary && type === 'Hourly Job' ? errors.min_hour_rate : errors.min_salary}
                      sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                    />
                    <TextField
                      fullWidth
                      name={type === 'Hourly Job' ? 'max_hour_rate' : 'max_salary'}
                      value={type === 'Hourly Job' ? values.max_hour_rate : values.max_salary}
                      variant='filled'
                      type='number'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={type === 'Hourly Job' ? touched.max_hour_rate : touched.max_salary && type === 'Hourly Job' ? errors.max_hour_rate : errors.max_salary}
                      label={type === 'Hourly Job' ? 'Maximum Hour Rate' : 'Maximum Salary'}
                      helperText={type === 'Hourly Job' ? touched.max_hour_rate : touched.max_salary && type === 'Hourly Job' ? errors.max_hour_rate : errors.max_salary}
                      sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                    />
                    <TextField
                      name='new skill'
                      variant='filled'
                      type='text'
                      onChange={(e) => setNewSkill(e.target.value)}
                      label='Skills Required'
                      sx={{ gridColumn: isNonMobileScreen ? 'span 3' : 'span 4' }}
                      value={newSkill}
                    />
                    <Button variant='contained' sx={{ height: '40px', gridColumn: isNonMobileScreen ? 'span 1' : 'span 4', alignSelf: 'center' }} onClick={() => handleSkill(values.skills_required)} >Add Skill</Button>
                    <Stack display={'grid'} gridTemplateColumns={`repeat(${config.skillGrid},1fr)`} gap="5px" alignItems='center' sx={{ gridColumn: 'span 4' }}>
                      <Typography variant='h4' mr='5px' gridColumn={`span ${config.skillGrid}`} >Skills: </Typography>
                      {skills_req?.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={() => deleteSkill(skill)}
                          sx={{ mr: '5px' }}
                        />
                      ))}
                    </Stack>
                  </>
                ) : (
                  <>
                    <TextField
                      name='company'
                      value={values.company}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={!!(touched.company && errors.company)}
                      label='Company Name'
                      helperText={touched.company && errors.company}
                      sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                    />
                    <TextField
                      name='company_employees'
                      value={values.company_employees}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.company_employees && errors.company_employees}
                      label='No of Employees'
                      helperText={touched.company_employees && errors.company_employees}
                      sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                    />
                    <TextField
                      name='location'
                      value={values.location}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.location && errors.location}
                      label='Company Location'
                      helperText={touched.location && errors.location}
                      sx={{ gridColumn: 'span 4' }}
                    />
                    <TextField
                      name='company_details'
                      value={values.company_details}
                      variant='filled'
                      type='text'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={touched.company_details && errors.company_details}
                      label='Company Details'
                      helperText={touched.company_details && errors.company_details}
                      rows='8'
                      multiline
                      sx={{ gridColumn: 'span 4' }}
                    />
                    {/* industry_type */}
                    <FormControl fullWidth sx={{ gridColumn: 'span 4' }} variant='filled' >
                      <InputLabel>Industry Type</InputLabel>
                      <Select
                        fullWidth
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={values.industry_type}
                        onChange={handleChange}
                        name='industry_type'
                      >
                        {industryType.map((type) => (
                          <MenuItem value={type.value} key={type.value} >{type.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
              </Box>
              <Box display='flex' justifyContent='space-between' mt='15px' width='100%'>
                <Box>
                  {step === 2 && (
                    <Button disabled={loading} onClick={() => setStep(1)} type='button' sx={{ mr: isNonMobileScreen ? '10px' : '3px' }} variant='contained' color='secondary'>Previous</Button>
                  )}
                </Box>
                <Button disabled={loading} onClick={() => { step === 1 ? setStep(2) : handleSubmit() }} variant='contained' color='secondary'>{step === 1 ? 'Next' : `${variables.functionality}`}</Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
    </Box>
  )
}

export default CustomForm;
