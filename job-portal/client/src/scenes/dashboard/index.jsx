import React, { useEffect, useState } from 'react'
import { Box, Typography, useMediaQuery } from '@mui/material'
import Header from '../../components/Header'
import { useSelector } from 'react-redux';
import axios from 'axios';
import BarChart from '../../components/BarChart';
import { tokens } from '../../theme';
import PieChartComp from '../../components/PieChart';
import LineChartComp from '../../components/LineChart';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const { token } = useSelector(state => state.user);
  const colors = tokens();
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [applicationStatusData, setApplicationStatusData] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [appliedApplications, setAppliedApplications] = useState([]);
  const [shortListedApplications, setShortListedApplications] = useState([]);
  const [firedApplications, setFiredApplications] = useState([]);
  const [hiredApplications, setHiredApplications] = useState([]);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/dashboard-data', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data.data) {
        const barChartData = Object.values(response.data.data).map(industry => ({
          Industry: industry.industry,
          Jobs: industry.jobs,
          Projects: industry.projects,
          "Hourly Jobs": industry.hourlyJobs,
        }));
        setData(barChartData);
        let pieChartData = [
          { id: 'Total Jobs', label: 'Jobs', value: response.data.total_jobs, color: "hsl(10, 90%, 60%)" },
          { id: 'Total Projects', label: 'Projects', value: response.data.total_projects, color: 'hsl(229, 70%, 50%)' },
          { id: 'Total Hourly Jobs', label: 'Hourly Jobs', value: response.data.total_hourly_jobs, color: "hsl(97, 70%, 50%)" },
        ];
        setPieData(pieChartData);
        setLineData(response.data.applicationsCounter);
        setApplicationStatusData(response.data.applicationsStatus);
        formatedData(response.data.applicationsStatus);
      }
    }
    fetch();
  }, []);

  const getColors = (id) => {
    if (id === 'it_software')
      return '#0C2D57';
    else if (id === 'finance')
      return '#FC6736';
    else if (id === 'health')
      return '#6420AA';
    else if (id === 'education')
      return '#D63484';
    else if (id === 'manufacturing')
      return '#402B3A';
    else if (id === 'retail')
      return 'hsl(208, 70%, 50%)';
    else if (id === 'construction')
      return 'hsl(162, 70%, 50%)';
    else if (id === 'tourism')
      return 'hsl(76, 70%, 50%)';
    else if (id === 'transportation')
      return 'hsl(257, 70%, 50%)';
    else if (id === 'media_entertainment')
      return '#0F0F0F';
  }

  const formatedData = (data) => {
    setAppliedApplications(Object.values(data.applied).map(industry => ({
      id: industry.id,
      label: industry.label,
      value: industry.value,
      color: getColors(industry.id),
    })));

    setRejectedApplications(Object.values(data.rejected).map(industry => ({
      id: industry.id,
      label: industry.label,
      value: industry.value,
      color: getColors(industry.id),
    })));

    setShortListedApplications(Object.values(data.shortListed).map(industry => ({
      id: industry.id,
      label: industry.label,
      value: industry.value,
      color: getColors(industry.id),
    })));

    setHiredApplications(Object.values(data.hired).map(industry => ({
      id: industry.id,
      label: industry.label,
      value: industry.value,
      color: getColors(industry.id),
    })));

    setFiredApplications(Object.values(data.fired).map(industry => ({
      id: industry.id,
      label: industry.label,
      value: industry.value,
      color: getColors(industry.id),
    })));
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
    <Box m={config.manM} height='100%' >
      <Header title='Dashboard' />
      <Box display='grid'
        gridTemplateColumns='repeat(12,1fr)'
        gridAutoRows='140px'
        gap='1rem'
        gridRow={'auto'}
        sx={{ background: colors.primary[500], p: config.mainM }}
      >
        <Box sx={{ gridColumn: 'span 12', gridRow: 'span 2', width: '100%', height: '300px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Records Index By Industry</Typography>
          <Box height='250px' mt='-1rem' >
            <BarChart data={data} role='employer' />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 2', width: '100%', height: '270px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', mt: '10px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Total Records Index By Type</Typography>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='center' >
            <PieChartComp data={pieData} cx={90} cy={110} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 8' : 'span 12', gridRow: 'span 2', width: '100%', height: '270px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', mt: '10px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Total Applications Index By Industry</Typography>
          <Box height='250px' mt='-20px' ml='-30px' >
            <LineChartComp data={lineData} additionData={{ bottom: 'Applications', left: 'Industry' }} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 2', width: '100%', height: '310px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Applied Applications</Typography>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='center' >
            <PieChartComp data={appliedApplications} height='400' width='450' cx={90} cy={110} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 2', width: '100%', height: '310px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Rejected Applications</Typography>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='center' >
            <PieChartComp data={rejectedApplications} height='400' width='450' cx={90} cy={110} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 2', width: '100%', height: '310px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Short Listed Applications</Typography>
          <Box display='flex' position='relative' width='100%' height='85%' alignItems='center' >
            <PieChartComp data={shortListedApplications} height='400' width='450' cx={90} cy={110} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 3', width: '100%', height: '310px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', m: '20px 0px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Hired Applications</Typography>
          <Box height='450px' mt='-30px' ml='-60px' >
            <PieChartComp data={hiredApplications} height='400' width='450' cx={90} cy={110} />
          </Box>
        </Box>
        <Box sx={{ gridColumn: isNonMediumScreen ? 'span 4' : 'span 12', gridRow: 'span 3', width: '100%', height: '310px', p: '5px', background: colors.whiteAccent[500], borderRadius: '5px', m: '20px 0px' }} >
          <Typography variant={isNonMobileScreen ? 'h3' : 'h5'} color='secondary' fontWeight='700'>Fired Applications</Typography>
          <Box height='450px' mt='-30px' ml='-60px' >
            <PieChartComp data={firedApplications} height='400' width='450' cx={90} cy={110} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard
