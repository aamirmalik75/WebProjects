import { Box, Button, Chip, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { tokens } from '../theme';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CustomForm = ({ type, JOB }) => {

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
      functionality: 'Update'
    }
  }
  if (type === 'Project') {
    initialVariables = {
      prefix: 'project',
      redirect: 'myprojects',
      name: 'Project Job',
      functionality: 'Update'
    }
  }
  if (type === 'Hourly Job') {
    initialVariables = {
      prefix: 'hourlyJob',
      redirect: 'myhourlyjobs',
      name: 'Hourly Job',
      functionality: 'Update'
    }
  }

  const colors = tokens();
  const { loading, token } = useSelector(state => state.user);
  const [newSkill, setNewSkill] = useState('');
  const [skills_req, setSkills_req] = useState(JOB ? JOB.skills_required : []);
  const [variables, setVariables] = useState(initialVariables);
  const [updatedJob, setUpdatedJob] = useState({
    title: '',
    description: '',
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
  });

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  useEffect(() => {
    setUpdatedJob({
      title: JOB.title !== undefined ? JOB.title : '',
      description: JOB.description !== undefined ? JOB.description : '',
      requirement: JOB.requirement !== undefined ? JOB.requirement : 'Fresher',
      skills_required: JOB.skills_required !== undefined ? JOB.skills_required : [],
      job_type: JOB.job_type !== undefined ? JOB.job_type : '',
      min_salary: JOB.min_salary !== undefined ? JOB.min_salary : 0,
      max_salary: JOB.max_salary !== undefined ? JOB.max_salary : 0,
      project_type: JOB.project_type !== undefined ? JOB.project_type : '',
      min_hour_rate: JOB.min_hour_rate !== undefined ? JOB.min_hour_rate : 0,
      max_hour_rate: JOB.max_hour_rate !== undefined ? JOB.max_hour_rate : 0,
      company: JOB.company !== undefined ? JOB.company : '',
      company_employees: JOB.company_employees !== undefined ? JOB.company_employees : 0,
      location: JOB.location !== undefined ? JOB.location : '',
      company_details: JOB.company_details !== undefined ? JOB.company_details : '',
      industry_type: JOB.industry_type !== undefined ? JOB.industry_type : '',
    });

    if (typeof JOB.skills_required === 'string') {
      const array = JOB.skills_required.replace(/[\[\]"]+/g, "").split(",");
      setSkills_req(array);
    }
  }, [JOB]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteSkill = (skill) => {
    const skillValues = skills_req.filter(s => s !== skill);
    setSkills_req(skillValues);
  }

  const handleSubmit = async () => {
    updatedJob.skills_required = skills_req;
    dispatch(setLoading());
    try {
      const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/${variables.prefix}/${JOB.id}/update`, updatedJob, {
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

  const handleSkill = () => {
    setSkills_req(prev => [...prev, newSkill]);
    setNewSkill('');
  }

  const inputSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    requirement: yup.string().required(),
    skills_required: yup.array().of(yup.string()).required('Skills are required'),
    company: yup.string().required(),
    company_employees: yup.number().required(),
    location: yup.string().required(),
    company_details: yup.string().required(),
    industry_type: yup.string().required(),

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
          initialValues={updatedJob}
          onSubmit={handleSubmit}
          validationSchema={inputSchema}
        >
          {({ values, errors, touched, handleSubmit, handleBlur, handleChange }) => {
            values.title = values.title !== undefined ? updatedJob.title : '';
            values.description = values.description !== undefined ? updatedJob.description : '';
            values.company = values.company !== undefined ? updatedJob.company : '';
            values.company_details = values.company_details !== undefined ? updatedJob.company_details : '';
            values.company_employees = values.company_employees !== undefined ? updatedJob.company_employees : 0;
            values.industry_type = values.industry_type !== undefined ? updatedJob.industry_type : '';
            values.job_type = values.job_type !== undefined ? updatedJob.job_type : '';
            values.location = values.location !== undefined ? updatedJob.location : '';
            values.max_hour_rate = values.max_hour_rate !== undefined ? updatedJob.max_hour_rate : 0;
            values.min_hour_rate = values.min_hour_rate !== undefined ? updatedJob.min_hour_rate : 0;
            values.max_salary = values.max_salary !== undefined ? updatedJob.max_salary : 0;
            values.min_salary = values.min_salary !== undefined ? updatedJob.min_salary : 0;
            values.project_type = values.project_type !== undefined ? updatedJob.project_type : '';
            values.requirement = values.requirement !== undefined ? updatedJob.requirement : 'Fresher';
            values.skills_required = values.skills_required !== undefined ? updatedJob.skills_required : [];

            return (

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Box
                  display='grid'
                  gap='20px'
                  gridTemplateColumns='repeat(4,minmax(0,1fr))'
                  width='100%'
                >
                  <TextField
                    fullWidth
                    name='title'
                    value={updatedJob.title}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={!!(touched.title && errors.title)}
                    label={type === 'Project' ? "Project Title" : "Job Title"}
                    helperText={touched.title && errors.title}
                    sx={{ gridColumn: 'span 4' }}
                  />
                  <TextField
                    fullWidth
                    name='description'
                    value={updatedJob.description}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={touched.description && errors.description}
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
                      defaultValue={updatedJob.requirement}
                      value={updatedJob.requirement}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange(e);
                        setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                      }}
                      name='requirement'
                    >
                      <MenuItem value=''>
                        Select Requirement
                      </MenuItem>
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
                      value={type === 'Project' ? updatedJob.project_type : updatedJob.job_type}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange(e);
                        setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                      }}
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
                    value={type === 'Hourly Job' ? updatedJob.min_hour_rate : updatedJob.min_salary}
                    variant='filled'
                    type='number'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={type === 'Hourly Job' ? touched.min_hour_rate : touched.min_salary && type === 'Hourly Job' ? errors.min_hour_rate : errors.min_salary}
                    label={type === 'Hourly Job' ? 'Minimum Hour Rate' : 'Minimum Salary'}
                    helperText={type === 'Hourly Job' ? touched.min_hour_rate : touched.min_salary && type === 'Hourly Job' ? errors.min_hour_rate : errors.min_salary}
                    sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                  />
                  <TextField
                    fullWidth
                    name={type === 'Hourly Job' ? 'max_hour_rate' : 'max_salary'}
                    value={type === 'Hourly Job' ? updatedJob.max_hour_rate : updatedJob.max_salary}
                    variant='filled'
                    type='number'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
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
                  <Button variant='contained' sx={{ height: '40px', gridColumn: isNonMobileScreen ? 'span 1' : 'span 4', alignSelf: 'center' }} onClick={() => handleSkill()} >Add Skill</Button>
                  <Stack display={'grid'} gridTemplateColumns={`repeat(${config.skillGrid},1fr)`} gap="5px" alignItems='center' sx={{ gridColumn: 'span 4' }}>
                    <Typography variant='h4' mr='5px' >Skills: </Typography>
                    {skills_req?.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => deleteSkill(skill)}
                        sx={{ mr: '5px' }}
                      />
                    ))}
                  </Stack>
                  <TextField
                    name='company'
                    value={updatedJob.company}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={touched.company && errors.company}
                    label='Company Name'
                    helperText={touched.company && errors.company}
                    sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                  />
                  <TextField
                    name='company_employees'
                    value={updatedJob.company_employees}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={touched.company_employees && errors.company_employees}
                    label='No of Employees'
                    helperText={touched.company_employees && errors.company_employees}
                    sx={{ gridColumn: isNonMobileScreen ? 'span 2' : 'span 4' }}
                  />
                  <TextField
                    name='location'
                    value={updatedJob.location}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
                    error={touched.location && errors.location}
                    label='Company Location'
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: 'span 4' }}
                  />
                  <TextField
                    name='company_details'
                    value={updatedJob.company_details}
                    variant='filled'
                    type='text'
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange(e);
                      setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                    }}
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
                      value={updatedJob.industry_type}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange(e);
                        setUpdatedJob((prev) => ({ ...prev, [name]: value }))
                      }}
                      name='industry_type'
                    >
                      {industryType.map((type) => (
                        <MenuItem value={type.value} key={type.value} >{type.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </form>
            )
          }}
        </Formik>
        <Button disabled={loading} sx={{ m: '5px' }} onClick={handleSubmit} variant='contained' color='secondary'> {variables.functionality}</Button>
      </Box>
      <Box display='flex' alignItems='center' justifyContent='center' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
    </Box >
  )
}

export default CustomForm;
