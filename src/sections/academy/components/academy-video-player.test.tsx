import { act, render, screen } from '@testing-library/react';

import { AcademyVideoPlayer } from './academy-video-player';

jest.useFakeTimers();

describe('AcademyVideoPlayer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders an iframe with the given src and title', () => {
    render(<AcademyVideoPlayer videoUrl="https://example.com/x" title="Lesson video" />);
    const iframe = screen.getByTitle('Lesson video');
    expect(iframe).toHaveAttribute('src', 'https://example.com/x');
  });

  it('emits heuristic progress every 30s', () => {
    const onProgress = jest.fn();
    render(<AcademyVideoPlayer videoUrl="x" title="t" onProgress={onProgress} />);

    expect(onProgress).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(30_000);
    });
    expect(onProgress).toHaveBeenCalledWith(10);

    act(() => {
      jest.advanceTimersByTime(30_000);
    });
    expect(onProgress).toHaveBeenCalledWith(20);
  });

  it('caps heuristic progress at 95', () => {
    const onProgress = jest.fn();
    render(<AcademyVideoPlayer videoUrl="x" title="t" onProgress={onProgress} />);

    act(() => {
      jest.advanceTimersByTime(30_000 * 20);
    });

    const calls = onProgress.mock.calls.map(([value]) => value);
    expect(Math.max(...calls)).toBe(95);
  });

  it('calls onComplete on unmount when accumulated progress >= 80', () => {
    const onProgress = jest.fn();
    const onComplete = jest.fn();
    const { unmount } = render(
      <AcademyVideoPlayer
        videoUrl="x"
        title="t"
        onProgress={onProgress}
        onComplete={onComplete}
      />
    );

    act(() => {
      jest.advanceTimersByTime(30_000 * 9); // 90%
    });
    unmount();
    expect(onComplete).toHaveBeenCalled();
  });

  it('does NOT call onComplete on unmount when accumulated progress < 80', () => {
    const onComplete = jest.fn();
    const { unmount } = render(
      <AcademyVideoPlayer videoUrl="x" title="t" onProgress={jest.fn()} onComplete={onComplete} />
    );
    act(() => {
      jest.advanceTimersByTime(30_000 * 3); // 30%
    });
    unmount();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
