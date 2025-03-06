import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import { Route, Routes } from 'react-router-dom';
import SignUp from './scenes/signup';
import SignIn from './scenes/signin';
import { useSelector } from 'react-redux';
import Main from './scenes/global';
import CustomAlert from './components/CustomAlert';
import { Home } from '@mui/icons-material';
import Jobs from './scenes/jobs';
import Projects from './scenes/projects';
import HourlyJobs from './scenes/hourlyjobs';
import Details from './components/Details';

const App = () => {
  const { alert } = useSelector(state => state.user);

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <div className='app' style={{ height: '100%' }}>
        <Routes>
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path="/*" element={<Main />} />
        </Routes>
        {alert && <CustomAlert />}
      </div>
    </ThemeProvider>
  )
}

export default App
