module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactOccurrenceBrowser',
      externals: {
        
      }
    }
  },
  babel: {
    plugins: 'import-css-to-jss'
  },
  webpack: {
    html: {
      template: 'src/demo.html'
    }
  }
}
