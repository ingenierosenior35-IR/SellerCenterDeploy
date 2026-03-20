import { useState } from 'react';

import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  tableCellClasses,
} from '@mui/material';

import { ErrorChip } from 'src/components/error-chip';
import { ConfirmDialog } from 'src/components/custom-dialog';

// import { ErrorChip, ConfirmDialog } from 'src/components';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const CsvErrorsAlert = ({ csvFile, csvErrors }: { csvFile: File | null; csvErrors: string[] }) => {
  const [open, setOpen] = useState(false);

  if (!csvFile || !csvErrors || csvErrors.length === 0) return null;

  return (
    <>
      <Alert severity="error" variant="outlined">
        <Typography variant="h6" sx={{ mr: 1 }}>
          Errores en el archivo CSV:
        </Typography>
        <ErrorChip count={csvErrors.length ?? 0} onClick={() => setOpen(true)} />
      </Alert>

      {!!csvFile || csvErrors.length > 0 ? (
        <ConfirmDialog
          action={null}
          maxWidth="sm"
          onClose={() => setOpen(false)}
          open={open}
          title="Errores detectados en el archivo CSV"
          content={
            <>
              <Typography variant="body2">
                Se encontraron los siguientes errores en el archivo CSV.
              </Typography>

              <Typography variant="body2" gutterBottom>
                Por favor revisa y corrige antes de continuar.
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" sx={{ mt: 1 }}>
                  <TableBody>
                    {csvErrors.map((err: string, i: number) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          {err}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          }
        />
      ) : null}
    </>
  );
};
