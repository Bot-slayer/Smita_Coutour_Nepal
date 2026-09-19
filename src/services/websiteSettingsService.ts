
import { supabase } from '@/lib/supabase';

export interface AppearanceSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  buttonRadius: string;
}

export interface WebsiteImages {
  homepage_hero?: string;
  homepage_about?: string;
  homepage_featured?: string;
  homepage_new_arrivals?: string;
  homepage_newsletter?: string;
  homepage_atelier?: string;
  about_atelier?: string;
}

export interface CategoryImages {
  sarees?: string;
  dresses?: string;
  bridal?: string;
  suits?: string;
  kurtis?: string;
  gowns?: string;
  lehengas?: string;
  'designer-wear'?: string;
  tops?: string;
  accessories?: string;
}

export interface WebsiteContent {
  // Homepage Hero
  heroTitle?: string;
  heroTagline?: string;
  heroDescription?: string;
  heroPrimaryButtonText?: string;
  heroSecondaryButtonText?: string;

  // Featured Products
  featuredLabel?: string;
  featuredTitle?: string;
  featuredDescription?: string;

  // New Arrivals
  newArrivalsLabel?: string;
  newArrivalsTitle?: string;

  // New Collection / About section
  aboutLabel?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutButtonText?: string;

  // Newsletter
  newsletterLabel?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterButtonText?: string;

  // Navigation
  navHome?: string;
  navShop?: string;
  navNewArrivals?: string;
  navCollections?: string;
  navSale?: string;
  navAbout?: string;
  navContact?: string;

  // Shop / Product UI
  addToCartLabel?: string;
  buyNowLabel?: string;
  viewDetailsLabel?: string;
  inStockLabel?: string;
  outOfStockLabel?: string;
  previousLabel?: string;
  nextLabel?: string;

  // Footer
  footerDescription?: string;
  copyrightText?: string;

  // Collection/category page
  collectionsTitle?: string;
  collectionsDescription?: string;

  // Collections Page (Shop)
  shopLabel?: string;
  shopTitle?: string;
  shopDescription?: string;
}

const DEFAULT_APPEARANCE: AppearanceSettings = {
  primaryColor: '#2B2927',
  accentColor: '#B08D57',
  backgroundColor: '#F8F5F0',
  textColor: '#2B2927',
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  buttonRadius: '0px',
};

export const websiteSettingsService = {
  getAppearance: async (): Promise<AppearanceSettings> => {
    const { data, error } = await supabase
      .from('WebsiteSettings')
      .select('value')
      .eq('key', 'appearance')
      .maybeSingle();

    if (error) {
      console.error('Failed to load appearance settings:', error);
      return DEFAULT_APPEARANCE;
    }

    if (!data?.value) {
      return DEFAULT_APPEARANCE;
    }

    return {
      ...DEFAULT_APPEARANCE,
      ...(data.value as Partial<AppearanceSettings>),
    };
  },

  updateAppearance: async (
    settings: Partial<AppearanceSettings>
  ): Promise<AppearanceSettings> => {
    const current = await websiteSettingsService.getAppearance();

    const updated: AppearanceSettings = {
      ...current,
      ...settings,
    };

    const { data, error } = await supabase
      .from('WebsiteSettings')
      .update({
        value: updated,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'appearance')
      .select('value')
      .single();

    if (error) {
      console.error('Failed to update appearance settings:', error);
      throw error;
    }

    return {
      ...DEFAULT_APPEARANCE,
      ...(data.value as Partial<AppearanceSettings>),
    };
  },

  getWebsiteImages: async (): Promise<WebsiteImages> => {
    const { data, error } = await supabase
      .from('WebsiteSettings')
      .select('value')
      .eq('key', 'website_images')
      .maybeSingle();

    if (error) {
      console.error('Failed to load website images:', error);
      return {};
    }

    return (data?.value as WebsiteImages) || {};
  },

  updateWebsiteImage: async (
    key: keyof WebsiteImages,
    url: string
  ): Promise<WebsiteImages> => {
    const current = await websiteSettingsService.getWebsiteImages();

    const updated: WebsiteImages = {
      ...current,
      [key]: url,
    };

    // Use upsert to handle case where key doesn't exist yet
    const { data, error } = await supabase
      .from('WebsiteSettings')
      .upsert(
        {
          key: 'website_images',
          value: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select('value')
      .single();

    if (error) {
      console.error('Failed to update website image:', error);
      throw error;
    }

    return (data.value as WebsiteImages) || {};
  },

  removeWebsiteImage: async (
    key: keyof WebsiteImages
  ): Promise<WebsiteImages> => {
    const current = await websiteSettingsService.getWebsiteImages();

    const updated = { ...current };
    delete updated[key];

    const { data, error } = await supabase
      .from('WebsiteSettings')
      .update({
        value: updated,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'website_images')
      .select('value')
      .single();

    if (error) {
      console.error('Failed to remove website image:', error);
      throw error;
    }

    return (data.value as WebsiteImages) || {};
  },

  getCategoryImages: async (): Promise<CategoryImages> => {
    const { data, error } = await supabase
      .from('WebsiteSettings')
      .select('value')
      .eq('key', 'category_images')
      .maybeSingle();

    if (error) {
      console.error('Failed to load category images:', error);
      return {};
    }

    return (data?.value as CategoryImages) || {};
  },

  updateCategoryImage: async (
    key: keyof CategoryImages,
    url: string
  ): Promise<CategoryImages> => {
    const current = await websiteSettingsService.getCategoryImages();

    const updated: CategoryImages = {
      ...current,
      [key]: url,
    };

    const { data, error } = await supabase
      .from('WebsiteSettings')
      .upsert(
        {
          key: 'category_images',
          value: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select('value')
      .single();

    if (error) {
      console.error('Failed to update category image:', error);
      throw error;
    }

    return (data.value as CategoryImages) || {};
  },

  removeCategoryImage: async (
    key: keyof CategoryImages
  ): Promise<CategoryImages> => {
    const current = await websiteSettingsService.getCategoryImages();

    const updated = { ...current };
    delete updated[key];

    const { data, error } = await supabase
      .from('WebsiteSettings')
      .update({
        value: updated,
        updated_at: new Date().toISOString(),
      })
      .eq('key', 'category_images')
      .select('value')
      .single();

    if (error) {
      console.error('Failed to remove category image:', error);
      throw error;
    }

    return (data.value as CategoryImages) || {};
  },

  getContent: async (): Promise<WebsiteContent> => {
    const { data, error } = await supabase
      .from('WebsiteSettings')
      .select('value')
      .eq('key', 'content')
      .maybeSingle();

    if (error) {
      console.error('Failed to load website content:', error);
      return {};
    }

    return (data?.value as WebsiteContent) || {};
  },

  updateContent: async (
    content: Partial<WebsiteContent>
  ): Promise<WebsiteContent> => {
    const current = await websiteSettingsService.getContent();

    const updated: WebsiteContent = {
      ...current,
      ...content,
    };

    const { data, error } = await supabase
      .from('WebsiteSettings')
      .upsert(
        {
          key: 'content',
          value: updated,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select('value')
      .single();

    if (error) {
      console.error('Failed to update website content:', error);
      throw error;
    }

    return (data.value as WebsiteContent) || {};
  },
};

