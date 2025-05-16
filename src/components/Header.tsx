import { Stack, Button, Menu, MenuItem, ButtonBase, Typography, Box } from '@mui/material';
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
      <ButtonBase onClick={() => navigate('/meetings')}>
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
          alt="PartnerReminder"
          sx={{
            width: {
              xs: '45vw', // スマホなどの狭い画面：80vw
              sm: '40vw', // タブレット程度：60vw
              md: '35vw', // 中サイズ以上：40vw
              lg: '30vw', // 広い画面：30vw
            },
            objectFit: 'contain',
          }}
        />
      </ButtonBase>
      <Stack direction="column" spacing={1} sx={{ flexBasis: '30%' }} alignItems="flex-end">
        <Button
          variant='outlined'
          onClick={handleMenuClick}
          sx={{
            width: {
              xs: '35vw', // スマホなどの狭い画面：80vw
              sm: '33vw', // タブレット程度：60vw
              md: '31vw', // 中サイズ以上：40vw
              lg: '29vw', // 広い画面：30vw
            },

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
              width: {
              xs: '35vw', // スマホなどの狭い画面：80vw
              sm: '33vw', // タブレット程度：60vw
              md: '31vw', // 中サイズ以上：40vw
              lg: '29vw', // 広い画面：30vw
              },
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
