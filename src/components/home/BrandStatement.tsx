import { Link } from 'react-router-dom';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

interface BrandStatementProps {
  imageSrc?: string;
}

const pillars = [
  {
    title: 'Heritage Craftsmanship',
    body: 'Every piece is crafted by master artisans using techniques passed down through generations — zardozi, dabka, fine resham embroidery, and handloom weaving.',
  },
  {
    title: 'Certified Silks & Textiles',
    body: 'We source exclusively certified handloom silks, authentic Banarasi brocades, and genuine Chanderi tissue — because couture quality starts at the loom.',
  },
  {
    title: 'Sculptural Modern Design',
    body: 'Our ateliers seamlessly merge historical South Asian dress traditions with contemporary silhouettes tailored for the discerning modern woman.',
  },
];

export default function BrandStatement({ imageSrc }: BrandStatementProps) {
  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-32">
      {/* Editorial statement */}
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 sm:mb-28">
        {/* Image Placeholder Area */}
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden bg-light-taupe shadow-md">
            <ImagePlaceholder
              src={imageSrc}
              alt="Smita Couture Nepal Atelier Craftsmanship"
              title="Atelier Craftsmanship Canvas"
              subtitle="Insert artisan or atelier workshop photo (800 × 1000 px)"
              aspectRatio="portrait"
              className="w-full h-full"
            />
          </div>
          {/* Floating accent card */}
          <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-ivory border border-border p-5 sm:p-7 max-w-[200px] shadow-xl z-10">
            <p className="font-serif text-3xl sm:text-4xl text-gold leading-none font-medium">20+</p>
            <p className="text-[10px] tracking-widest-xl uppercase text-taupe mt-1.5 font-sans">
              Years of Heritage
            </p>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:pl-4">
          <p className="section-label mb-4">Our Philosophy</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal mb-6 leading-tight uppercase tracking-wide">
            Where Artisanship<br />Meets Aspiration
          </h2>
          <p className="text-sm sm:text-base text-taupe leading-relaxed mb-5 font-sans">
            Smita Couture Nepal was founded on a singular conviction: that Nepal's heritage of fine tailoring
            and artistic embroidery belongs on the world's most distinguished stages.
          </p>
          <p className="text-sm sm:text-base text-taupe leading-relaxed mb-8 font-sans">
            From our atelier in Maharajgunj, Kathmandu, our designers work hand-in-hand with master zardozi
            embroiders and weavers to create garments of rare beauty, destined to become family heirlooms.
          </p>
          <div>
            <Link to="/about" className="btn-outline inline-flex">
              Explore Our Heritage
            </Link>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="border-t border-border pt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
        {pillars.map((p) => (
          <div key={p.title} className="p-2">
            <div className="w-8 h-px bg-gold mb-5" />
            <h3 className="font-serif text-lg text-charcoal mb-3 uppercase tracking-wider">{p.title}</h3>
            <p className="text-xs sm:text-sm text-taupe leading-relaxed font-sans">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
