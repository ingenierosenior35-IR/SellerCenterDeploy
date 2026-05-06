import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Dimensiones de Figma:
// · Cada celda de input en grid 2-col mide 344px → 2*344 + gap (24) = 712.
// · Cada fila ocupa ~100px (input + label + helper).
// ----------------------------------------------------------------------

export const FORM_MAX_WIDTH = 712;

// ----------------------------------------------------------------------
// Override visual para inputs sobre fondo oscuro: bordes/labels/iconos en blanco.
// Aplicar via `sx={darkFieldSx}` en cada Field.Text / Field.Select.
// ----------------------------------------------------------------------

// El ancho de cada input lo determina el grid cell donde vive: en `1fr 1fr`
// queda ~344, en `1fr` (single column) se estira a los 712 del contenedor.
export const darkFieldSx: SxProps<Theme> = {
  width: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'common.white',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'common.white',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'common.white',
    borderWidth: 1,
  },
  '& .MuiInputBase-input': {
    color: 'common.white',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 1,
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'common.white',
  },
  '& .MuiSelect-icon, & .MuiSvgIcon-root': {
    color: 'common.white',
  },
  // Evita el background azul/amarillo del autofill sin pintar ningún color extra.
  // El truco está en `transition: 5000s` — Chrome calcula el background-color
  // pero la transición es tan larga que nunca llega a renderizarse.
  '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active':
    {
      WebkitTextFillColor: '#fff !important',
      caretColor: '#fff',
      transition: 'background-color 5000s ease-in-out 0s',
    },
};
