import type { EmblaEventType, EmblaCarouselType } from 'embla-carousel';
import type { UseCarouselAutoplayReturn } from '../types';

import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

type AutoScrollPlugin = {
  play: () => void;
  stop: () => void;
  reset: () => void;
  isPlaying: () => boolean;
  options: {
    stopOnInteraction?: boolean;
  };
};

type AutoScrollEventType = EmblaEventType | 'autoScroll:play' | 'autoScroll:stop';

type EmblaCarouselWithAutoScrollEvents = EmblaCarouselType & {
  on: (event: AutoScrollEventType, callback: () => void) => EmblaCarouselWithAutoScrollEvents;
};

const getAutoScroll = (mainApi?: EmblaCarouselType): AutoScrollPlugin | undefined =>
  mainApi?.plugins()?.autoScroll as AutoScrollPlugin | undefined;

export function useCarouselAutoScroll(mainApi?: EmblaCarouselType): UseCarouselAutoplayReturn {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleClickPlay = useCallback(
    (callback: () => void) => {
      const autoScroll = getAutoScroll(mainApi);
      if (!autoScroll) return;

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false ? autoScroll.reset : autoScroll.stop;

      resetOrStop();
      callback();
    },
    [mainApi]
  );

  const handleTogglePlay = useCallback(() => {
    const autoScroll = getAutoScroll(mainApi);
    if (!autoScroll) return;

    const playOrStop = autoScroll.isPlaying() ? autoScroll.stop : autoScroll.play;
    playOrStop();
  }, [mainApi]);

  useEffect(() => {
    const autoScroll = getAutoScroll(mainApi);
    if (!autoScroll) return;

    const emblaApi = mainApi as EmblaCarouselWithAutoScrollEvents;

    setIsPlaying(autoScroll.isPlaying());
    emblaApi
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('autoScroll:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoScroll.isPlaying()));
  }, [mainApi]);

  return {
    isPlaying,
    onClickPlay: handleClickPlay,
    onTogglePlay: handleTogglePlay,
  };
}
