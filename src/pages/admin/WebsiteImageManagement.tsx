
import { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  websiteSettingsService,
  type WebsiteImages,
  type CategoryImages,
} from '@/services/websiteSettingsService';
import { optimizeImage } from '@/utils/imageOptimization';
import toast from 'react-hot-toast';

const HOMEPAGE_SLOTS: {
  key: keyof WebsiteImages;
  label: string;
  desc: string;
}[] = [
  {
    key: 'homepage_hero',
    label: 'Hero Image',
    desc: 'Main homepage hero/banner image. (1920x1080px recommended)',
  },
  {
    key: 'homepage_about',
    label: 'About Image',
    desc: 'Image used in the homepage New Collection section. (1400x900px recommended)',
  },
  {
    key: 'homepage_new_arrivals',
    label: 'New Arrivals Banner',
    desc: 'Optional banner for New Arrivals section. (1600x600px recommended)',
  },
  {
    key: 'homepage_featured',
    label: 'Featured Banner',
    desc: 'Optional banner for Featured Products section. (1600x600px recommended)',
  },
  {
    key: 'homepage_atelier',
    label: 'Atelier Craftsmanship',
    desc: 'Main image for the Atelier Philosophy section. (800x1000px recommended)',
  },
  {
    key: 'homepage_newsletter',
    label: 'Newsletter Background',
    desc: 'Background image for the newsletter signup. (1920x600px recommended)',
  },
];

const OTHER_SLOTS: {
  key: keyof WebsiteImages;
  label: string;
  desc: string;
}[] = [
  {
    key: 'about_atelier',
    label: 'About Page Atelier',
    desc: 'Photography for the About page atelier area. (1600x600px recommended)',
  },
];

const CATEGORY_SLOTS: {
  key: keyof CategoryImages;
  label: string;
  desc: string;
}[] = [
  { key: 'sarees', label: 'Sarees', desc: 'Main image for Saree collection. (800x1000px recommended)' },
  { key: 'bridal', label: 'Bridal Couture', desc: 'Main image for Bridal collection. (800x1000px recommended)' },
  { key: 'designer-wear', label: 'Designer Wear', desc: 'Main image for Designer collection. (800x1000px recommended)' },
  { key: 'dresses', label: 'Dresses', desc: 'Main image for Dresses collection. (800x1000px recommended)' },
  { key: 'suits', label: 'Suits', desc: 'Main image for Suits collection. (800x1000px recommended)' },
  { key: 'kurtis', label: 'Kurtis', desc: 'Main image for Kurtis collection. (800x1000px recommended)' },
  { key: 'gowns', label: 'Gowns', desc: 'Main image for Gowns collection. (800x1000px recommended)' },
  { key: 'lehengas', label: 'Lehengas', desc: 'Main image for Lehengas collection. (800x1000px recommended)' },
  { key: 'tops', label: 'Tops', desc: 'Main image for Tops collection. (800x1000px recommended)' },
  { key: 'accessories', label: 'Accessories', desc: 'Main image for Accessories collection. (800x1000px recommended)' },
];

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export default function WebsiteImageManagement() {
  const [homepageImages, setHomepageImages] = useState<WebsiteImages>({});
  const [categoryImages, setCategoryImages] = useState<CategoryImages>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [hp, cat] = await Promise.all([
          websiteSettingsService.getWebsiteImages(),
          websiteSettingsService.getCategoryImages(),
        ]);
        setHomepageImages(hp);
        setCategoryImages(cat);
      } catch (error) {
        console.error('Failed to load website images:', error);
        toast.error('Unable to load website images.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpload = async (
    type: 'homepage' | 'category',
    key: string,
    file: File
  ) => {
    // 1. Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Unsupported file format. Please use JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size too large. Maximum allowed is 20MB.');
      return;
    }

    try {
      setUploading(key);

      // 2. Client-side optimization
      const optimizedBlob = await optimizeImage(file, {
        maxWidth: 2400,
        maxHeight: 2400,
        quality: 0.85,
        format: 'image/webp',
      });

      // 3. Prepare file path
      const fileName = `${key}_${Date.now()}.webp`;
      const filePath = `${type === 'homepage' ? 'homepage' : `categories/${key}`}/${fileName}`;

      // 4. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, optimizedBlob, {
          contentType: 'image/webp',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 5. Get Public URL
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 6. Save to WebsiteSettings
      if (type === 'homepage') {
        const updated = await websiteSettingsService.updateWebsiteImage(key as keyof WebsiteImages, publicUrl);
        setHomepageImages(updated);
      } else {
        const updated = await websiteSettingsService.updateCategoryImage(key as keyof CategoryImages, publicUrl);
        setCategoryImages(updated);
      }

      toast.success(`${key.replace(/_/g, ' ')} updated successfully.`);
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Failed to upload image.');
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = async (type: 'homepage' | 'category', key: string) => {
    if (!confirm('Are you sure you want to remove this image? It will revert to the default.')) {
      return;
    }

    try {
      if (type === 'homepage') {
        const updated = await websiteSettingsService.removeWebsiteImage(key as keyof WebsiteImages);
        setHomepageImages(updated);
      } else {
        const updated = await websiteSettingsService.removeCategoryImage(key as keyof CategoryImages);
        setCategoryImages(updated);
      }
      toast.success(`${key.replace(/_/g, ' ')} removed.`);
    } catch (error) {
      console.error('Remove failed:', error);
      toast.error('Failed to remove image.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-taupe text-sm">Loading website visuals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-16">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-light-taupe flex items-center justify-center text-charcoal">
            <ImageIcon size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal">
            Website Image Assets
          </h1>
        </div>
        <p className="text-sm text-taupe max-w-2xl">
          Upload and manage high-resolution photography for your digital boutique.
          Images are automatically optimized for fast loading while preserving couture quality.
        </p>
      </div>

      {/* Section 1: Homepage Visuals */}
      <section>
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <h2 className="font-serif text-xl text-charcoal uppercase tracking-widest">
            Homepage Visuals
          </h2>
          <span className="text-[10px] bg-charcoal text-gold px-2 py-0.5 font-sans font-bold tracking-widest uppercase">
            Main Site
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOMEPAGE_SLOTS.map((slot) => (
            <ImageCard
              key={slot.key}
              label={slot.label}
              desc={slot.desc}
              url={homepageImages[slot.key]}
              isUploading={uploading === slot.key}
              onUpload={(file) => handleUpload('homepage', slot.key, file)}
              onRemove={() => handleRemove('homepage', slot.key)}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Collection Masterpieces */}
      <section>
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <h2 className="font-serif text-xl text-charcoal uppercase tracking-widest">
            Category Masterpieces
          </h2>
          <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 font-sans font-bold tracking-widest uppercase border border-gold/20">
            Collections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORY_SLOTS.map((slot) => (
            <ImageCard
              key={slot.key}
              label={slot.label}
              desc={slot.desc}
              url={categoryImages[slot.key]}
              isUploading={uploading === slot.key}
              onUpload={(file) => handleUpload('category', slot.key, file)}
              onRemove={() => handleRemove('category', slot.key)}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Other Website Assets */}
      <section>
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <h2 className="font-serif text-xl text-charcoal uppercase tracking-widest">
            Other Brand Assets
          </h2>
          <span className="text-[10px] bg-taupe/10 text-taupe px-2 py-0.5 font-sans font-bold tracking-widest uppercase border border-border">
            Information Pages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OTHER_SLOTS.map((slot) => (
            <ImageCard
              key={slot.key}
              label={slot.label}
              desc={slot.desc}
              url={homepageImages[slot.key]}
              isUploading={uploading === slot.key}
              onUpload={(file) => handleUpload('homepage', slot.key, file)}
              onRemove={() => handleRemove('homepage', slot.key)}
            />
          ))}
        </div>
      </section>

      {/* Optimization Note */}
      <div className="p-6 bg-charcoal text-ivory flex gap-5">
        <Info className="w-6 h-6 text-gold shrink-0" />
        <div className="text-sm">
          <h4 className="font-serif text-lg text-gold mb-1 tracking-wide">Smart Optimization Engine</h4>
          <p className="text-ivory/60 leading-relaxed max-w-3xl">
            You can now select original photography up to 20MB. Our system will automatically resize images to
            a maximum of 2400px and convert them to the high-performance WebP format. This ensures
            a crystal-clear display on 4K monitors while keeping the site lightning-fast for mobile customers.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ImageCardProps {
  label: string;
  desc: string;
  url?: string;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function ImageCard({ label, desc, url, isUploading, onUpload, onRemove }: ImageCardProps) {
  return (
    <div className="bg-white border border-border/70 flex flex-col group shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <h3 className="font-serif text-lg text-charcoal mb-1">{label}</h3>
        <p className="text-[10px] text-taupe uppercase tracking-wider leading-relaxed">{desc}</p>
      </div>

      <div className="relative aspect-video bg-ivory flex items-center justify-center overflow-hidden">
        {url ? (
          <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-taupe/30">
            <ImageIcon size={42} strokeWidth={1} />
            <span className="text-[10px] uppercase tracking-widest font-sans">Awaiting Artwork</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-xs flex flex-col items-center justify-center text-ivory gap-3 z-10">
            <RefreshCw className="w-8 h-8 animate-spin text-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Optimizing...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 flex items-center justify-between gap-4 mt-auto">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
            disabled={isUploading}
          />
          <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-charcoal text-ivory hover:bg-gold hover:text-charcoal transition-all duration-300 text-[10px] uppercase font-bold tracking-widest shadow-sm">
            <Upload size={14} />
            {url ? 'Replace' : 'Upload'}
          </div>
        </label>

        {url && (
          <button
            onClick={onRemove}
            disabled={isUploading}
            className="p-2.5 text-taupe hover:text-red-600 transition-colors border border-transparent hover:border-red-100 bg-white"
            title="Remove Image"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
