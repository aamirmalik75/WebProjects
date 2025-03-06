import { useEffect, useState } from 'react';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/material/Typography';
import { Sheet, ThemeProvider } from '@mui/joy';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { loadingComplete, setAlert, setLoading } from '../../redux/userReducers';
import axios from 'axios';

export default function Profile() {
  const theme = useTheme();
  const colors = tokens();
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(state => state.user);
  const [information, setInformation] = useState([]);

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    const fetch = async () => {
      dispatch(setLoading());
      try {
        const response = await axios.get(import.meta.env.VITE_SERVER_URL + '/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          setInformation(response.data.data);
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
          message: error.response?.data?.status === 401 ? "You can only retrieve your data" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
    fetch();
  }, []);

  let config = {};
  if (isNonMobileScreen && isNonMediumScreen) {
    config = {
      width: '50%'
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      width: '70%'
    }
  } else {
    config = {
      width: '95%'
    }
  }

  return (
    <ThemeProvider theme={theme} >
      {!loading &&
        <Card
          sx={{
            width: config.width,
            maxWidth: '100%',
            boxShadow: 'lg',
            m: '120px auto'
          }}
        >
          <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '4rem' }} />
            <Chip
              size="sm"
              variant="soft"
              sx={{
                mb: 1,
                p: '4px',
                border: '2px solid',
                borderColor: 'background.surface',
                backgroundColor: colors.orangeAccent[500],
                color: colors.whiteAccent[500]
              }}
            >
              {user.role.toUpperCase()}
            </Chip>
            <Typography variant={isNonMobileScreen ? 'h2' : 'h5'} sx={{ color: colors.primary[500], fontWeight: isNonMobileScreen ? '700' : '500' }} >{user.name}</Typography>
            <Typography variant={isNonMobileScreen ? 'h3' : 'h6'}>
              {user.email}
            </Typography>
            <Sheet
              sx={{
                bgcolor: colors.orangeAccent[500],
                borderRadius: 'sm',
                color: colors.whiteAccent[500],
                p: isNonMobileScreen ? 1.5 : .5,
                my: 1.5,
                display: 'flex',
                flexDirection: isNonMobileScreen ? 'row' : 'column',
                width: isNonMobileScreen ? '90%' : '100%',
                gap: 2,
                '& > div': { flex: 1 },
              }}
            >
              <div>
                <Typography variant='h6' fontWeight="lg">
                  {user && user.role === 'employer' ? 'Jobs' : 'Applications'}
                </Typography>
                <Typography fontWeight="lg"  >{user && user.role === 'employer' ? information.jobs : information.applications}</Typography>
              </div>
              <div>
                <Typography variant='h6' fontWeight="lg">
                  {user && user.role === 'employer' ? 'Projects' : 'Applied'}
                </Typography>
                <Typography fontWeight="lg">{user && user.role === 'employer' ? information.projects : information.applied}</Typography>
              </div>
              <div>
                <Typography variant='h6' fontWeight="lg">
                  {user && user.role === 'employer' ? 'Hourly Jobs' : 'Rejected'}
                </Typography>
                <Typography fontWeight="lg">{user && user.role === 'employer' ? information.hourlyJobs : information.rejected}</Typography>
              </div>
            </Sheet>
            {
              user && user.role === 'employee' &&
              <Sheet
                sx={{
                  bgcolor: colors.orangeAccent[500],
                  borderRadius: 'sm',
                  color: colors.whiteAccent[500],
                  p: isNonMobileScreen ? 1.5 : .5,
                  my: 1.5,
                  display: 'flex',
                  flexDirection: isNonMobileScreen ? 'row' : 'column',
                  width: isNonMobileScreen ? '90%' : '100%',
                  gap: 2,
                  '& > div': { flex: 1 },
                }}
              >
                <div>
                  <Typography variant='h6' fontWeight="lg">
                    {user && user.role === 'employee' && 'Short Listed'}
                  </Typography>
                  <Typography fontWeight="lg">{information.shortListed}</Typography>
                </div>
                <div>
                  <Typography variant='h6' fontWeight="lg">
                    {user && user.role === 'employee' && 'Hired'}
                  </Typography>
                  <Typography fontWeight="lg">{information.hired}</Typography>
                </div>
                <div>
                  <Typography variant='h6' fontWeight="lg">
                    {user && user.role === 'employee' && 'Fired'}
                  </Typography>
                  <Typography fontWeight="lg">{information.fired}</Typography>
                </div>
              </Sheet>
            }
          </CardContent>
        </Card>
      }
      <Box display='flex' alignItems='center' justifyContent='center' mt='80px' >
        {loading &&
          (
            <CircularProgress color='secondary' />
          )
        }
      </Box>
    </ThemeProvider >
  );
}
