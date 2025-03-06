import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, Sidebar, sidebarClasses } from 'react-pro-sidebar';
import { Box, Checkbox, FormControlLabel, FormLabel, IconButton, Typography, useMediaQuery } from '@mui/material';
import { tokens } from '../../theme';
import SidebarItem from '../../components/SidebarItem';
import { AssessmentSharp, AssignmentIndSharp, BadgeSharp, Dashboard, Diversity3Sharp, HistoryEduSharp, HomeSharp, MenuSharp, Person2Sharp, QueryStatsSharp, SearchSharp, TroubleshootSharp, WorkSharp } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../../redux/userReducers';
import FilterComp from '../../components/FilterComp';

const SidebarComp = () => {

  const colors = tokens();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, filter, active } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isNonMediumScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    setIsCollapsed(!isNonMediumScreen)
  }, [isNonMediumScreen])

  return (
    <Box
      sx={{
        zIndex: '120',
        "&": {
          background: `${colors.primary[500]} !important`,
          height: '100%'
        },
        "& .ps-sidebar-root": {
          border: 'none !important'
        },
        "& :hover": {
          backgroundColor: `${colors.primary[700]} !important`
        },
        "& .ps-menuitem-root": {
          color: `#fff`
        },
        "& .ps-menuitem-root:hover": {
          color: `${colors.grey[500]}`
        },
        "& .ps-active": {
          color: `${colors.orangeAccent[500]}`
        }
      }}
    >
      <Sidebar collapsed={isCollapsed}

        rootStyles={{
          [`&`]: {
            height: '100%'
          },
          [`.${sidebarClasses.container}`]: {
            backgroundColor: `${colors.primary[500]}`,
            height: '100vh'
          },
        }}

      >
        <Menu iconShape='square' >
          <MenuItem
            onClick={() => { setIsCollapsed(!isCollapsed) }}
            icon={isCollapsed ? <MenuSharp sx={{ color: '#fff' }} /> : undefined}
            style={{
              margin: '10px 0px 0px 0px',
              // color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display='flex' justifyContent='space-between' alignItems='center' ml="10px">
                <Link to='/' style={{ textDecoration: 'none' }} onClick={() => dispatch(set)} >
                  <Typography color='#fff' variant='h3' fontWeight='800' >Job Portal</Typography>
                </Link>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuSharp sx={{ color: '#fff' }} />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Box>
            {
              user && ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) &&
              <SidebarItem
                title={user && user.role === 'employer' ? 'Dashboard' : 'Performance'}
                to={user && user.role === 'employer' ? '/dashboard' : '/performance'}
                icon={user && user.role === 'employer' ? <Dashboard /> : <AssessmentSharp />}
                active={active}
                setActive={setActive}
              />
            }
            {
              user && user.role === 'employee' && (isNonMediumScreen && !filter) &&
              <SidebarItem title='Applications' to={`/applications/${user.id}`} icon={<HistoryEduSharp />} active={active} setActive={setActive} />
            }

            {!filter && isNonMediumScreen && <Typography color={colors.grey[100]} m='5px 15px' fontWeight='600'>Main portion</Typography>}
            <SidebarItem
              title='Home'
              to='/'
              icon={<HomeSharp />}
            />
            {!filter &&
              <SidebarItem
                title='Search'
                to='/search'
                icon={<SearchSharp />}
              />}
            {
              user && ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) &&
              <SidebarItem
                title='Profile'
                to='/profile'
                icon={<Person2Sharp />}
              />
            }
            {
              user && user.role === 'employer' && ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) && (
                <SidebarItem
                  title='My Jobs'
                  to='/myjobs'
                  icon={<Diversity3Sharp />}
                />
              )
            }
            {
              !filter &&
              <SidebarItem
                title='Jobs'
                to='/jobs'
                icon={<WorkSharp />}
              />}
            {
              user && user.role === 'employer' && ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) && (
                <SidebarItem
                  title='My Projects'
                  to='/myprojects'
                  icon={<TroubleshootSharp />}
                />
              )
            }
            {((isNonMediumScreen && !filter) || (!isNonMediumScreen)) &&
              <SidebarItem
                title='Project Based Jobs'
                to='/projects'
                icon={<QueryStatsSharp />}
              />}
            {
              user && user.role === 'employer' && ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) && (
                <SidebarItem
                  title='My Hourly Jobs'
                  to='/myhourlyjobs'
                  icon={<AssignmentIndSharp />}
                />
              )
            }
            {
              ((isNonMediumScreen && !filter) || (!isNonMediumScreen)) &&
              <SidebarItem
                title='Hourly Jobs'
                to='/hourlyjobs'
                icon={<BadgeSharp />}
              />
            }
          </Box>
        </Menu>
        {
          filter && isNonMediumScreen && <FilterComp />
        }
      </Sidebar>
    </Box >
  )
}

export default SidebarComp
