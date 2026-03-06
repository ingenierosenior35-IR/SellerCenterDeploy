import { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

import { MoonIcon } from 'src/components/icons';
import { Iconify } from 'src/components/iconify';


interface Props {
    sx?: object;
}

export const ThemeToggleButton = ({ sx, ...props }: Props) => {
  const { mode, setMode } = useColorScheme();
  const [disabled, setDisabled] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleToggle = () => {
    if (disabled) return;

    setDisabled(true);
    setClicked(true);

    setMode(mode === 'dark' ? 'light' : 'dark');

    setTimeout(() => {
      setDisabled(false);
      setClicked(false);
    }, 500); // Bloquea clics por 100ms y resetea animación
  };

  return (
    <IconButton
      aria-label="Cambiar tema"
      onClick={handleToggle}
      disabled={disabled}
      sx={{
        color: 'inherit',
        ...sx,
      }}
      {...props}
    >

      <UniqueIcon mode={mode} clicked={clicked} />

    </IconButton>
  );
};


const UniqueIcon = ({ mode, clicked }: {mode: string | undefined; clicked: boolean}) =>
  <Box
    sx={{
      position: 'relative',
      width: 16,
      height: 16,
    }}
  >
    <Iconify
      icon="custom:sun"
      width={16}
      height={16}
      sx={{
        position: 'absolute',
        inset: 0,
        color: '#FFC107',
        opacity: mode === 'dark' ? 1 : 0,
        transform:
              mode === 'dark'
                ? clicked
                  ? 'rotate(360deg) scale(1)'
                  : 'rotate(0deg) scale(1)'
                : 'rotate(90deg) scale(0.7)',
        pointerEvents: 'none',
        transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)',
      }}
    />

    <MoonIcon
      sx={{
        position: 'absolute',
        inset: 0,
        color: '#333',
        opacity: mode === 'dark' ? 0 : 1,
        transform:
              mode === 'dark'
                ? 'rotate(-90deg) scale(0.7)'
                : clicked
                  ? 'rotate(360deg) scale(1)'
                  : 'rotate(0deg) scale(1)',
        pointerEvents: 'none',
        transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)',
      }}

    />
  </Box>;
