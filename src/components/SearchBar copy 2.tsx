import { TextField, Stack, Typography, Box, Button } from '@mui/material';

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
  return (
    <Box mb={4}>
      <Typography variant="caption" sx={{ marginBottom: 2 }}>
        フィルタリング
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        width="100%"
        alignItems="stretch"
      >
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
            alignSelf: 'center', // 中央揃え（Stack が stretch の場合、center でもOK）
            px: 2,
            whiteSpace: 'nowrap',
          }}
        >
          クリア
        </Button>
      </Stack>
    </Box>
  );
};

export default SearchBar;
