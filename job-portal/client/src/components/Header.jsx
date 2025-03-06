import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { tokens } from '../theme';

const Header = ({ title, subtitle }) => {
  const colors = tokens();
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  return (
    <Box mt={isNonMediumScreen ? '75px' : '120px'} mb='15px'>
      <Typography variant={isNonMobileScreen ? 'h2' : 'h4'} color={colors.whiteAccent[800]} fontWeight='500' mb='5px'>{title}</Typography>
      <Typography variant={isNonMobileScreen ? 'h5' : 'body1'} color={colors.primary[400]}>{subtitle}</Typography>
    </Box >
  );
}

export default Header
