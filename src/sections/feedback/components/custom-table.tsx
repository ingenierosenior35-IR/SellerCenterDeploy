import {
  Box,
  Checkbox,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
  col6: number,
  col7: number,
  col8: number,
  col9: number
) {
  return { name, calories, fat, carbs, protein, col6, col7, col8, col9 };
}
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 1, 2, 3, 4),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 1, 2, 3, 4),
  createData('Eclair', 262, 16.0, 24, 6.0, 1, 2, 3, 4),
  createData('Cupcake', 305, 3.7, 67, 4.3, 1, 2, 3, 4),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1, 2, 3, 4),
];
export default function CustomTable() {
  const handleChangePage = (event: unknown, newPage: number) => {};
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ background: 'white' }}>
          <TableRow>
            <TableCell colSpan={12} sx={{ p: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TextField
                  variant="outlined"
                  sx={{
                    width: 'fit-content',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      px: 1,
                      bgcolor: 'background.paper',
                      minHeight: 44,
                      '& fieldset': {
                        borderColor: 'grey.300',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 1,
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.25,
                      px: 1,
                      fontSize: 14,
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'text.secondary',
                      opacity: 1,
                    },
                  }}
                  fullWidth
                  placeholder="sku, name, etc."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify
                            icon="eva:search-fill"
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              padding: '4px',
                              justifyContent: 'center',
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />{' '}
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={10}
                  page={0}
                  onPageChange={handleChangePage}
                />
              </Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="left">Image</TableCell>
            <TableCell align="left">Price range</TableCell>
            <TableCell align="left">Value range</TableCell>
            <TableCell align="left">Quality rating</TableCell>
            <TableCell align="left">Feed summary</TableCell>
            <TableCell align="left">Feed review</TableCell>
            <TableCell align="left">Customer name</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="left">Created at</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="left">{row.calories}</TableCell>
              <TableCell align="left">{row.fat}</TableCell>
              <TableCell align="left">{row.carbs}</TableCell>
              <TableCell align="left">{row.protein}</TableCell>
              <TableCell align="left">{row.col6}</TableCell>
              <TableCell align="left">{row.col7}</TableCell>
              <TableCell align="left">{row.col8}</TableCell>
              <TableCell align="left">{row.col9}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
