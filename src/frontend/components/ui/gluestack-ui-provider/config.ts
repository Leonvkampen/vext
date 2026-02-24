import { vars } from 'nativewind';

export const config = {
  dark: vars({
    '--color-background-0': '10 10 15',       // #0A0A0F deep dark bg
    '--color-background-50': '23 23 23',       // #171717 card/surface
    '--color-background-100': '38 38 38',      // #262626 border/elevated
    '--color-primary-500': '52 211 153',       // #34D399 emerald accent
    '--color-primary-600': '16 185 129',       // #10B981 accent pressed
    '--color-typography-0': '250 250 250',     // #FAFAFA primary text
    '--color-typography-400': '163 163 163',   // #A3A3A3 secondary text
    '--color-typography-500': '115 115 115',   // #737373 muted text
    '--color-error-500': '239 68 68',          // #EF4444 destructive
    '--color-success-500': '34 197 94',        // #22C55E success
  }),
  light: vars({
    '--color-background-0': '255 255 255',
    '--color-background-50': '245 245 245',
    '--color-background-100': '229 229 229',
    '--color-primary-500': '16 185 129',
    '--color-primary-600': '5 150 105',
    '--color-typography-0': '23 23 23',
    '--color-typography-400': '115 115 115',
    '--color-typography-500': '163 163 163',
    '--color-error-500': '239 68 68',
    '--color-success-500': '34 197 94',
  }),
};
