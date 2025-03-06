import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from '../home';
import Topbar from './Topbar';
import SidebarComp from './Sidebar';
import Jobs from '../jobs';
import MyJobs from '../jobs/myjobs.jsx';
import CreateJobs from '../jobs/create.jsx';
import UpdateJob from '../jobs/update.jsx';
import Projects from '../projects';
import MyProjects from '../projects/myprojects.jsx';
import CreateProjects from '../projects/create.jsx';
import HourlyJobs from '../hourlyjobs';
import MyHourlyJobs from '../hourlyjobs/myhourlyjobs.jsx';
import CreateHourlyJobs from '../hourlyjobs/create.jsx';
import { Box } from '@mui/system';
import { useSelector } from 'react-redux';
import Details from '../../components/Details.jsx';
import CreateApplication from '../application/create.jsx';
import EmployeeApplications from '../application/Employee.jsx';
import Application from '../application/index.jsx';
import EmployerApplications from '../application/Employer.jsx';
import Notifications from '../notifications';
import Search from '../search/index.jsx';
import Performance from '../performance';
import Profile from '../profile';
import Dashboard from '../dashboard/index.jsx';

const Main = () => {
  const { user } = useSelector(state => state.user);
  return (
    <div className='app' style={{ height: '100%', width: '100%' }} >
      <SidebarComp />
      <Topbar />
      <main className='content' style={{ height: '100%', overflowY: 'auto', width: '100%' }}>
        <Box mt='4rem'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/jobs' element={<Jobs />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/hourlyjobs' element={<HourlyJobs />} />
            <Route path='/job/:id' element={<Details type='Job' />} />
            <Route path='/project/:id' element={<Details type='Project' />} />
            <Route path='/hourlyJob/:id' element={<Details type='Hourly Job' />} />
            <Route path='/application/:id' element={<Application />} />
            <Route path='/search' element={<Search />} />
            {
              user && user.role === 'employee' && (
                <>
                  <Route path='/job/:id/application/create' element={<CreateApplication type='Job' />} />
                  <Route path='/project/:id/application/create' element={<CreateApplication type='Project' />} />
                  <Route path='/hourlyjob/:id/application/create' element={<CreateApplication type='Hourly_Job' />} />
                  <Route path='/applications/:id' element={<EmployeeApplications />} />
                  <Route path='/performance' element={<Performance />} />
                </>
              )
            }
          </Routes>
          {
            user && user.role === 'employer' && (
              <Routes>
                <Route path='/jobs/create' element={<CreateJobs />} />
                <Route path='/job/:id/update' element={<UpdateJob />} />
                <Route path='/projects/create' element={<CreateProjects />} />
                <Route path='/project/:id/update' element={<CreateProjects />} />
                <Route path='/hourlyjobs/create' element={<CreateHourlyJobs />} />
                <Route path='/hourlyJob/:id/update' element={<CreateHourlyJobs />} />
                <Route path='/myjobs' element={<MyJobs />} />
                <Route path='/myprojects' element={<MyProjects />} />
                <Route path='/myhourlyjobs' element={<MyHourlyJobs />} />
                <Route path='/applications/:id' element={<EmployerApplications />} />
                <Route path='/dashboard' element={<Dashboard />} />
              </Routes>
            )
          }
          {
            user &&
            <Routes>
              <Route path='/notifications' element={<Notifications />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          }
        </Box>
      </main>
    </div>
  )
}

export default Main
