var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

module.exports = {
    // possibly check out code splitting: https://webpack.github.io/docs/code-splitting.html
    entry: {
        "vendor": ["./src/vendor.ts"],
    },

    output: {
        // check out http://stackoverflow.com/questions/29267084/how-to-improve-webpack-babel-build-performance-without-using-the-watch-feature

        // https://robertknight.github.io/posts/webpack-dll-plugins/
        // https://medium.com/@soederpop/webpack-plugins-been-we-been-keepin-on-the-dll-cdfdd6cb8cd7#.2n1ipz7se
        // http://engineering.invisionapp.com/post/optimizing-webpack/
        path: './wwwroot',
        filename: '[name].dll.js',
        library: '[name]_lib',
    },

    //root: 'src',
    modulesDirectories: ['node_modules'],

    module: {
        // from http://stackoverflow.com/questions/34907841/how-to-make-webpack-exclude-angular2-modules
        //noParse: [/rxjs/],

        // use source-map-loader, but only for our app
        preLoaders: [
            {
                include: /src\/app/,
                exclude: /node_modules/,
                loader: "source-map-loader"
            }
        ],
        loaders: [
            // special loaders for angular templates
            { test: /\.ts$/, exclude: /node_modules/, loaders: ['awesome-typescript-loader', 'angular2-template-loader'] },
            { test: /\.html$/, loader: 'raw' }, // for templates, need 'raw'
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
        extensions: ['', '.js', '.ts', '.html', '.css', '.min.js', 
            '.min.css', '.sass', '.scss'],
        //exclude: [ /node_modules/, /rxjs/ ],
        
        // ----- naive try to get it to use precompiled rx bundle
        // alias: {
        //     'rxjs': "/node_modules/rxjs/bundles/Rx.umd.min.js"
        // }
    },

    plugins: [
        new webpack.DllPlugin({
            path: './wwwroot/[name]-manifest.json',
            name: '[name]_lib',
            context: '.'
        })
    ]
}