import ImagePlaceholder from './ImagePlaceholder';

interface ProductImageProps {
  src?: string;
  alt: string;
  title?: string;
  className?: string;
  overlay?: React.ReactNode;
}

export default function ProductImage({ src, alt, title, className = '', overlay }: ProductImageProps) {
  return (
    <ImagePlaceholder
      src={src}
      alt={alt}
      title={title}
      aspectRatio="portrait"
      className={className}
      overlay={overlay}
    />
  );
}
