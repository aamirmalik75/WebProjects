import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Divider, Grid, responsiveFontSizes, useMediaQuery } from '@mui/material';
import { tokens } from '../theme';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers';
import { useDispatch, useSelector } from 'react-redux';

const Details = ({ type }) => {

  const colors = tokens();
  const [skills_req, setSkills_req] = useState([]);
  const [job, setJob] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector(state => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  let variables = {};
  if (type === 'Job') {
    variables = {
      redirect: 'job',
      prefix: 'job',
    }
  }
  if (type === 'Project') {
    variables = {
      redirect: 'project',
      prefix: 'project',
    }
  }
  if (type === 'Hourly Job') {
    variables = {
      redirect: 'hourlyjob',
      prefix: 'hourlyJob',
    }
  }

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/${variables.prefix}/${params.id}/show`);
        if (response.data.success) {
          setJob(response.data.job);
          if (typeof response.data.job.skills_required === 'string') {
            const array = response.data.job.skills_required.replace(/[\[\]"]+/g, "").split(",");
            setSkills_req(array);
          }
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          navigate('/');
          dispatch(setAlert(payload));
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: errorMessage,
        }
        dispatch(setAlert(payload));
        navigate('/');
      }
    }
    const check = async () => {
      if (user && user.role == 'employee') {
        try {
          const res = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/application/resource/${job.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setHasApplied(res.data.hasApplied);
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetch();
    check();
  }, [type]);

  return (
    <Box p={isNonMobileScreen ? 2 : 1} mt={(!isNonMediumScreen || !isNonMobileScreen) && '6rem'} >
      <Typography variant="h2" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant={isNonMediumScreen ? "h4" : "h5"} gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
        <Typography variant={isNonMediumScreen ? "h4" : "h5"} sx={{ fontWeight: isNonMobileScreen ? '600' : '500', fontSize: '18px' }}>Company: </Typography>{job.company}
      </Typography>
      <Typography variant={isNonMediumScreen ? "h4" : "h5"} gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined} >
        <Typography variant={isNonMediumScreen ? "h4" : "h5"} sx={{ fontWeight: isNonMobileScreen ? '600' : '500', fontSize: '18px' }}>Job Description: </Typography>{job.description}
      </Typography>

      <Typography variant={isNonMediumScreen ? "h4" : "h5"} gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
        <Typography variant='h4' sx={{ fontWeight: isNonMobileScreen ? '600' : '500', fontSize: '18px' }}>Company Details: </Typography>{job.company_details}
      </Typography>
      <Typography variant={isNonMediumScreen ? "h4" : "h5"} gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
        <Typography variant='h4' sx={{ fontWeight: isNonMobileScreen ? '600' : '500', fontSize: '18px' }}>Company Employees: </Typography>{job.company_employees}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={isNonMobileScreen ? 6 : 12}>
          <Typography variant="h4" sx={{ fontWeight: '600', fontSize: '18px' }} >{type} Details</Typography>
          <Typography variant="h5" gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
            <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>Location:</Typography> {job.location}
          </Typography>
          <Typography variant="h5" gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
            <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>Industry:</Typography> {job.industry_type && job.industry_type.toUpperCase().replace('_', " ")}
          </Typography>
          <Typography variant="h5" gutterBottom display='flex' flexDirection={isNonMobileScreen ? 'row' : 'column'} gap='5px' alignItems={isNonMobileScreen ? 'center' : undefined}>
            <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>{type === 'Project' ? 'Project Type' : 'Job Type'}:</Typography> {type === 'Project' ? job.project_type : job.job_type}
          </Typography>
          <Typography variant="h5" gutterBottom display='flex' gap='5px' flexDirection={isNonMobileScreen ? 'row' : 'column'} alignItems={isNonMobileScreen ? 'center' : undefined} sx={{ fontWeight: '600', fontSize: '16px' }}>
            {type === 'Hourly Job' ? 'Per Hour: ' : 'Salary: '} {type === 'Hourly Job' ? (<Box>
              <span span style={{ fontWeight: isNonMobileScreen ? '700' : '500', color: colors.grey[500] }}  >{job.min_hour_rate} Rs</span> - <span style={{ fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} > {job.max_hour_rate} Rs</span></Box>) : (<Box>
                <span span style={{ fontWeight: isNonMobileScreen ? '700' : '500', color: colors.grey[500] }}  >{job.min_salary} Rs</span> - <span style={{ fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} > {job.max_salary} Rs</span></Box>)}
          </Typography>
        </Grid>
        <Grid item xs={isNonMobileScreen ? 6 : 12}>
          <Typography variant="h4" sx={{ fontWeight: '600', fontSize: '18px' }}>Requirements</Typography>
          <Typography variant="h5" gutterBottom display='flex' gap='5px' flexDirection={isNonMobileScreen ? 'row' : 'column'} alignItems={isNonMobileScreen ? 'center' : undefined}>
            <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>Experience:</Typography> {job.requirement}
          </Typography>
          <Typography variant="h5" gutterBottom display='flex' gap='5px' alignItems='center'>
            <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>Skills Required:</Typography>
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: isNonMobileScreen ? 'row' : 'column', flexWrap: 'wrap' }}>
            {skills_req?.map((skill, index) => (
              <Chip key={index} label={skill} sx={{ mr: 1, mb: 1, fontSize: '13px' }} />
            ))}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {user && user.role != 'employer' && !hasApplied && (
        <Button variant="contained" color="primary" onClick={() => navigate(`/${variables.redirect}/${job.id}/application/create`)}>
          Apply Now
        </Button>
      )}

      {
        user && user.role == 'employee' && hasApplied && (
          <Typography variant='h3' textAlign='center' fontWeight='700' >You already Applied for this {type} </Typography>
        )
      }

      {user && user.role === 'employer' && (
        <Button variant="contained" color="primary" onClick={() => navigate(`/applications/${job.id}`)}>
          See Applications
        </Button>
      )}
    </Box>
  );
};

export default Details;
