const path = require('path');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
