
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  websiteSettingsService,
  type WebsiteImages,
  type CategoryImages,
  type WebsiteContent,
  type AppearanceSettings,
} from '@/services/websiteSettingsService';

interface WebsiteSettingsContextType {
  images: WebsiteImages;
  categoryImages: CategoryImages;
  content: WebsiteContent;
  appearance: AppearanceSettings | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextType | undefined>(undefined);

export function WebsiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [images, setImages] = useState<WebsiteImages>({});
  const [categoryImages, setCategoryImages] = useState<CategoryImages>({});
  const [content, setContent] = useState<WebsiteContent>({});
  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [imagesData, categoryImagesData, contentData, appearanceData] = await Promise.all([
        websiteSettingsService.getWebsiteImages(),
        websiteSettingsService.getCategoryImages(),
        websiteSettingsService.getContent(),
        websiteSettingsService.getAppearance(),
      ]);
      setImages(imagesData);
      setCategoryImages(categoryImagesData);
      setContent(contentData);
      setAppearance(appearanceData);
    } catch (error) {
      console.error('Failed to load website settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <WebsiteSettingsContext.Provider
      value={{
        images,
        categoryImages,
        content,
        appearance,
        loading,
        refresh: loadSettings,
      }}
    >
      {children}
    </WebsiteSettingsContext.Provider>
  );
}

export function useWebsiteSettings() {
  const context = useContext(WebsiteSettingsContext);
  if (context === undefined) {
    throw new Error('useWebsiteSettings must be used within a WebsiteSettingsProvider');
  }
  return context;
}
