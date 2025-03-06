import React from 'react'
import { Link } from 'react-router-dom';
import { tokens } from '../theme';
import { Typography } from '@mui/material';
import { MenuItem } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { setActive } from '../redux/userReducers';

const SidebarItem = ({ title, icon, to }) => {
  const colors = tokens();
  const dispatch = useDispatch();
  const { active } = useSelector(state => state.user);

  return (
    <MenuItem
      active={active === title}
      onClick={() => dispatch(setActive(title))}
      icon={icon}
      color={colors.grey[100]}
      component={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  )
}

export default SidebarItem
