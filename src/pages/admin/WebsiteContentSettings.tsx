
import { useEffect, useState } from 'react';
import {
  Save,
  RotateCcw,
  Type,
  Layout,
  Check,
  FileText,
  Navigation,
  ShoppingCart,
  AlignLeft,
} from 'lucide-react';
import {
  websiteSettingsService,
  type WebsiteContent,
} from '@/services/websiteSettingsService';
import toast from 'react-hot-toast';

export default function WebsiteContentSettings() {
  const [content, setContent] = useState<WebsiteContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await websiteSettingsService.getContent();
        setContent(data);
      } catch (err) {
        console.error('Failed to load website content:', err);
        toast.error('Unable to load website content.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await websiteSettingsService.updateContent(content);
      setSaved(true);
      toast.success('Website content updated successfully.');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save website content:', err);
      toast.error('Failed to save website content.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all changes?')) {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin rounded-full" />
          <p className="text-taupe text-sm">Loading content settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-light-taupe flex items-center justify-center text-charcoal">
              <Type size={20} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-charcoal">
              Website Content
            </h1>
          </div>
          <p className="text-sm text-taupe">
            Manage the text content across your website pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-xs tracking-widest uppercase font-sans hover:border-charcoal transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal text-ivory text-xs tracking-widest uppercase font-sans hover:bg-gold transition-colors disabled:opacity-50 shadow-sm"
          >
            {saved ? (
              <>
                <Check size={14} />
                Saved
              </>
            ) : (
              <>
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Homepage Sections */}
        <ContentSection title="Homepage Hero" icon={<Layout size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Hero Title"
              name="heroTitle"
              value={content.heroTitle}
              onChange={handleChange}
              placeholder="Smita Couture Nepal"
            />
            <InputField
              label="Hero Tagline"
              name="heroTagline"
              value={content.heroTagline}
              onChange={handleChange}
              placeholder="Timeless Elegance. Crafted for You."
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Hero Description"
                name="heroDescription"
                value={content.heroDescription}
                onChange={handleChange}
                placeholder="Exquisite South Asian silhouettes..."
              />
            </div>
            <InputField
              label="Primary Button Text"
              name="heroPrimaryButtonText"
              value={content.heroPrimaryButtonText}
              onChange={handleChange}
              placeholder="Shop Collection"
            />
            <InputField
              label="Secondary Button Text"
              name="heroSecondaryButtonText"
              value={content.heroSecondaryButtonText}
              onChange={handleChange}
              placeholder="Explore New Arrivals"
            />
          </div>
        </ContentSection>

        <ContentSection title="Featured Products" icon={<AlignLeft size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Section Label"
              name="featuredLabel"
              value={content.featuredLabel}
              onChange={handleChange}
              placeholder="Signature Masterpieces"
            />
            <InputField
              label="Section Title"
              name="featuredTitle"
              value={content.featuredTitle}
              onChange={handleChange}
              placeholder="Featured Products"
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Section Description"
                name="featuredDescription"
                value={content.featuredDescription}
                onChange={handleChange}
                placeholder="Handpicked heirloom garments..."
              />
            </div>
          </div>
        </ContentSection>

        <ContentSection title="New Arrivals" icon={<AlignLeft size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Section Label"
              name="newArrivalsLabel"
              value={content.newArrivalsLabel}
              onChange={handleChange}
              placeholder="Just In"
            />
            <InputField
              label="Section Title"
              name="newArrivalsTitle"
              value={content.newArrivalsTitle}
              onChange={handleChange}
              placeholder="New Arrivals"
            />
          </div>
        </ContentSection>

        <ContentSection title="About Section (Homepage)" icon={<FileText size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Label"
              name="aboutLabel"
              value={content.aboutLabel}
              onChange={handleChange}
              placeholder="Haute Couture 2024 / 2025"
            />
            <InputField
              label="Title"
              name="aboutTitle"
              value={content.aboutTitle}
              onChange={handleChange}
              placeholder="The New Collection"
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Description"
                name="aboutDescription"
                value={content.aboutDescription}
                onChange={handleChange}
                placeholder="An homage to classical Nepali grandeur..."
              />
            </div>
            <InputField
              label="Button Text"
              name="aboutButtonText"
              value={content.aboutButtonText}
              onChange={handleChange}
              placeholder="Explore Collection"
            />
          </div>
        </ContentSection>

        <ContentSection title="Newsletter" icon={<AlignLeft size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Label"
              name="newsletterLabel"
              value={content.newsletterLabel}
              onChange={handleChange}
              placeholder="Exclusive Access"
            />
            <InputField
              label="Title"
              name="newsletterTitle"
              value={content.newsletterTitle}
              onChange={handleChange}
              placeholder="Join the Inner Circle"
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Description"
                name="newsletterDescription"
                value={content.newsletterDescription}
                onChange={handleChange}
                placeholder="Be the first to receive new arrivals..."
              />
            </div>
            <InputField
              label="Button Text"
              name="newsletterButtonText"
              value={content.newsletterButtonText}
              onChange={handleChange}
              placeholder="Subscribe"
            />
          </div>
        </ContentSection>

        {/* Global UI */}
        <ContentSection title="Navigation Labels" icon={<Navigation size={18} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Home" name="navHome" value={content.navHome} onChange={handleChange} placeholder="Home" />
            <InputField label="Shop" name="navShop" value={content.navShop} onChange={handleChange} placeholder="Shop" />
            <InputField label="New Arrivals" name="navNewArrivals" value={content.navNewArrivals} onChange={handleChange} placeholder="New Arrivals" />
            <InputField label="Collections" name="navCollections" value={content.navCollections} onChange={handleChange} placeholder="Collections" />
            <InputField label="Sale" name="navSale" value={content.navSale} onChange={handleChange} placeholder="Sale" />
            <InputField label="About" name="navAbout" value={content.navAbout} onChange={handleChange} placeholder="About" />
            <InputField label="Contact" name="navContact" value={content.navContact} onChange={handleChange} placeholder="Contact" />
          </div>
        </ContentSection>

        <ContentSection title="Shop / Product UI" icon={<ShoppingCart size={18} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="Add to Cart" name="addToCartLabel" value={content.addToCartLabel} onChange={handleChange} placeholder="Add to Bag" />
            <InputField label="Buy Now" name="buyNowLabel" value={content.buyNowLabel} onChange={handleChange} placeholder="Buy Now" />
            <InputField label="View Details" name="viewDetailsLabel" value={content.viewDetailsLabel} onChange={handleChange} placeholder="View Details" />
            <InputField label="In Stock" name="inStockLabel" value={content.inStockLabel} onChange={handleChange} placeholder="In Stock" />
            <InputField label="Out of Stock" name="outOfStockLabel" value={content.outOfStockLabel} onChange={handleChange} placeholder="Out of Stock" />
            <InputField label="Previous Button" name="previousLabel" value={content.previousLabel} onChange={handleChange} placeholder="Previous" />
            <InputField label="Next Button" name="nextLabel" value={content.nextLabel} onChange={handleChange} placeholder="Next" />
          </div>
        </ContentSection>

        <ContentSection title="Footer" icon={<AlignLeft size={18} />}>
          <div className="grid grid-cols-1 gap-6">
            <TextareaField
              label="Footer Description"
              name="footerDescription"
              value={content.footerDescription}
              onChange={handleChange}
              placeholder="Curating premium South Asian fashion..."
            />
            <InputField
              label="Copyright Text"
              name="copyrightText"
              value={content.copyrightText}
              onChange={handleChange}
              placeholder="All rights reserved."
            />
          </div>
        </ContentSection>

        <ContentSection title="Collection / Category Page" icon={<Layout size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Page Subtitle / Label"
              name="collectionsTitle"
              value={content.collectionsTitle}
              onChange={handleChange}
              placeholder="Couture Department"
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Page Description Fallback"
                name="collectionsDescription"
                value={content.collectionsDescription}
                onChange={handleChange}
                placeholder="Exclusive handcrafted fashion..."
              />
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Catalog / Shop Page" icon={<Layout size={18} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Header Label"
              name="shopLabel"
              value={content.shopLabel}
              onChange={handleChange}
              placeholder="Haute Couture Catalog"
            />
            <InputField
              label="Header Title"
              name="shopTitle"
              value={content.shopTitle}
              onChange={handleChange}
              placeholder="The Collection"
            />
            <div className="md:col-span-2">
              <TextareaField
                label="Header Description"
                name="shopDescription"
                value={content.shopDescription}
                onChange={handleChange}
                placeholder="Browse our complete repertoire..."
              />
            </div>
          </div>
        </ContentSection>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-8 border-t border-border">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-10 py-3.5 bg-charcoal text-ivory text-xs tracking-[0.2em] uppercase font-sans hover:bg-gold transition-colors disabled:opacity-50 shadow-lg"
        >
          {saving ? 'Saving Content...' : 'Save All Website Content'}
        </button>
      </div>
    </div>
  );
}

function ContentSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border/70 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-border/70 flex items-center gap-3">
        <span className="text-gold">{icon}</span>
        <h2 className="font-serif text-xl text-charcoal uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  placeholder: string;
}

function InputField({ label, name, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-bold">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-ivory/30 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-taupe/30"
      />
    </div>
  );
}

function TextareaField({ label, name, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] tracking-widest-xl uppercase text-taupe font-sans font-bold">
        {label}
      </label>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className="w-full bg-ivory/30 border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-charcoal transition-colors placeholder:text-taupe/30 resize-none"
      />
    </div>
  );
}
