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
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
      <ButtonBase onClick={() => navigate('/')}>
        <img
          src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
          alt="PartnerReminder"
          style={{ width: '30vw', objectFit: 'contain' }}
        />
      </ButtonBase>
      <Stack direction="column" spacing={1} sx={{ flexBasis: '30%' }} alignItems="flex-end">
        <Button
          variant='outlined'
          onClick={handleMenuClick}
          sx={{
            width: '20vw',   // 最小幅を20%に

            textTransform: 'none',

          }}
          color="inherit"
        >
          <SettingsIcon sx={{ mr: '0.8vw' }} />
          ユーザー設定
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: '20vw',   // 最小幅を20%に
              // メニュー内のフォントサイズも調整
            },
          }}
        >
          <MenuItem onClick={handleUserSettings}>ユーザー設定</MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
};

export default Header;
