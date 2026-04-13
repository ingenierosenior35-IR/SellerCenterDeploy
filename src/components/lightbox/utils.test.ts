jest.mock('yet-another-react-lightbox/plugins/zoom', () => ({ __esModule: true, default: 'ZoomPlugin' }));
jest.mock('yet-another-react-lightbox/plugins/video', () => ({ __esModule: true, default: 'VideoPlugin' }));
jest.mock('yet-another-react-lightbox/plugins/captions', () => ({ __esModule: true, default: 'CaptionsPlugin' }));
jest.mock('yet-another-react-lightbox/plugins/slideshow', () => ({ __esModule: true, default: 'SlideshowPlugin' }));
jest.mock('yet-another-react-lightbox/plugins/fullscreen', () => ({ __esModule: true, default: 'FullscreenPlugin' }));
jest.mock('yet-another-react-lightbox/plugins/thumbnails', () => ({ __esModule: true, default: 'ThumbnailsPlugin' }));

import { getPlugins } from './utils';

describe('getPlugins', () => {
  it('returns all plugins by default', () => {
    const plugins = getPlugins({});
    expect(plugins).toHaveLength(6);
  });

  it('removes Zoom plugin when disableZoom is true', () => {
    const plugins = getPlugins({ disableZoom: true });
    expect(plugins).not.toContain('ZoomPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes Video plugin when disableVideo is true', () => {
    const plugins = getPlugins({ disableVideo: true });
    expect(plugins).not.toContain('VideoPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes Captions plugin when disableCaptions is true', () => {
    const plugins = getPlugins({ disableCaptions: true });
    expect(plugins).not.toContain('CaptionsPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes Slideshow plugin when disableSlideshow is true', () => {
    const plugins = getPlugins({ disableSlideshow: true });
    expect(plugins).not.toContain('SlideshowPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes Thumbnails plugin when disableThumbnails is true', () => {
    const plugins = getPlugins({ disableThumbnails: true });
    expect(plugins).not.toContain('ThumbnailsPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes Fullscreen plugin when disableFullscreen is true', () => {
    const plugins = getPlugins({ disableFullscreen: true });
    expect(plugins).not.toContain('FullscreenPlugin');
    expect(plugins).toHaveLength(5);
  });

  it('removes multiple plugins', () => {
    const plugins = getPlugins({ disableZoom: true, disableVideo: true, disableCaptions: true });
    expect(plugins).toHaveLength(3);
  });
});
