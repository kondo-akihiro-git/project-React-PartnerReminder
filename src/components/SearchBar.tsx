import { TextField, Stack, Typography, Box, Button, useMediaQuery, useTheme } from '@mui/material';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


interface SearchBarProps {
  filters: {
    title: string;
    location: string;
    date: string;
  };
  onChange: (field: string, value: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ filters, onChange, onClear }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm')); // 画面幅が大きい場合（sm以上）

  const customFormats = {
    keyboardDate: 'MM/DD', // 入力表示フォーマット
  };

  return (
    <Box mb={4}>
      <Typography variant="caption" sx={{ marginBottom: 2 }}>
        フィルタリング
      </Typography>

      {/* 画面幅が大きい場合のレイアウト */}
      {isLargeScreen ? (
        <Stack direction="row" spacing={2} width="100%" alignItems="stretch">
          <TextField
            label="タイトル"
            variant="outlined"
            size="small"
            value={filters.title}
            onChange={(e) => onChange('title', e.target.value)}
            sx={{ flex: 2 }}
          />
          <TextField
            label="場所"
            variant="outlined"
            size="small"
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            sx={{ flex: 1 }}
          />
          {/* <TextField
            label="日付"
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={(e) => onChange('date', e.target.value)}
            sx={{ flex: 1 }}
          /> */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
            <DatePicker
              label={'日付'}
              orientation='portrait'
              format="MM/DD"
              value={filters.date ? dayjs(filters.date) : null}
              onChange={(newValue) => {
                const formatted = newValue ? newValue.format('YYYY-MM-DD') : '';
                onChange('date', formatted);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { flex: 1 },  // 他のフィールドとバランスを取る
                },
              }}
            />
          </LocalizationProvider>

          <Button
            variant="outlined"
            color="inherit"
            onClick={onClear}
            sx={{
              height: 40,
              alignSelf: 'center', // 中央揃え
              px: 2,
              whiteSpace: 'nowrap',
            }}
          >
            クリア
          </Button>
        </Stack>
      ) : (
        // 画面幅が小さい場合のレイアウト
        <Stack spacing={2} width="100%" alignItems="stretch">
          {/* 1行目 - タイトル検索 */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <TextField
              label="タイトル"
              variant="outlined"
              size="small"
              value={filters.title}
              onChange={(e) => onChange('title', e.target.value)}
              sx={{ flex: 2 }}
            />
          </Stack>

          {/* 2行目 - 場所検索、日付検索、クリアボタン */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <TextField
              label="場所"
              variant="outlined"
              size="small"
              value={filters.location}
              onChange={(e) => onChange('location', e.target.value)}
              sx={{ flex: 1 }}
            />
            {/* <TextField
              label="日付"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.date}
              onChange={(e) => onChange('date', e.target.value)}
              sx={{ flex: 1 }}
            /> */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
            <DatePicker
              label={'日付'}
              orientation='portrait'
              format="MM/DD"
              value={filters.date ? dayjs(filters.date) : null}
              onChange={(newValue) => {
                const formatted = newValue ? newValue.format('YYYY-MM-DD') : '';
                onChange('date', formatted);
              }}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { flex: 1 },  // 他のフィールドとバランスを取る
                },
              }}
            />
          </LocalizationProvider>

            <Button
              variant="outlined"
              color="inherit"
              onClick={onClear}
              sx={{
                height: 40,
                alignSelf: 'center',
                px: 2,
                whiteSpace: 'nowrap',
              }}
            >
              クリア
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default SearchBar;
