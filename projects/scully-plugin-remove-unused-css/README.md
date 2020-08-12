# scully-plugin-remove-unused-css

This `postRenderer` plugin for [Scully](http://scully.io/) will remove unused CSS from the HTML of your prerendered pages. 

Plugin will remove unnecessary CSS code from rendered Scully static HTMLs,
which will decrease the size of your pages and drastically improve loading times.

Highly recommended to use this plugin along with CSS libraries like Angular Material.

## Installation

To install this library with `npm` run

```
$ npm install scully-plugin-remove-unused-css --save-dev
```
or with `yarn`
```
$ yarn add scully-plugin-remove-unused-css --dev
```

This package depends on packages:
- [`extract-css`](https://www.npmjs.com/package/extract-css)
- [`PurgeCSS`](https://www.npmjs.com/package/extract-css)

Both will be installed during `scully-remove-unused-css` installation.

## Usage

Import and add the plugin to the `defaultPostRenderers` to execute it on all rendered pages 
or use the `postRenderers` on a route configuration to execute it for a specific route. 

```js
const { RouteTypes } = require('@scullyio/scully');
const { RemoveUnusedCSSPlugin } = require('scully-remove-unused-css');

exports.config = {
  projectRoot: './src/app',
  defaultPostRenderers: [RemoveUnusedCSSPlugin],  // for all routes
  routes: {
    '/blog/:slug': {
      type: RouteTypes.contentFolder,
      slug: {
        folder: "./blog"
      },
      postRenderers: [RemoveUnusedCSSPlugin]      // per route config
    },
  }
};
```

Now build your app and then just run the Scully command.

```shell script
npm run build --prod
npm run scully
```

## More information

More info on getting started with [Scully](http://scully.io/) can be found on [their homepage](http://scully.io/).
