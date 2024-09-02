// const path = require('path');
// const Dotenv = require('dotenv-webpack');

// module.exports = {
//   mode: 'development',
//   entry: './src/script.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.css$/i,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
//   devServer: {
//     static: {
//       directory: path.join(__dirname, 'dist'),
//     },
//     compress: true,
//     port: 9000,
//   },
//   plugins: [
//     new Dotenv(),
//   ],
// };

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/script.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
    plugins: [
      new Dotenv(),
    ],
    optimization: isProduction ? {
      // Example optimization for production
      splitChunks: {
        chunks: 'all',
      },
    } : {},
  };
};


