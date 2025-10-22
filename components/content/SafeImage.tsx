'use client';
import Image from 'next/image';
import { normalizeImageSrc, isValidForNextImage } from '@/lib/img';

type SafeImageProps = {
  src?: string | { url?: string | null } | null;
  alt: string;
  className?: string;
  // If you use fill, pass fill; otherwise pass width/height.
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

export default function SafeImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
}: SafeImageProps) {
  const resolved = normalizeImageSrc(src);

  if (!isValidForNextImage(resolved)) {
    // No valid image → render a neutral placeholder block
    return (
      <div
        className={className}
        aria-hidden
        style={{ background: 'var(--muted, #f3f4f6)' }}
      />
    );
  }

  // Next/Image can handle http(s), root-relative, and data: (with unoptimized)
  const unoptimized = resolved.startsWith('data:');

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt || ''}
        fill
        className={className}
        priority={priority}
        unoptimized={unoptimized}
      />
    );
  }

  // Ensure width/height for non-fill
  return (
    <Image
      src={resolved}
      alt={alt || ''}
      width={width || 1200}
      height={height || 800}
      className={className}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
}



