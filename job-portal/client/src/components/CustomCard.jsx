import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { AccountBalanceSharp, BackupSharp, CommuteSharp, EngineeringSharp, FactorySharp, HealthAndSafetySharp, HikingSharp, LiveTvSharp, SchoolSharp, StorefrontSharp, WorkOff } from '@mui/icons-material';
import { ThemeProvider } from '@mui/joy';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers';
import axios from 'axios';
import { useMediaQuery } from '@mui/material';

const CustomCard = ({ job, type, employer = false }) => {
  const colors = tokens();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  let variables = {};
  if (type === 'Job') {
    variables = {
      redirect: 'myjobs',
      prefix: 'job',
    }
  }
  if (type === 'Project') {
    variables = {
      redirect: 'myprojects',
      prefix: 'project',
    }
  }
  if (type === 'Hourly Job') {
    variables = {
      redirect: 'myhourlyjobs',
      prefix: 'hourlyJob',
    }
  }

  const handleDelete = async () => {
    if (confirm(`Are You want to delete this ${type}?`)) {
      dispatch(setLoading());
      try {
        const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/${variables.prefix}/${job.id}/delete`, {
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
          message: error.response?.data?.status === 401 ? `You can only delete your own ${type}` : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  const iconMapping = {
    it_software: BackupSharp,
    finance: AccountBalanceSharp,
    health: HealthAndSafetySharp,
    education: SchoolSharp,
    manufacturing: FactorySharp,
    retail: StorefrontSharp,
    construction: EngineeringSharp,
    tourism: HikingSharp,
    transportation: CommuteSharp,
    media_entertainment: LiveTvSharp
  }

  const IconComponent = iconMapping[job.industry_type] || WorkOff;
  return (
    <ThemeProvider >
      <Card
        data-resizable
        sx={{
          textAlign: 'center',
          alignItems: 'center',
          width: isNonMediumScreen ? 340 : '100%',
          overflow: 'auto',
          '--icon-size': '70px',
          background: colors.whiteAccent[600]
        }}
      >
        <CardOverflow variant="solid" sx={{ display: 'flex', background: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }}>
          <AspectRatio
            variant="outlined"
            ratio="1"
            sx={{
              m: 'auto',
              transform: 'translateY(50%)',
              borderRadius: '50%',
              width: 'var(--icon-size)',
              boxShadow: 'sm',
              bgcolor: 'background.surface',
              position: 'relative',
            }}
          >
            <div>
              <IconComponent sx={{ fontSize: '3rem', color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} />
            </div>
          </AspectRatio>
        </CardOverflow>
        <Typography level="title-lg" sx={{ mt: 'calc(var(--icon-size) / 2)', color: type === 'Project' ? colors.redAccent[500] : colors.primary[500], fontWeight: '700' }}>
          {job.title}
        </Typography>
        <CardContent sx={{ padding: '0', width: '100%' }}>
          <Typography variant={'h3'} sx={{ fontSize: '17px', textAlign: 'left', fontWeight: 600, color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} >
            Description:  <span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} >{job.description}</span>
          </Typography>
          <Typography variant='h3' sx={{ fontSize: '17px', textAlign: 'left', fontWeight: 600, color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} >
            Industry Type:  <span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} >{job.industry_type.toUpperCase().replace('_', " ")}</span>
          </Typography>
          <Typography variant='h3' sx={{ fontSize: '17px', textAlign: 'left', fontWeight: 600, color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} >
            Company:  <span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} >{job.company}</span>
          </Typography>
          <Typography variant='h3' sx={{ fontSize: '17px', textAlign: 'left', fontWeight: 600, color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} >
            Location:  <span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} >{job.location}</span>
          </Typography>
          <Typography sx={{ fontSize: '17px', textAlign: 'left', fontWeight: 600, color: type === 'Project' ? colors.redAccent[500] : colors.primary[500] }} >
            {type === 'Hourly Job' ? 'Per Hour: ' : 'Salary: '} {type === 'Hourly Job' ? (<>
              <span span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', color: colors.grey[500] }}  >{job.min_hour_rate} Rs</span> - <span style={{ display: isNonMobileScreen ? undefined : 'block', fontWeight: isNonMobileScreen ? '700' : '500', marginRight: '10px', color: colors.grey[500] }} > {job.max_hour_rate} Rs</span></>) : (<>
                <span span style={{ fontWeight: '700', color: colors.grey[500] }}  >{job.min_salary} Rs</span> - <span style={{ fontWeight: '700', marginRight: '10px', color: colors.grey[500] }} > {job.max_salary} Rs</span></>)}

          </Typography>
        </CardContent>
        <CardActions
          orientation="horizontal"
          buttonFlex={1}
          sx={{
            '--Button-radius': '40px',
            width: '100%',
            display: 'flex',
            flexDirection: isNonMobileScreen ? 'row' : 'column',
            justifyContent: 'space-between'
          }}
        >
          <Button variant="solid" sx={{ width: isNonMobileScreen ? undefined : '100%', background: type === 'Project' ? colors.redAccent[500] : colors.primary[500], "&:hover": { background: type === 'Project' ? colors.redAccent[400] : colors.primary[400] } }} onClick={() => { navigate(`/${variables.prefix}/${job.id}`) }}>
            Details
          </Button>
          {user && user.id == job.employer_id && employer && (
            <>
              <Button onClick={handleDelete} sx={{ width: isNonMobileScreen ? undefined : '100%', background: colors.redAccent[500], "&:hover": { background: colors.redAccent[400] } }} >Delete</Button>
              <Button onClick={() => navigate(`/${variables.prefix}/${job.id}/update`)} sx={{ width: isNonMobileScreen ? undefined : '100%', background: colors.primary[500], "&:hover": { background: colors.primary[400] } }} >Update</Button>
            </>
          )}
        </CardActions>
      </Card>
    </ThemeProvider >
  );
}

export default CustomCard;
