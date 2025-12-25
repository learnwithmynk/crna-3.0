/**
 * VimeoPlayer Component
 *
 * Responsive Vimeo video embed with 16:9 aspect ratio.
 * Supports lazy loading and playback state tracking.
 *
 * Used in: LessonPage
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {string} props.videoId - Vimeo video ID
 * @param {string} props.thumbnailUrl - Custom thumbnail URL (optional)
 * @param {string} props.title - Video title for accessibility
 * @param {number} props.startTime - Start time in seconds (for resume)
 * @param {Function} props.onTimeUpdate - Called with current time periodically
 * @param {Function} props.onEnded - Called when video ends
 * @param {string} props.className - Additional classes
 */
export function VimeoPlayer({
  videoId,
  thumbnailUrl,
  title,
  startTime = 0,
  onTimeUpdate,
  onEnded,
  className,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);

  // Auto-generate thumbnail from Vimeo if not provided
  const thumbnail = thumbnailUrl || `https://vumbnail.com/${videoId}_large.jpg`;

  // Build Vimeo embed URL with parameters
  const embedUrl = videoId
    ? `https://player.vimeo.com/video/${videoId}?` +
      new URLSearchParams({
        autoplay: '1',
        title: '0',
        byline: '0',
        portrait: '0',
        dnt: '1', // Do Not Track
        ...(startTime > 0 ? { t: `${Math.floor(startTime)}s` } : {}),
      }).toString()
    : '';

  // Load video on click (lazy loading)
  const handlePlay = () => {
    setIsLoaded(true);
    setIsPlaying(true);
  };

  // Listen for Vimeo player events via postMessage
  useEffect(() => {
    if (!isLoaded || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const handleMessage = (event) => {
      // Only accept messages from Vimeo
      if (!event.origin.includes('vimeo.com')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.event === 'timeupdate' && onTimeUpdate) {
          onTimeUpdate(data.data?.seconds || 0);
        }

        if (data.event === 'ended' && onEnded) {
          onEnded();
          setIsPlaying(false);
        }
      } catch (e) {
        // Ignore parse errors from non-Vimeo messages
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isLoaded, onTimeUpdate, onEnded]);

  if (!videoId) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900',
        className
      )}
    >
      {!isLoaded ? (
        // Thumbnail with play button (lazy load)
        <button
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full group cursor-pointer"
          aria-label={`Play ${title || 'video'}`}
        >
          {/* Thumbnail image */}
          <img
            src={thumbnail}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to gradient if thumbnail fails
              e.target.style.display = 'none';
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>
        </button>
      ) : (
        // Vimeo iframe (loaded after click)
        <>
          {/* Loading indicator */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 animate-pulse">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title={title || 'Video player'}
            onLoad={() => setIsPlaying(false)}
          />
        </>
      )}
    </div>
  );
}

/**
 * Compact video player for smaller contexts
 */
export function VimeoPlayerCompact({ videoId, className }) {
  if (!videoId) return null;

  const embedUrl = `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&dnt=1`;

  return (
    <div className={cn('relative w-full aspect-video rounded-xl overflow-hidden', className)}>
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Video"
      />
    </div>
  );
}

export default VimeoPlayer;
