
import { useEffect } from 'react';
import { websiteSettingsService } from '@/services/websiteSettingsService';

/**
 * Converts a HEX color such as #B08D57
 * into RGB channels such as "176 141 87".
 *
 * RGB channels are required so Tailwind can support
 * opacity utilities such as:
 *
 * bg-gold/50
 * text-taupe/60
 * border-charcoal/20
 */
function hexToRgb(hex: string): string {
  const normalized = hex.replace('#', '').trim();

  let value = normalized;

  // Support short HEX colors such as #fff
  if (value.length === 3) {
    value = value
      .split('')
      .map((character) => character + character)
      .join('');
  }

  if (value.length !== 6) {
    return '0 0 0';
  }

  const red = parseInt(value.substring(0, 2), 16);
  const green = parseInt(value.substring(2, 4), 16);
  const blue = parseInt(value.substring(4, 6), 16);

  if (
    Number.isNaN(red) ||
    Number.isNaN(green) ||
    Number.isNaN(blue)
  ) {
    return '0 0 0';
  }

  return `${red} ${green} ${blue}`;
}

/**
 * Mixes two HEX colors.
 *
 * This is used to automatically create subtle
 * border and secondary background colors from
 * the colors selected in Admin > Appearance.
 */
function mixColors(
  color1: string,
  color2: string,
  amount: number
): string {
  const rgb1 = hexToRgb(color1)
    .split(' ')
    .map(Number);

  const rgb2 = hexToRgb(color2)
    .split(' ')
    .map(Number);

  const mixed = rgb1.map((value, index) =>
    Math.round(
      value + (rgb2[index] - value) * amount
    )
  );

  return mixed.join(' ');
}

export default function WebsiteAppearance() {
  useEffect(() => {
    let cancelled = false;

    const applyAppearance = async () => {
      try {
        const settings =
          await websiteSettingsService.getAppearance();

        if (cancelled) {
          return;
        }

        const root = document.documentElement;

        /*
         * --------------------------------------------------
         * Main dynamic colors
         * --------------------------------------------------
         */

        root.style.setProperty(
          '--website-primary-rgb',
          hexToRgb(settings.primaryColor)
        );

        root.style.setProperty(
          '--website-accent-rgb',
          hexToRgb(settings.accentColor)
        );

        root.style.setProperty(
          '--website-background-rgb',
          hexToRgb(settings.backgroundColor)
        );

        root.style.setProperty(
          '--website-text-rgb',
          hexToRgb(settings.textColor)
        );

        /*
         * --------------------------------------------------
         * Automatically generated supporting colors
         * --------------------------------------------------
         */

        root.style.setProperty(
          '--website-border-rgb',
          mixColors(
            settings.textColor,
            settings.backgroundColor,
            0.88
          )
        );

        root.style.setProperty(
          '--website-light-taupe-rgb',
          mixColors(
            settings.backgroundColor,
            settings.textColor,
            0.08
          )
        );

        /*
         * --------------------------------------------------
         * Button shape
         * --------------------------------------------------
         */

        root.style.setProperty(
          '--website-button-radius',
          settings.buttonRadius
        );

        /*
         * --------------------------------------------------
         * Dynamic fonts
         * --------------------------------------------------
         */

        root.style.setProperty(
          '--website-heading-font',
          `"${settings.headingFont}"`
        );

        root.style.setProperty(
          '--website-body-font',
          `"${settings.bodyFont}"`
        );

        /*
         * --------------------------------------------------
         * Raw color variables
         *
         * Useful for custom CSS components.
         * --------------------------------------------------
         */

        root.style.setProperty(
          '--website-primary',
          settings.primaryColor
        );

        root.style.setProperty(
          '--website-accent',
          settings.accentColor
        );

        root.style.setProperty(
          '--website-background',
          settings.backgroundColor
        );

        root.style.setProperty(
          '--website-text',
          settings.textColor
        );
      } catch (error) {
        console.error(
          'Failed to apply website appearance:',
          error
        );
      }
    };

    applyAppearance();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

