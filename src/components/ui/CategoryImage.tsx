import ImagePlaceholder from './ImagePlaceholder';

interface CategoryImageProps {
  src?: string;
  alt: string;
  title?: string;
  className?: string;
}

export default function CategoryImage({ src, alt, title, className = '' }: CategoryImageProps) {
  return (
    <ImagePlaceholder
      src={src}
      alt={alt}
      title={title}
      aspectRatio="square"
      className={className}
    />
  );
}
