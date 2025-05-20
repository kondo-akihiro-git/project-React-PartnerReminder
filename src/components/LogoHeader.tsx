import { Stack, Button, Menu, MenuItem, ButtonBase, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  handleMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMenuClose: () => void;
  menuOpen: boolean;
  handleUserSettings: () => void;
  handleLogout: () => void;
  anchorEl: HTMLElement | null;
  userName: string;
}


const Header: React.FC<HeaderProps> = ({ handleMenuClick, handleMenuClose, menuOpen, handleUserSettings, handleLogout, anchorEl,userName }) => {
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
              xs: '45vw', 
              sm: '40vw', 
              md: '35vw', 
              lg: '30vw', 
            },
            objectFit: 'contain',
          }}
        />
      </ButtonBase>
      <Stack direction="column" spacing={1} sx={{ flexBasis: '30%' }} alignItems="flex-end">
        <Box sx={{ mb: 0.5}}>ユーザー：{userName}</Box>
        <Button
          variant='outlined'
          onClick={handleMenuClick}
          sx={{
            width: {
              xs: '35vw',
              sm: '33vw', 
              md: '31vw', 
              lg: '29vw', 
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
              xs: '35vw', 
              sm: '33vw', 
              md: '31vw', 
              lg: '29vw', 
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
