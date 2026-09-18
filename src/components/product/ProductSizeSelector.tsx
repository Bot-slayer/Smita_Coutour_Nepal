interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest-xl uppercase text-charcoal font-sans font-medium">
          Size: <span className="text-taupe">{selectedSize}</span>
        </p>
        <button className="text-xs text-taupe underline underline-offset-2 hover:text-gold transition-colors">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`min-w-[3rem] h-10 px-3 border text-xs font-sans font-medium tracking-wider uppercase transition-all duration-200 ${
              selectedSize === size
                ? 'border-charcoal bg-charcoal text-ivory'
                : 'border-border text-charcoal hover:border-charcoal'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
