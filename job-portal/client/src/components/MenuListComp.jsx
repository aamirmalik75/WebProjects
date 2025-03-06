import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { tokens } from '../theme';

const ITEM_HEIGHT = 48;

const MenuListComp = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const colors = tokens();

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon sx={{ color: 'white' }} />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
            display: 'grid',
            gap: '5px',
            backgroundColor: colors.primary[500]
          },
        }}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            onClick: () => {
              handleClose();
              if (child.props.onClick) {
                child.props.onClick();
              }
            },
          })
        )}
      </Menu>
    </div>
  );
}

export default MenuListComp;
