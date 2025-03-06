import React, { useEffect, useState } from 'react'
import { Box, Checkbox, FormControlLabel, FormLabel, IconButton, Typography, useMediaQuery } from '@mui/material';
import { Formik } from 'formik'
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FilterComp = ({ sidebar = true }) => {

  const { searchValues, filter } = useSelector((state) => state.user);
  const colors = tokens();
  const [searchData, setSearchData] = useState(searchValues);
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery('(min-width: 600px)');
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');
    const type = urlParams.get('type');
    const industry = urlParams.get('industry');
    const requirement = urlParams.get('requirement');
    const order = urlParams.get('order');
    const other = urlParams.get('other');

    if (keyword || type || industry || requirement || order || other) {
      setSearchData({
        keyword: keyword || '',
        type: type || 'all',
        industry: industry || '',
        requirement: requirement || 'Fresher',
        order: order || 'desc',
        other: other || 'Traditional',
      });
    }
  }, [window.location.search, filter, isNonMediumScreen]);

  const handleChange = (e, value) => {
    const updatedData = { ...searchData, [e.target.name]: value };
    setSearchData(updatedData);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('keyword', '');
    urlParams.set('type', updatedData.type);
    urlParams.set('industry', updatedData.industry);
    urlParams.set('requirement', updatedData.requirement);
    urlParams.set('order', updatedData.order);
    urlParams.set('other', updatedData.other);
    navigate(`/search?${urlParams.toString()}`);
  }

  let config = {};
  if (isNonMediumScreen && isNonMediumScreen) {
    config = {
      mainM: '1rem',
      grid: 2,
    }
  } else if (!isNonMediumScreen && isNonMobileScreen) {
    config = {
      mainM: '.7rem .4rem',
      grid: 4,
    }
  } else {
    config = {
      mainM: '.3rem',
      grid: 1,
    }
  }

  return (
    <Formik>
      {() => (
        <form style={{ margin: '0px' }} >
          <Box display='flex' flexDirection='column' p='5px' >
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.orangeAccent[500] }} >Type: </FormLabel>
            <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`} >
              <FormControlLabel
                control={<Checkbox checked={searchData.type === 'all'} onChange={(e) => handleChange(e, 'all')} name="type" id='all' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="All"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.type === 'Job'} onChange={(e) => handleChange(e, 'Job')} name="type" id='Job' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Job"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.type === 'Project'} onChange={(e) => handleChange(e, 'Project')} name="type" id='Project' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Project"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.type === 'Hourly Job'} onChange={(e) => handleChange(e, 'Hourly Job')} name="type" id='Hourly Job' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Hourly Job"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' p='5px'>
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.orangeAccent[500] }} >Industry Type: </FormLabel>
            <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`}>
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'it_software'} onChange={(e) => handleChange(e, 'it_software')} name="industry" id='it_software' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="IT / Software"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'finance'} onChange={(e) => handleChange(e, 'finance')} name="industry" id='finance' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Finance"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'construction'} onChange={(e) => handleChange(e, 'construction')} name="industry" id='construction' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Construction"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'transportation'} onChange={(e) => handleChange(e, 'transportation')} name="industry" id='transportation' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Transport"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'manufacturing'} onChange={(e) => handleChange(e, 'manufacturing')} name="industry" id='manufacturing' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Manufacturing"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'tourism'} onChange={(e) => handleChange(e, 'tourism')} name="industry" id='tourism' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Tourism"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'media_entertainment'} onChange={(e) => handleChange(e, 'media_entertainment')} name="industry" id='media_entertainment' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Media Entertainment"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.industry === 'education'} onChange={(e) => handleChange(e, 'education')} name="industry" id='education' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Education"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
            </Box>
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.orangeAccent[500] }} >Experience: </FormLabel>
            <Box display='grid' gridTemplateColumns={`repeat(${config.grid},1fr)`}>
              <FormControlLabel
                control={<Checkbox checked={searchData.requirement === 'Fresher'} onChange={(e) => handleChange(e, 'Fresher')} name="requirement" id='Fresher' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Fresher"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.requirement === '1-Year-Experience'} onChange={(e) => handleChange(e, '1-Year-Experience')} name="requirement" id='1-Year-Experience' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="1 Year"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.requirement === '5-Year-Experience'} onChange={(e) => handleChange(e, '5-Year-Experience')} name="requirement" id='5-Year-Experience' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="5 Years"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.requirement === '10-Year-Experience'} onChange={(e) => handleChange(e, '10-Year-Experience')} name="requirement" id='10-Year-Experience' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="10 Years"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
            </Box>
            <FormControlLabel
              control={<Checkbox checked={searchData.requirement === 'More-than-10-Year-Experience'} onChange={(e) => handleChange(e, 'More-than-10-Year-Experience')} name="requirement" id='More-than-10-Year-Experience' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
              label="More than 10 Years"
              sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
            />
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.orangeAccent[500] }} >Kind: </FormLabel>
            <Box display='grid' gridTemplateColumns={`repeat(${isNonMobileScreen ? 2 : 1},1fr)`}>
              <FormControlLabel
                control={<Checkbox checked={searchData.other === 'Traditional'} onChange={(e) => handleChange(e, 'Traditional')} name="other" id='Traditional' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Traditional"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.other === 'Remotely'} onChange={(e) => handleChange(e, 'Remotely')} name="other" id='Remotely' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Remotely"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
            </Box>
            <FormLabel sx={{ fontSize: '16px', fontWeight: 'bold', color: colors.orangeAccent[500] }} >Order: </FormLabel>
            <Box display='grid' gridTemplateColumns={`repeat(${isNonMobileScreen ? 2 : 1},1fr)`}>
              <FormControlLabel
                control={<Checkbox checked={searchData.order === 'desc'} onChange={(e) => handleChange(e, 'desc')} name="order" id='desc' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Latest"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
              <FormControlLabel
                control={<Checkbox checked={searchData.order === 'asc'} onChange={(e) => handleChange(e, 'asc')} name="order" id='asc' sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], "&.Mui-checked": { color: sidebar ? colors.whiteAccent[500] : colors.primary[500] } }} />}
                label="Oldest"
                sx={{ color: sidebar ? colors.whiteAccent[500] : colors.primary[500], m: '0' }}
              />
            </Box>
          </Box>
        </form>
      )}
    </Formik>

  )
}

export default FilterComp
