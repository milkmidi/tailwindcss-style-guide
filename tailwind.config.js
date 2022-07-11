/* eslint-disable no-param-reassign */
const plugin = require('tailwindcss/plugin');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  mode: 'jit', // TODO 2
  content: ['./src/**/*.{html,js,ejs}'],
  theme: {
    extend: {
      colors: {
        'pg-black': {
          DEFAULT: '#000000',
          hover: '#585858',
          active: '#3D3D3D',
        },
        'pg-light': {
          // 1 : '#ffffff',
          // 2 : '#F6F6F6',
          // 3 : '#E7E7E7',
          DEFAULT: '#B8B8B8',
        },
        'pg-dark': {
          // 1: '#000000',
          // 2: '#282828',
          DEFAULT: '#757575',
        },
        'pg-yellow': {
          DEFAULT: '#FFD91A',
        },
        'pg-red': {
          // DEFAULT: '#E02020',
          DEFAULT: 'var(--pg-red)',
          hover: '#FF2424',
          active: '#C20E0E',
        },
        'pg-green': {
          DEFAULT: '#00994D',
        },
      },
    },
  },
  plugins: [
    // eslint-disable-next-line
    plugin(({ addUtilities, matchUtilities, addComponents, addVariant, e, theme }) => {
      addComponents({
        '.pg-font-robot': {
          'font-family': "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        },
        '.pg-font-robot-condensed': {
          'font-family': "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        },
        '.pg-font-proxima-nova': {
          'font-family': "'proxima-nova', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        },
        '.pg-font-raleway': { 'font-family': 'raleway, sans-serif' },
        '.pg-container-section': { 'max-width': '2560px' },
        '.pg-container-outer': { 'max-width': '1720px' },
        '.pg-container-inner': { 'max-width': '1240px' },
        // Components
        '.pg-btn': {
          '--pg-btn-height': '40px',
          '--pg-btn-font-size': '14px',
          height: 'var(--pg-btn-height)',
          'border-radius': '8px',
          'font-size': 'var(--pg-btn-font-size)',
          'padding-left': '24px',
          'padding-right': '24px',
          '@apply inline-flex justify-center items-center': {}, // cssInJS 可以用這樣寫
          '&:disabled, &[data-disabled="true"]': {
            'background-color': '#B8B8B8 !important',
            'pointer-events': 'none',
            color: '#878787 !important',
          },
          '&.pg-btn--sm': {
            '--pg-btn-height': '32px',
            '--pg-btn-font-size': '12px',
          },
          '&.pg-btn--lg': {
            '--pg-btn-height': '48px',
            '--pg-btn-font-size': '16px',
          },
          '&.pg-btn--xl': {
            '--pg-btn-height': '58px',
            '--pg-btn-font-size': '18px',
          },
          '&.pg-btn--2xl': {
            '--pg-btn-height': '68px',
            '--pg-btn-font-size': '24px',
          },
          '&.pg-btn--red': {
            '@apply bg-pg-red text-white hover:bg-pg-red-hover active:bg-pg-red-active':
              {},
          },
          '&.pg-btn--black': {
            '@apply bg-black text-white hover:bg-pg-black-hover active:bg-pg-black-active':
              {},
          },
        },
      });

      const utilities = {
        // https://play.tailwindcss.com/QNkCU1z1UX?file=config
        '.bg-stripes': {
          'background-size': '7.07px 7.07px',
          'background-color': 'white',
          'background-image': `linear-gradient(135deg,var(--stripes-color) 10%,transparent 0,transparent 50%,var(--stripes-color) 0,var(--stripes-color) 60%,transparent 0,transparent)`,
        },
      };
      Object.keys(theme('colors'))
        .filter((key) => key.indexOf('pg-') !== -1)
        .forEach((colorName) => {
          const color = `${theme('colors')[colorName].DEFAULT}80`;
          utilities[`.bg-stripes-${colorName}`] = {
            '--stripes-color': color,
          };
        });
      addUtilities(utilities);

      addVariant('child', '& > *');

      addVariant('data-active', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.${e(`data-active${separator}${className}`)}[data-active="true"]`,
        );
      });
      // 登入後，會在 body 加上 logged-in class
      addVariant('logged-in', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) => `body.logged-in .${e(`logged-in${separator}${className}`)}`,
        );
      });

      // https://tailwindcss.com/docs/plugins#complex-variants
      addVariant('important', ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.\\!${rule.selector.slice(1)}\\`;
          rule.walkDecls((decl) => {
            decl.important = true;
          });
        });
      });
    }),
  ],
};
