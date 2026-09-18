import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const timeline = [
  { year: '2003', event: 'Founded in Kathmandu', desc: 'Smita Couture Nepal opens its first bespoke tailoring atelier in Maharajgunj, Kathmandu.' },
  { year: '2008', event: 'First Bridal Line', desc: 'Our debut bridal collection establishes a new benchmark for luxury Nepali bridal wear.' },
  { year: '2015', event: 'Artisan Guild Partnerships', desc: 'Long-term alliances established with master zardozi embroiderers and handloom weavers across South Asia.' },
  { year: '2020', event: 'Digital Boutique Debut', desc: 'Online salon launched to serve discerning clients and global Nepali diaspora.' },
  { year: '2024', event: 'Haute Couture Expansion', desc: 'New luxury categories introduced across contemporary designer evening wear, lehengas, and couture gowns.' },
];

const values = [
  {
    title: 'Authenticity',
    body: 'Every textile is traceable and authenticated — from certified pure Banarasi brocades to handloom silks.',
  },
  {
    title: 'Artisanship',
    body: 'We honor and sustain generational craft techniques. Over 300 collective hours are invested into every bridal commission.',
  },
  {
    title: 'Mindful Luxury',
    body: 'Couture quality garments designed to transcend micro-trends and become treasured heirlooms for future generations.',
  },
  {
    title: 'Bespoke Inclusivity',
    body: 'Haute couture is an intimate personal experience. We craft bespoke measurements celebrating every client with precision.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Editorial Hero */}
      <div className="relative bg-charcoal text-ivory py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-4 sm:inset-10 border border-gold/15 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-sans font-medium mb-4">
            Est. 2003 · Kathmandu, Nepal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ivory font-normal tracking-wide uppercase mb-6 leading-tight">
            Our Story & Heritage
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 max-w-xl mx-auto leading-relaxed font-sans">
            Two decades of uncompromising devotion to traditional South Asian dress, hand-embroidery,
            and contemporary high fashion.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        <p className="section-label mb-4">The Atelier Ethos</p>
        <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-normal leading-snug mb-8">
          "To drape the modern woman in garments that honor her heritage with majesty, while embracing the future with effortless poise."
        </blockquote>
        <div className="w-12 h-px bg-gold mx-auto mb-8" />
        <p className="text-sm sm:text-base text-taupe leading-relaxed max-w-2xl mx-auto font-sans">
          From the delicate clicks of wooden shuttle looms to the gentle glide of needlework in our
          Kathmandu studio, every fold of cloth from Smita Couture Nepal is infused with intentionality,
          grace, and reverence for centuries of cultural heritage.
        </p>
      </div>

      {/* 20-Year Timeline */}
      <div className="bg-light-taupe/40 border-y border-border/80 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="section-label mb-2">Our Milestones</p>
            <h2 className="section-heading">Two Decades of Excellence</h2>
          </div>

          <div className="relative">
            {/* Center spine */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

            <div className="flex flex-col gap-12 sm:gap-16">
              {timeline.map((item, idx) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-0 items-start ${
                    idx % 2 === 0 ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Dot */}
                  <div className="absolute left-4 sm:left-1/2 top-1.5 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-gold border-2 border-ivory shadow-xs z-10" />

                  {/* Spacer half */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content half */}
                  <div className={`pl-10 sm:pl-0 sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                    <span className="text-xs font-mono font-semibold tracking-widest text-gold uppercase">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-lg text-charcoal mt-1 mb-2 uppercase tracking-wide">
                      {item.event}
                    </h3>
                    <p className="text-xs sm:text-sm text-taupe leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label mb-2">Guiding Principles</p>
          <h2 className="section-heading">The Pillars of Smita Couture</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-white border border-border/80 p-8 shadow-xs">
              <div className="w-8 h-px bg-gold mb-6" />
              <h3 className="font-serif text-xl text-charcoal mb-3 uppercase tracking-wider">{v.title}</h3>
              <p className="text-xs sm:text-sm text-taupe leading-relaxed font-sans">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Atelier Photography Area */}
      <div className="border-t border-border/70 bg-white py-16">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="relative overflow-hidden bg-light-taupe shadow-sm">
            <ImagePlaceholder
              title="Smita Couture Kathmandu Atelier"
              subtitle="Insert boutique or embroidery workshop photography (1600 × 600 px)"
              aspectRatio="wide"
              className="w-full min-h-[300px] sm:min-h-[420px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
