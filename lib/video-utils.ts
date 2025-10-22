/**
 * Safe video play/pause utilities to prevent AbortError
 */

export interface VideoPlayOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Safely play a video with error handling
 */
export async function safePlayVideo(
  video: HTMLVideoElement | null, 
  options: VideoPlayOptions = {}
): Promise<void> {
  if (!video) return;

  try {
    // Check if video is ready to play
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
      const playPromise = video.play();
      
      // Handle both promise and non-promise returns
      if (playPromise && typeof playPromise.catch === 'function') {
        await playPromise;
      }
      
      options.onSuccess?.();
    } else {
      // Wait for video to be ready
      video.addEventListener('canplay', async () => {
        try {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            await playPromise;
          }
          options.onSuccess?.();
        } catch (error) {
          options.onError?.(error as Error);
        }
      }, { once: true });
    }
  } catch (error) {
    // Ignore AbortError (play interrupted by pause)
    if ((error as Error).name !== 'AbortError') {
      console.warn('Video play error:', error);
      options.onError?.(error as Error);
    }
  }
}

/**
 * Safely pause a video with error handling
 */
export function safePauseVideo(
  video: HTMLVideoElement | null,
  options: VideoPlayOptions = {}
): void {
  if (!video) return;

  try {
    video.pause();
    options.onSuccess?.();
  } catch (error) {
    console.warn('Video pause error:', error);
    options.onError?.(error as Error);
  }
}

/**
 * Safely reset video to beginning
 */
export function safeResetVideo(
  video: HTMLVideoElement | null,
  options: VideoPlayOptions = {}
): void {
  if (!video) return;

  try {
    video.currentTime = 0;
    options.onSuccess?.();
  } catch (error) {
    console.warn('Video reset error:', error);
    options.onError?.(error as Error);
  }
}

/**
 * Combined play and reset function for hover effects
 */
export async function safePlayAndResetVideo(
  video: HTMLVideoElement | null,
  options: VideoPlayOptions = {}
): Promise<void> {
  await safePlayVideo(video, options);
}

/**
 * Combined pause and reset function for hover effects
 */
export function safePauseAndResetVideo(
  video: HTMLVideoElement | null,
  options: VideoPlayOptions = {}
): void {
  safePauseVideo(video, options);
  safeResetVideo(video, options);
}


