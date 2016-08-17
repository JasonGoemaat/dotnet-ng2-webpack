var path = require('path');
var webpack = require('webpack');

module.exports = {    
    // possibly check out code splitting: https://webpack.github.io/docs/code-splitting.html
    entry: {
        "angular": ["@angular/core", "@angular/common", "@angular/compiler", "@angular/forms", "@angular/http", "@angular/platform-browser-dynamic"],
        "rxjs": ["rxjs"],
        "other": ["core-js", "zone.js"],
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

    plugins: [
        new webpack.DllPlugin({
            path: './wwwroot/[name]-manifest.json',
            name: '[name]_lib',
            context: '.'
        })
    ],
}