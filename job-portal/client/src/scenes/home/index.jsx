import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { tokens } from '../../theme'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import CustomCard from '../../components/CustomCard';

const Home = () => {
  const colors = tokens();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [hourlyjobs, setHoulyjobs] = useState([]);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      heroHFS: '3rem',
      latestFS: '2.5rem',
      latestP: '1.7rem',
      grid: 3,
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      heroHFS: '2rem',
      latestFS: '2.5rem',
      latestP: '1.7rem',
      grid: 2,
    }
  } else {
    config = {
      heroHFS: '1.5rem',
      latestFS: '1.5rem',
      latestP: '.3rem',
      grid: 1,
    }
  }

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/job/homepage');
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    }
    fetchJobs();

    const fetchProjects = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/project/homepage');
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    }
    fetchProjects();

    const fetchHourlyJobs = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/hourlyJob/homepage');
      if (response.data.success) {
        setHoulyjobs(response.data.hourlyjobs);
      }
    }
    fetchHourlyJobs();
  }, []);

  return (
    <Box width='100%' height='100vh' position='relative'>
      <Box
        sx={{
          backgroundImage: `url('https://c0.wallpaperflare.com/preview/644/684/1003/career-path-choices-organization.jpg')`,
          backgroundSize: 'obtain',
          minHeight: isNonMediumScreen ? '60vh' : '50vh',
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
          color: colors.orangeAccent[500],
        }}
      >
        <Box textAlign='center' zIndex='30'>
          <Typography variant='h1' mt='50px' fontSize={config.heroHFS} fontWeight='800' >Welcome to our Job Portal</Typography>
          <Typography variant={isNonMediumScreen ? 'h2' : 'h4'} textAlign='center' mt='10px' fontWeight='700' color={colors.primary[600]}>Find your Dream Job with us</Typography>
          {
            !user && <Button variant='contained' color='secondary' sx={{ m: '10px auto' }} onClick={() => navigate('/sign-in')} >Sign in</Button>
          }

        </Box>
      </Box>

      <Box sx={{ width: '100%', p: config.latestP }}>
        <Typography variant='h2' fontSize={config.latestFS} mb='5px' fontWeight="700" color='secondary'>Latest Jobs</Typography>
        <Typography sx={{ mb: '10px', ml: '5px', textDecoration: 'underline', cursor: 'pointer', width: '70px' }} onClick={() => navigate('/jobs')} title='See More Jobs' variant={isNonMobileScreen ? 'h5' : 'h6'} >See More</Typography>
        <Box display='grid' width='100%' gridTemplateColumns={`repeat(${config.grid},1fr)`} gap='10px'>
          {jobs?.map((job) => (
            <CustomCard key={job.id} job={job} type='Job' />
          ))}
        </Box>
        {jobs.length === 0 && (
          <Box>
            <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Job Found</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ width: '100%', p: config.latestP }}>
        <Typography variant='h2' fontSize={config.latestFS} mb='5px' fontWeight="700" color='secondary'>Latest Projects</Typography>
        <Typography sx={{ mb: '10px', ml: '5px', textDecoration: 'underline', cursor: 'pointer', width: '70px' }} onClick={() => navigate('/projects')} title='See More Projects' variant={isNonMobileScreen ? 'h5' : 'h6'} >See More</Typography>
        <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`} gap='10px'>
          {projects?.map((project) => (
            <CustomCard key={project.id} job={project} type='Project' />
          ))}
        </Box>
        {projects.length === 0 && (
          <Box>
            <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Project Found</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ width: '100%', p: config.latestP }}>
        <Typography variant='h2' fontSize={config.latestFS} mb='5px' fontWeight="700" color='secondary'>Latest Hourly Jobs</Typography>
        <Typography sx={{ mb: '10px', ml: '5px', textDecoration: 'underline', cursor: 'pointer', width: '70px' }} onClick={() => navigate('/hourlyjobs')} title='See More Hourly Jobs' variant={isNonMobileScreen ? 'h5' : 'h6'} >See More</Typography>
        <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`} gap='10px'>
          {hourlyjobs?.map((job) => (
            <CustomCard key={job.id} job={job} type='Hourly Job' />
          ))}
        </Box>
        {hourlyjobs.length === 0 && (
          <Box>
            <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} textAlign='center' color='error'>Not Any Hourly Job Found</Typography>
          </Box>
        )}
      </Box>

    </Box>
  )
}

export default Home
