var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var OccurrenceOrderPlugin = require("webpack/lib/optimize/OccurrenceOrderPlugin");
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = {
    // possibly check out code splitting: https://webpack.github.io/docs/code-splitting.html
    entry: {
        "app": ["./src/main.ts"],
        "vendor": ["./src/scripts.ts"],
        "css": ["./src/main.scss"],
    },

    output: {
        path: './wwwroot',
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js',
        library: 'ac_[name]',
        libraryTarget: 'var',
    },

    root: path.resolve(__dirname, 'src'),
    
    modulesDirectories: ['node_modules'],

    module: {
        // from http://stackoverflow.com/questions/34907841/how-to-make-webpack-exclude-angular2-modules
        //noParse: [/rxjs/],

        // use source-map-loader, but only for our app
        preLoaders: [
            {
                test: /\.ts/,
                loader: "source-map-loader",
                include: /src\/app/,
                exclude: /node_modules/,
            },
            {
                // per angular2-webpack-starter, some packages have problems with sourcemaps
                test: /\.js/,
                loader: "source-map-loader",
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
            },
        ],
        loaders: [
            // special loaders for angular templates
            { test: /\.ts$/, exclude: /node_modules/, loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
            { test: /\.html$/, loader: 'raw', exclude: /index.html/ }, // for templates, need 'raw'
            { test: /\.css$/, loader: 'raw', exclude: /node_modules/ }, // for templates, need 'raw'
            { test: /\.scss$/, include: /src\/app/, loaders: ['raw', "sass"] }, // for templates, need 'raw'
            
            // loader for separate sass 'scss' files to compile them to css
            { test: /\.scss$/,
                exclude: /src\/app/,
                loaders: [
                    {
                        loader: 'file',
                        query: {
                            name: '[name].css'
                        }
                    }, 'extract', 'css?-url', 'sass' // compile with sass, then css, then extract to file
                ] 
            }
        ]
    },
    
    resolve: {
        // extensions: ['', '.js', '.ts', '.html', '.css', '.min.js', 
        //     '.min.css', '.sass', '.scss'],
        extensions: ['', '.ts', '.js', '.json'],
        //exclude: [ /node_modules/, /rxjs/ ],
        
        // ----- naive try to get it to use precompiled rx bundle
        // alias: {
        //     'rxjs': "/node_modules/rxjs/bundles/Rx.umd.min.js"
        // }
    },

    plugins: [
        // list: https://github.com/webpack/docs/wiki/list-of-plugins


        // https://github.com/s-panferov/awesome-typescript-loader
        // Does type checking in a separate process to typescript doesn't have
        // to wait, 'Significantly' improves development workflow with tools
        // like react-hot-loader
        new ForkCheckerPlugin(),

        /*
        * Plugin: OccurenceOrderPlugin
        * Description: Varies the distribution of the ids to get the smallest id length
        * for often used ids.
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        * See: https://github.com/webpack/docs/wiki/optimization#minimize
        */
        new OccurrenceOrderPlugin(true),

        // to split common code into a vendor chunk
        new CommonsChunkPlugin({
            name: ["vendor"]
        }),

        // ignore paths we include bundles from
        // http://stackoverflow.com/questions/34907841/how-to-make-webpack-exclude-angular2-modules
        //new webpack.IgnorePlugin(/rxjs/),
        
        // copy index file and insert script tags for bundles
        new HtmlWebpackPlugin({ template: './src/index.html' }),

        // define our environment to use in our code        
        new webpack.DefinePlugin({ app: {
                environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
            }
        }),

        // copy various things, including fonts for bootstrap glyphicons and
        // font-awesome, as well as anything we put in src/public
        new CopyWebpackPlugin([
            { // copy rxjs bundle
                from: 'node_modules/rxjs/bundles/Rx.umd.min.js'
            },
            { // copy all contents of 'public' folder over
                from: 'src/public'
            },
            { // copy bootstrap fonts
                from: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
                to: 'assets/fonts',
                flatten: true            },
            { // copy font-awesome fonts
                from: 'node_modules/font-awesome/fonts/*',
                to: 'assets/fonts',
                flatten: true            },
        ]),

    ],

    // sass config - not really using
    sassLoader: {
        includePaths: [
            // path.resolve(__dirname, "./node_modules/bootstrap/assets"),
            // path.resolve(__dirname, "./include")
        ]
    },

    // dev server options (proxy to api)
    devServer: {
        port: 5001,
        quiet: false,
        stats: { color: true },
        proxy: {
            "/api/*": {
                target: 'http://localhost:5000',
                secure: false,
                changeOrigin: true,
                ignorePath: false,
            },
        }
    },

    // create sourcemap, recommend eval-cheap-module-sourcemaps
    // http://webpack.github.io/docs/build-performance.html
    //devtool: 'eval-cheap-module-sourcemaps'
}