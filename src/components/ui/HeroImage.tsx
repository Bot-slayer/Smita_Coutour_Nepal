import ImagePlaceholder from './ImagePlaceholder';

interface HeroImageProps {
  src?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function HeroImage({ src, alt, title, subtitle, className = '' }: HeroImageProps) {
  return (
    <ImagePlaceholder
      src={src}
      alt={alt}
      title={title}
      subtitle={subtitle}
      aspectRatio="banner"
      className={className}
    />
  );
}
