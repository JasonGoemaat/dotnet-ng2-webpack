# webpack-angular

This project shows a dotnetcore project using webpack for typescript and
static content compilation.

# Description

The dotnetcore project runs on port 5000, the stylesheet and bundle are
added to "Views/Shared/_ViewStart.cshtml", and "Views/Home/index.cshtml" is the
main start page for our app where we use the "my-app" selector to run the
AppComponent.

The webpack dev server uses index.html and injects the bundle itself, but it
needs a link to the stylesheet still.  It runs on port 5001, and proxies
requests to `/api` to port 5000 for the dotnet app to handle.

# Building and running

## Development

I recommend using webpack as your dev server, running on port 5001.  It is
setup to proxy requests to the dotnet app running on port 5000.  So from two
different consoles, run `npm run serve` which will start the webpack-dev-server
on port 5001 with live reload and 'dotnet run' which will run the dotnet
app on port 5000 (which receives /api requests via webpack proxy).  This will
use `src/index` instead of the views in the dotnet app, however any changes
to your app code will cause an automatic reload of the page in your browser.

If you want to run with the code from the app, you need to run `npm run build`
first to create the bundle and css file in `wwwroot`, then start the dotnet
app with `dotnet run`.  You will need to manually refresh your browser after
you make a change.  You can use `npm run build -- --watch` to have
webpack automatically recompile your bundle when you make a change, but you
still need to manually reload your browser.

For the dotnet app you can also just debug from within Visual Studio 2015, but
you still need to run `npm run build` to produce the bundle and css.

## Production

Run `npm build:prod` to build for production with a minified bundle.

# dotnetcore

I started with a new web application project in visual studio.  I added an
'Api' folder and a WebApiController to that using the defaults so it is
'ValuesController'.  I also changed the port for iisexpress to be 5000.

In addition, I removed much of the stuff for other tooling, like the bundle
config and bower, both from the razor views and project.json.

Another important change was to add this to the first `<PropertyGroup>` in
DotnetNg2Webpack.xproj.  This is important, otherwise when you load the project
in Visual Studio, it will happily try to compile your typescript files into 
javascript in the same directory and those files will be used, making it so
that the angular components won't work.

    <TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>

You can run either with <kbd>F5</kbd> to launch from visual studio using
iisExpress, or from the command line with `dotnet run`.

# webpack

To build the app, run either `npm run build` or `npm run build:prod`.  To
launch the dev server on port 5001, run `npm run serve`.

The source is all in the 'src' directory and it produces build output in the
'wwwroot' directory, which is setup to be used for static content by the 
dotnet website.  The outputs:

* /index.html - copied from the index.html file in src with a link to the 
resulting bundle added automatically
* /app.bundle.js - the app bundle created from running the entry points
`/src/scripts.ts` and `/src/main.ts`
* /main.css - the result of compiling the sass file `/src/main.scss`, containing
custom bootstrap and the bootswatch theme 'spacelab', as well as
font-awesome
* /vendor/* - fonts from bootstrap GlyphIcons and Font-Awesome

## typescript

The first input file `src/scripts.ts` contain require statements for the
polyfills required by angular: `core-js`, `reflect-metadata`, and `zone.js`.
It also requires the scripts for jquery and lodash.  Lastly it 'requires'
the 'src/main.scss`, which is processed through the loader that compiles it
using node-sass into `/main.css` in the result.

The other file entry point is `src/main.ts` which bootstraps the angular
module. 

This uses 'angular2-template-loader' and 'awesome-typescript-loader'.  This
enables you to use relative paths in your templates and stylesheets in your
component file instead of using require():

    styleUrls: ['app.component.scss'],
    templateUrl: 'app.component.html'

## sass

Component style files (in the '/app' directory) can be in sass with the `.scss`
extension, that uses the sass and raw loaders so they appear as strings, just
like the html uses a raw loader.  Normal `.css` works using the raw loader
as well.

In addition, any `.scss` files outside the app folder will be loaded using
loaders in this order: 'sass', 'css?-url', 'extract', and 'file'.  The '?-url'
on the css loader tells it not to process `url()` in the resulting css, this
lets us keep the font and image files separate and not have to import them.
The resulting file is `[name].css` in the output, so right now we just use
'src/main.scss' to produce 'main.css' in the output directory ('wwwroot').
This has to be 'required' for webpack to process it, but the 'extract' loader
takes that out of the resulting bundle and uses the 'file' loader to create
a file from it.

## HMR

Hot module replacement is not enabled, maybe check out
[angular2-hmr](https://github.com/AngularClass/angular2-hmr).


# Idiosyncrasies

I have a `src/typings.d.ts` file with a couple of things:

1) The config file uses the DefinePlugin to create an app object with the
environment (from environment variable APP_ENVIRONMENT) set as a property.
This environment variable is set in the npm scripts using the cross-env
node module to 'production' or 'development'.  This type definition allows you
to use it in your typescript code:

    declare var app: {
        environment: string
    };

2) The require() runction needs to be defined so it can be used in your
typescript files.  This is provided by webpack when bundling and used in
`src/scripts.ts`:

    declare function require(id: string): any;

3) Any other type definitions you want that are not already specified in
your typings (see wijmo below)

# Wijmo

To use Wijmo controls, download their zip file and create a
`node_modules/wijmo` directory.  In there, put:

* the `controls` directory from the zip file, with files like `wijmo.chart.d.ts`.
* the `styles` directory from the zip file, with a `themes` subdirectory and
`wijmo.css` and `wijmo.min.css`
* the contents of the `Dist/Interop/Angular2/AMD` directory, with files like
`wijmo.angular2.all.d.ts` and `wijmo.angular2.all.min.js`.

Note: those AMD files seem to be UTF-8 with byte-order-mark, that needs to be
removed or in my version of webpack 2 the BOM is inserted into the bundle and
causes errors.  I recommend the node package `strip-bom` and this little shell
script will do that for all files in the current directory and put them in a
`fixed` subdirectory:
    
    for file in *
    do
        strip-bom $file > ./fixed/$file
    done

Finally, you need to include all those `.d.ts` files from the controls
directory in your project somewhere.  You can just create your own file to
reference them if you want from your node_modules/wijmo directory,
see `src/wijmo.d.ts`.

`src/scripts.ts` has commented lines showing how you could load wijmo scripts
and styles into your bundle from `node_modules/wijmo`:

    // Wijmo styles and scripts (not *.angular2 modules)
    require('style!css!../node_modules/wijmo/styles/wijmo.min.css');
    require('style!css!../node_modules/wijmo/styles/themes/wijmo.theme.cleanlight.min.css');
    require('script!../node_modules/wijmo/controls/wijmo.min.js');
    require('script!../node_modules/wijmo/controls/wijmo.input.min.js');
