// 配置webextension-toolbox中的webpack

const webpack = require('webpack')
const { resolve } = require('path')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config

    // Important: return the modified config
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.ts$/,
      loader: 'ts-loader'
    }, {
      test: /\.tsx$/,
      loader: 'ts-loader'
    });

    config.resolve.extensions.push('.tsx', '.ts', '.scss');

    config.entry = GlobEntriesPlugin.getEntries(
      [
        // resolve('app', '*.{js,mjs,jsx,ts,tsx}'),
        // resolve('app', '?(scripts)/*.{js,mjs,jsx,ts,tsx}')
        resolve('app', '?(scripts)/background.ts'),
        resolve('app', '?(scripts)/devtools.ts'),
        resolve('app', '?(scripts)/networkx.tsx')
      ]
    )
    console.log(config.entry());

    config.devtool = 'inline-source-map';

    console.log(config)
    return config
  }
}
