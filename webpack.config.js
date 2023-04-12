const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  module: {                                                                                                                                     
    rules: [                                                                                                                                                                                                
      {                                                                                                                                                                                          
        test: /\.css$/i,                                                                                                                                                                                          
        use: ['style-loader', 'css-loader'],                                                                                                
      },                                                                                                                                                                                          
      {                                                                                                                                                                                          
        test: /\.(png|svg|jpg|jpeg|gif)$/i,                                                                                                
        type: 'asset/resource',                                                                                                
      },                                                                                                                                                                                          
      {                                                                                                                                                                                          
        test: /\.(woff|woff2|eot|ttf|otf)$/i,                                                                                                
        type: 'asset/resource',                                                                                                
      },                                                                                                                                                                                          
    ],                                                                                                                                                                                          
  },                                                                                                                                                                                          
};               

