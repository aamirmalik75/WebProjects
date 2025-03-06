import React, { useEffect, useState } from 'react'
import { Box, Rating, Stack, Typography, useMediaQuery } from '@mui/material'
import Header from '../../components/Header'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { tokens } from '../../theme'
import BarChart from '../../components/BarChart'
import PieChart from '../../components/PieChart'
import { useNavigate } from 'react-router-dom';

const Performance = () => {
  const { token } = useSelector(state => state.user);
  const [data, setData] = useState([]);
  const [applications, setApplications] = useState([]);
  const colors = tokens();
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + `/api/rating/show/ratingEmployee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      if (response.data.success) {
        const ratings = response.data.ratings.map(rating => {
          // Find the corresponding application for the rating
          const application = response.data.applications.find(app => app.id === parseInt(rating.application_id));
          // Merge application data into rating object
          return {
            ...rating,
            application_title: application.applicationable.title,
            application_rating: rating.rating,
          };
        });
        setData(ratings);
        setApplications(response.data.applications);
      }
    }
    fetch();
  }, []);

  const pieChartColor = {
    "rejected": 'hsl(10, 90%, 60%)',
    "applied": 'hsl(291, 70%, 50%)',
    "shortListed": 'hsl(229, 70%, 50%)',
    "hired": 'hsl(104, 70%, 50%)',
    "fired": 'hsl(350, 70%, 50%)'
  }

  const statusCounts = data.reduce((counts, application) => {
    const status = application.status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  const pieChartData = Object.keys(statusCounts).map(status => ({
    id: status,
    label: status,
    value: statusCounts[status],
    color: pieChartColor[status],
  }));

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
    <Box m={config.mainM} sx={{ height: '100vh' }} >
      <Header title='Employee Performance' />
      <Box display='grid'
        gridTemplateColumns='repeat(12,1fr)'
        gridAutoRows='130px'
        gap='20px'
        sx={{ background: colors.primary[500], height: 'auto', p: '10px' }}
      >
        <Box sx={{ gridColumn: 'span 12', gridRow: 'span 2', width: '100%', height: '300px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Rating On Applications</Typography>
          <Box height='250px' >
            <BarChart data={data} role='employee' />
          </Box>
        </Box>
        <Box sx={{ m: '10px 0px', gridColumn: isNonMediumScreen ? 'span 8' : 'span 12', gridRow: 'span 2', width: '100%', height: '270px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', overflow: 'auto' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700' m='9px 0px' >Applications Details</Typography>
          {applications?.map((application) => (
            <Box onClick={() => navigate(`/application/${application.id}`)} key={application.id} width='100%' sx={{ background: colors.primary[500], m: '5px 0px', borderRadius: '4px', p: '7px', cursor: 'pointer' }} >
              <Typography variant={isNonMobileScreen ? 'h4' : 'h5'} fontWeight='600' sx={{ color: colors.whiteAccent[500] }} >{application.applicationable.title}</Typography>
              <Typography variant={isNonMobileScreen ? 'h5' : 'h6'} sx={{ color: colors.whiteAccent[500], display: 'flex', gap: '5px' }} >
                Status: <Typography fontWeight='500'>{application.status}</Typography>
              </Typography>
              <Typography variant={isNonMobileScreen ? 'h5' : 'h6'} sx={{ color: colors.whiteAccent[500], display: 'flex', gap: '5px' }} >
                Employer: <Typography fontWeight='500' color='secondary' >{application.applicationable.employer.name}</Typography>
              </Typography>
              {application.rating.length > 0 &&
                <Typography variant={isNonMobileScreen ? 'h4' : 'h5'} sx={{ color: colors.grey[200] }} fontWeight='700' m='9px 0px' >Feedback by Employer "{application.applicationable.employer.name}"</Typography>
              }
              {application.rating?.map((ra) => (
                <>
                  <Stack spacing={1} >
                    <Rating defaultValue={ra.rating} readOnly />
                  </Stack>
                  <Typography variant={isNonMobileScreen ? 'h5' : 'h6'} sx={{ color: colors.whiteAccent[500], display: 'flex', flexDirection: isNonMobileScreen ? 'row' : 'column', gap: isNonMobileScreen ? '5px' : '2px' }} >Comment: <Typography fontWeight='500' sx={{ color: colors.whiteAccent[400] }} >{ra.comment}</Typography>
                  </Typography>
                </>
              ))}
            </Box>
          ))}
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 2', width: '100%', height: '270px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', m: '10px 0px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Status Of Applications</Typography>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='center' >
            <PieChart data={pieChartData} cx={90} cy={110} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Performance
