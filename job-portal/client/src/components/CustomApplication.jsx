import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import { Box, ThemeProvider } from '@mui/joy';
import { useMediaQuery, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loadingComplete, setAlert, setLoading } from '../redux/userReducers';

const ApplicationCard = ({ application }) => {
  const theme = useTheme();
  const colors = tokens();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.user);

  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');
  let variables = {};
  if (application.applicationable_type == 'App\\Models\\Job') {
    variables = {
      type: 'Job'
    }
  }
  if (application.applicationable_type === "App\\Models\\Project") {
    variables = {
      type: 'Project'
    }
  }
  if (application.applicationable_type === "App\\Models\\HourlyJob") {
    variables = {
      type: 'Hourly Job'
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you really want to delete this application?')) {
      dispatch(setLoading());
      try {
        const response = await axios.delete(import.meta.env.VITE_SERVER_URL + `/api/application/${id}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          dispatch(setAlert({ type: 'success', message: response.data.message }));
          window.location.reload();
        } else {
          const payload = {
            type: 'error',
            message: response.data.error || 'Something went wrong please try later!'
          }
          dispatch(setAlert(payload));
          dispatch(loadingComplete());
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred. Please try again later.';
        const payload = {
          type: 'error',
          message: error.response?.data?.status === 401 ? "You can only delete your own Applications" : errorMessage,
        }
        dispatch(setAlert(payload));
      } finally {
        dispatch(loadingComplete());
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card
        variant="outlined"
        orientation={isNonMobileScreen ? "horizontal" : "vertical"}
        sx={{
          width: "100%",
          height: 'auto',
          '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
          cursor: 'pointer'
        }}
        onClick={() => navigate(`/application/${application.id}`)}
      >
        <AspectRatio ratio="1" sx={{ width: 90, height: '100%' }}>
          <img
            src={application.cv_path}
            alt=""
            height='100%'
          />
        </AspectRatio>
        <CardContent>
          <Typography level={(isNonMediumScreen || !isNonMobileScreen) ? "title-lg" : "body-md"} id="card-description">
            {application.name}
          </Typography>
          <Typography level={(isNonMediumScreen || !isNonMobileScreen) ? "title-md" : "body-sm"} sx={{ fontSize: '19px' }} aria-describedby="card-description" mb={1}>
            {variables.type}
          </Typography>
          <Typography level={(isNonMediumScreen || !isNonMobileScreen) ? "body-xs" : "body-sm"} aria-describedby="card-description" mb={1}>
            {application.status.toUpperCase()}
          </Typography>
          {
            user && user.role == 'employee' && (
              <Box width='65px' onClick={(e) => { e.stopPropagation(); handleDelete(application.id) }} >
                <Chip
                  variant="outlined"
                  color="danger"
                  size="md"
                  sx={{ pointerEvents: 'none' }}
                >
                  Delete
                </Chip>
              </Box>
            )
          }
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ApplicationCard;
