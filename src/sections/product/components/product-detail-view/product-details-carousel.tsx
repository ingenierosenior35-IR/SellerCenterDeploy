'use client';

import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { Lightbox, useLightbox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

type Props = {
  images: string[];
};

export function ProductDetailsCarousel({ images }: Props) {
  const carousel = useCarousel({
    thumbs: { slidesToShow: 'auto' },
  });

  const slides = images?.map((img) => ({ src: img })) ?? [];

  const lightbox = useLightbox(slides);

  // Cuando el lightbox cambia de slide, sincronizar el carousel principal
  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  const handleImageClick = (e: React.MouseEvent, src: string) => {
    e.stopPropagation(); // <-- evita que el evento llegue al carousel
    lightbox.onOpen(src);
  };

  return (
    <>
      <Box sx={{ mb: 2.5, position: 'relative' }}>
        <CarouselArrowNumberButtons
          {...carousel.arrows}
          options={carousel.options}
          totalSlides={carousel.dots.dotCount}
          selectedIndex={carousel.dots.selectedIndex + 1}
          sx={{ right: 16, bottom: 16, position: 'absolute' }}
        />

        <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
          {slides.map((slide) => (
            <Box
              key={slide.src}
              component="div"
              onClick={(e) => handleImageClick(e, slide.src)}
              sx={{
                bgcolor: '#fff',
                borderRadius: 2,
                cursor: 'zoom-in',
                width: '100%',
                aspectRatio: '1 / 1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                minWidth: 320,
                // Evitar que el drag del carousel se confunda con un click
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              <Box
                component="img"
                alt={slide.src}
                src={slide.src}
                draggable={false} // <-- evita que arrastrar la imagen active el lightbox
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  backgroundColor: '#fff',
                  pointerEvents: 'none', // <-- el click lo maneja el Box padre, no la imagen
                }}
              />
            </Box>
          ))}
        </Carousel>
      </Box>

      <CarouselThumbs
        ref={carousel.thumbs.thumbsRef}
        options={carousel.options?.thumbs}
        slotProps={{ disableMask: true }}
        sx={{
          width: 360,
          mx: 'auto',
          display: 'flex',
          justifyContent: 'center',
          '& img': {
            objectFit: 'contain',
            backgroundColor: '#fff',
          },
        }}
      >
        {slides.map((item, index) => (
          <CarouselThumb
            key={item.src}
            index={index}
            src={item.src}
            selected={index === carousel.thumbs.selectedIndex}
            onClick={() => carousel.thumbs.onClickThumb(index)}
          />
        ))}
      </CarouselThumbs>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}
