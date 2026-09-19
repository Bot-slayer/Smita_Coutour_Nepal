
import { useEffect, useState } from 'react';
import {
  Save,
  RotateCcw,
  Palette,
  Type,
  Square,
  Check,
} from 'lucide-react';
import {
  websiteSettingsService,
  type AppearanceSettings,
} from '@/services/websiteSettingsService';

const DEFAULT_APPEARANCE: AppearanceSettings = {
  primaryColor: '#2B2927',
  accentColor: '#B08D57',
  backgroundColor: '#F8F5F0',
  textColor: '#2B2927',
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  buttonRadius: '0px',
};

const FONT_OPTIONS = [
  'Playfair Display',
  'Cormorant Garamond',
  'Libre Baskerville',
  'DM Serif Display',
  'Lora',
  'Inter',
  'Montserrat',
  'Poppins',
  'Open Sans',
  'Roboto',
];

const BUTTON_RADIUS_OPTIONS = [
  {
    value: '0px',
    label: 'Square',
  },
  {
    value: '4px',
    label: 'Slightly Rounded',
  },
  {
    value: '8px',
    label: 'Rounded',
  },
  {
    value: '9999px',
    label: 'Pill',
  },
];

export default function AppearanceSettings() {
  const [settings, setSettings] =
    useState<AppearanceSettings>(DEFAULT_APPEARANCE);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError('');

        const data =
          await websiteSettingsService.getAppearance();

        setSettings(data);
      } catch (err) {
        console.error(
          'Failed to load appearance settings:',
          err
        );

        setError(
          'Unable to load appearance settings.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = <K extends keyof AppearanceSettings>(
    key: K,
    value: AppearanceSettings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError('');

      await websiteSettingsService.updateAppearance(
        settings
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        'Failed to save appearance settings:',
        err
      );

      setError(
        'Unable to save appearance settings. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_APPEARANCE);
    setSaved(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-56 bg-light-taupe rounded" />
          <div className="h-32 bg-light-taupe rounded" />
          <div className="h-64 bg-light-taupe rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-light-taupe flex items-center justify-center">
              <Palette size={20} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif text-charcoal">
              Appearance
            </h1>
          </div>

          <p className="text-sm text-taupe">
            Customize the visual style of your website
            without changing the code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-border text-xs tracking-widest uppercase font-sans hover:border-charcoal transition-colors disabled:opacity-50"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-charcoal text-ivory text-xs tracking-widest uppercase font-sans hover:bg-gold transition-colors disabled:opacity-50"
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

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colors */}
        <div className="lg:col-span-2 bg-white border border-border/70">
          <div className="p-6 border-b border-border/70">
            <div className="flex items-center gap-3">
              <Palette size={18} />

              <div>
                <h2 className="font-serif text-xl text-charcoal">
                  Colors
                </h2>

                <p className="text-xs text-taupe mt-1">
                  Choose the main colors used throughout
                  the website.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ColorField
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(value) =>
                updateSetting('primaryColor', value)
              }
            />

            <ColorField
              label="Accent Color"
              value={settings.accentColor}
              onChange={(value) =>
                updateSetting('accentColor', value)
              }
            />

            <ColorField
              label="Background Color"
              value={settings.backgroundColor}
              onChange={(value) =>
                updateSetting(
                  'backgroundColor',
                  value
                )
              }
            />

            <ColorField
              label="Text Color"
              value={settings.textColor}
              onChange={(value) =>
                updateSetting('textColor', value)
              }
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white border border-border/70">
          <div className="p-6 border-b border-border/70">
            <h2 className="font-serif text-xl text-charcoal">
              Preview
            </h2>

            <p className="text-xs text-taupe mt-1">
              Preview your selected colors.
            </p>
          </div>

          <div
            className="p-6 min-h-[260px] flex flex-col justify-center"
            style={{
              backgroundColor:
                settings.backgroundColor,
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{
                color: settings.accentColor,
              }}
            >
              Smita Couture Nepal
            </p>

            <h3
              className="text-2xl mb-3"
              style={{
                color: settings.primaryColor,
                fontFamily: `"${settings.headingFont}", serif`,
              }}
            >
              Timeless Elegance
            </h3>

            <p
              className="text-sm mb-5"
              style={{
                color: settings.textColor,
                fontFamily: `"${settings.bodyFont}", sans-serif`,
              }}
            >
              Discover beautiful handcrafted
              collections.
            </p>

            <button
              type="button"
              className="self-start px-5 py-2.5 text-xs uppercase tracking-widest text-white"
              style={{
                backgroundColor:
                  settings.primaryColor,
                borderRadius:
                  settings.buttonRadius,
              }}
            >
              Explore
            </button>
          </div>
        </div>

        {/* Typography */}
        <div className="lg:col-span-2 bg-white border border-border/70">
          <div className="p-6 border-b border-border/70">
            <div className="flex items-center gap-3">
              <Type size={18} />

              <div>
                <h2 className="font-serif text-xl text-charcoal">
                  Typography
                </h2>

                <p className="text-xs text-taupe mt-1">
                  Select the fonts for headings and body
                  text.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FontSelect
              label="Heading Font"
              value={settings.headingFont}
              options={FONT_OPTIONS}
              onChange={(value) =>
                updateSetting(
                  'headingFont',
                  value
                )
              }
            />

            <FontSelect
              label="Body Font"
              value={settings.bodyFont}
              options={FONT_OPTIONS}
              onChange={(value) =>
                updateSetting(
                  'bodyFont',
                  value
                )
              }
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white border border-border/70">
          <div className="p-6 border-b border-border/70">
            <div className="flex items-center gap-3">
              <Square size={18} />

              <div>
                <h2 className="font-serif text-xl text-charcoal">
                  Buttons
                </h2>

                <p className="text-xs text-taupe mt-1">
                  Choose your button corner style.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <label className="block text-xs tracking-widest uppercase text-taupe mb-3">
              Button Shape
            </label>

            <div className="space-y-2">
              {BUTTON_RADIUS_OPTIONS.map(
                (option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      updateSetting(
                        'buttonRadius',
                        option.value
                      )
                    }
                    className={`w-full flex items-center justify-between px-4 py-3 border text-sm transition-colors ${
                      settings.buttonRadius ===
                      option.value
                        ? 'border-charcoal bg-light-taupe/40'
                        : 'border-border hover:border-charcoal'
                    }`}
                  >
                    <span>{option.label}</span>

                    {settings.buttonRadius ===
                      option.value && (
                      <Check size={15} />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-ivory text-xs tracking-widest uppercase font-sans hover:bg-gold transition-colors disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check size={14} />
              Changes Saved
            </>
          ) : (
            <>
              <Save size={14} />
              {saving
                ? 'Saving...'
                : 'Save Appearance'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({
  label,
  value,
  onChange,
}: ColorFieldProps) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-3">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-12 h-12 p-1 border border-border bg-white cursor-pointer"
        />

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="flex-1 min-w-0 px-3 py-2.5 border border-border bg-white text-sm font-mono uppercase focus:outline-none focus:border-charcoal"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface FontSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FontSelect({
  label,
  value,
  options,
  onChange,
}: FontSelectProps) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase text-taupe mb-3">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full px-3 py-3 border border-border bg-white text-sm focus:outline-none focus:border-charcoal"
      >
        {options.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <p
        className="mt-3 text-lg"
        style={{
          fontFamily: `"${value}", serif`,
        }}
      >
        Sample Text
      </p>
    </div>
  );
}

