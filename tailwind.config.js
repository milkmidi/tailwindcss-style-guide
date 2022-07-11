const plugin = require('tailwindcss/plugin');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  mode: "jit", // TODO 2
  content: ["./src/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors: {
        primary: '#16a085',
        'pg-light': {
          // 1 : '#ffffff',
          // 2 : '#F6F6F6',
          // 3 : '#E7E7E7',
          DEFAULT: '#B8B8B8'
        },
        'pg-dark': {
          // 1: '#000000',
          // 2: '#282828',
          DEFAULT: '#757575'
        },
        'pg-yellow': {
          DEFAULT: '#FFD91A',
        },
        'pg-red': {
          DEFAULT: '#E02020',
        },
        'pg-green': {
          DEFAULT: '#00994D'
        }
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, matchUtilities, addComponents, addVariant, e, theme }) => {
      addComponents({
        '.pg-font-robot': { 'font-family': "'Roboto', 'Helvetica Neue', Arial, sans-serif" },
        '.pg-font-robot-condensed': { 'font-family': "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif" },
        '.pg-font-proxima-nova': { 'font-family': "'proxima-nova', 'Roboto', 'Helvetica Neue', Arial, sans-serif" },
        '.pg-font-raleway': { 'font-family': 'raleway, sans-serif' },
      });
     
      addVariant('child', '& > *') // TODO 4

      
      addVariant('data-active', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => `.${e(`data-active${separator}${className}`)}[data-active="true"]`);
      });
      // 登入後，會在 body 加上 logged-in class
      addVariant('logged-in', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => `body.logged-in .${e(`logged-in${separator}${className}`)}`);
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
    })
  ],
}
