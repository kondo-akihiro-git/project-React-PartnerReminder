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

const Header: React.FC<HeaderProps> = ({
  handleMenuClick,
  handleMenuClose,
  menuOpen,
  handleUserSettings,
  handleLogout,
  anchorEl,
  userName,
}) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      justifyContent={{ xs: 'center', sm: 'space-between' }}  // スマホは中央寄せ、それ以外は左右に配置
      alignItems="center"
      mb={1}
    >
      <ButtonBase
        onClick={() => navigate('/meetings')}
        sx={{
          // スマホ時は中央配置になるので特別な調整は不要
          display: 'flex',
          justifyContent: 'center',
          width: {
            xs: '70vw',
            sm: '50vw',
            md: '35vw',
            lg: '30vw',
          },
        }}
      >
        <Box
          component="img"
          src={`${process.env.PUBLIC_URL}/images/pr_title.png`}
          alt="PartnerReminder"
          sx={{
            width: '100%',
            objectFit: 'contain',
          }}
        />
      </ButtonBase>

      <Stack
        direction="column"
        spacing={1}
        sx={{ flexBasis: '30%' }}
        alignItems="flex-end"
      >
        <Button
          variant="outlined"
          onClick={handleMenuClick}
          sx={{
            width: {
              xs: 'auto',
              sm: '24vw',
              md: '26vw',
              lg: '29vw',
            },
            minWidth: {
              xs: '40px',
            },
            px: {
              xs: 1,
              sm: 2,
            },

            textTransform: 'none',

            // --- ここから追加 ---
            borderColor: 'transparent', // ボーダーなし
            boxShadow: '0px 2px 5px rgba(0,0,0,0.2)', // 軽い影だけつける
            color: 'rgba(0,0,0,0.5)', // 薄いグレーの文字・アイコン色
            '&:hover': {
              borderColor: 'transparent',
              boxShadow: '0px 3px 7px rgba(0,0,0,0.3)',
              backgroundColor: 'rgba(0,0,0,0.05)',
            },
          }}
          color="inherit"
        >
          <SettingsIcon
            sx={{
              mr: { xs: 0, sm: '0.8vw' },
              color: 'rgba(0,0,0,0.5)', // アイコンも薄グレーに
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>設定</Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: {
                xs: 'fit-content',
                sm: '24vw',
                md: '26vw',
                lg: '29vw',
              },
              minWidth: {
                xs: '120px',
              },
            },
          }}
        >
          <MenuItem disabled sx={{ opacity: 1 }}>
            ユーザー：{userName} さん
          </MenuItem>
          <MenuItem onClick={handleUserSettings}>ユーザー設定</MenuItem>
          <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
};

export default Header;
