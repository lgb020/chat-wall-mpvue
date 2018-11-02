const createMegaloTarget = require( '@megalo/target' )
const compiler = require( '@megalo/template-compiler' )
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' )
const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )
var CopyWebpackPlugin = require('copy-webpack-plugin')
const _ = require( './util' );

function createBaseConfig( platform = 'wechat' ) {
  const cssExt = platform === 'alipay' ? 'acss' : 'wxss'
  return {
    mode: 'development',

    target: createMegaloTarget( {
      compiler: Object.assign( compiler, { } ),
      platform,
      htmlParse: {
        templateName: 'octoParse',
        src: _.resolve(`./node_modules/octoparse/lib/platform/${platform}`)
      }
    } ),

    entry: {
      'app': _.resolve( 'src/index.js' ),
      'pages/home/index': _.resolve( 'src/pages/home/index.js' ),
      // 'packageA/pages/a/index': _.resolve( __dirname, 'src/index.js' ),
      // 'pages/index/index': _.resolve( 'src/pages/index/index.js' ),
      // 'pages/todomvc/index': _.resolve( 'src/pages/todomvc/index.js' ),
      // 'pages/v-model/index': _.resolve( 'src/pages/v-model/index.js' ),
      // 'pages/v-html/index': _.resolve( 'src/pages/v-html/index.js' ),
      // 'pages/vuex/index': _.resolve( 'src/pages/vuex/index.js' ),
    },

    output: {
      path: _.resolve( `dist-${platform}/` ),
      filename: 'static/js/[name].js',
      chunkFilename: 'static/js/[id].js'
    },

    devServer: {
      // hot: true,
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]|megalo[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },

    // devtool: 'cheap-source-map',
    devtool: false,

    resolve: {
      extensions: ['.vue', '.js', '.json'],
      alias: {
        // 'vue': _.resolve('../megalo/dist/megalo.mp.esm'),
        'vue': 'megalo',
        '@': _.resolve('src'),
      },
    },

    module: {
      rules: [
        // ... other rules
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
              options: {
                a: 1,
                cacheIdentifier: 'x'
              }
            }
          ]
        },

        {
          test: /\.js$/,
          use: 'babel-loader'
        },

        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },

        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ]
        }
      ]
    },

    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin( {
        filename: `./static/css/[name].${cssExt}`,
      } ),
      new CopyWebpackPlugin([
        {
          from: _.resolve(__dirname, '../modules'),
          to: _.resolve(__dirname, `../dist-${platform}/modules`),
          ignore: ['.*']
        }
      ])
    ]
  }
}

module.exports = createBaseConfig