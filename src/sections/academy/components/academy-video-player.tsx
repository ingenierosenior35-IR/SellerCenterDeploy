import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

interface AcademyVideoPlayerProps {
  /** URL embebible (YouTube /embed/, Vimeo player, etc.) */
  videoUrl: string;
  /** Título accesible del iframe. */
  title: string;
  /**
   * Callback de progreso. Por ahora dispara un avance heurístico cada
   * 30 segundos mientras el iframe permanece montado, ya que las plataformas
   * de embed no exponen postMessage de forma confiable sin SDKs propietarios.
   * Cuando integremos YouTube IFrame API o Vimeo Player.js, este callback se
   * llamará con valores reales del player.
   */
  onProgress?: (percent: number) => void;
  /** Callback al cerrar/desmontar la lección. */
  onComplete?: () => void;
}

const HEURISTIC_TICK_MS = 30_000;
const HEURISTIC_INCREMENT = 10;

export function AcademyVideoPlayer({
  videoUrl,
  title,
  onProgress,
  onComplete,
}: Readonly<AcademyVideoPlayerProps>) {
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!onProgress) return undefined;

    accumulatedRef.current = 0;
    const interval = setInterval(() => {
      accumulatedRef.current = Math.min(accumulatedRef.current + HEURISTIC_INCREMENT, 95);
      onProgress(accumulatedRef.current);
    }, HEURISTIC_TICK_MS);

    return () => clearInterval(interval);
  }, [videoUrl, onProgress]);

  useEffect(() => () => {
      // Al desmontar, si quedó casi al final, lo tomamos como completado.
      if (accumulatedRef.current >= 80) {
        onComplete?.();
      }
    }, [videoUrl, onComplete]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pt: '56.25%', // 16:9
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'common.black',
      }}
    >
      <Box
        component="iframe"
        src={videoUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </Box>
  );
}
