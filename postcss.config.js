
const productionPlugins = {
  cssnano: {}
}

const config = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? productionPlugins : {})
  }
}


module.exports = config;