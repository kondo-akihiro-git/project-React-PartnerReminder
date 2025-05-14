import { TextField, Stack, Typography, Box, Button, useMediaQuery, useTheme } from '@mui/material';

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
          <TextField
            label="日付"
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={(e) => onChange('date', e.target.value)}
            sx={{ flex: 1 }}
          />
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
            <TextField
              label="日付"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={filters.date}
              onChange={(e) => onChange('date', e.target.value)}
              sx={{ flex: 1 }}
            />
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
