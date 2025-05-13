import { Stack, Button, Menu, MenuItem, ButtonBase, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  handleMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuClose: () => void;
  menuOpen: boolean;
  handleUserSettings: () => void;
  handleLogout: () => void;
  anchorEl: HTMLElement | null;
}


const Header: React.FC<HeaderProps> = ({ handleMenuClick, handleMenuClose, menuOpen, handleUserSettings, handleLogout, anchorEl }) => {
  const navigate = useNavigate();
    return(
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
    <ButtonBase>
      <Typography variant="h4" sx={{ fontFamily: 'serif' }} onClick={() => navigate('/')}>
        PartnerReminder
      </Typography>
    </ButtonBase>
    <Stack direction="column" spacing={1} sx={{ flexBasis: '30%' }} alignItems="flex-end">
      <Button onClick={handleMenuClick} sx={{ minWidth: 120, maxWidth: 200, textTransform: 'none' }} color="inherit">
        <SettingsIcon sx={{ mr: 0.5 }} />
        ユーザー設定
      </Button>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={handleUserSettings}>ユーザー設定</MenuItem>
        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
      </Menu>
    </Stack>
  </Stack>
);
};

export default Header;
