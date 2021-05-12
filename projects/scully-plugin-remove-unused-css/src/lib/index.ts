const { registerPlugin, log, logWarn, yellow } = require('@scullyio/scully');
const { PurgeCSS } = require('purgecss');
const extractCss = require('extract-css');

export const RemoveUnusedCSSPlugin = 'removeUnusedCSS';

export const removeUnusedCSSPlugin = async (html: string, route: any) => {

  const htmlWithoutStyles = removeEmptyStyleTags(html);
  log(`Searching for unused CSS in ${extractRouteLog(route)}:`);

  return new Promise<string>((resolve, reject) => {
    extractCss(htmlWithoutStyles, {
      removeStyleTags: true,
      applyStyleTags: true
    }, (err: string, cleanHtml: string, css: string) => {
      new PurgeCSS().purge({
        content: [
          {
            raw: cleanHtml,
            extension: 'html'
          }
        ],
        css: [
          {
            raw: css
          }
        ]
      }).then(res => {
        const purgedHtml = appendCSS(cleanHtml, res[0].css);
        if (html.length === purgedHtml.length) {
          log(`  No unused CSS found in ${extractRouteLog(route)}.\n`);
        } else {
          log(`  Removed unused ${yellow(`${html.length - purgedHtml.length}`)} characters of CSS in ${extractRouteLog(route)}.\n`);
        }
        resolve(purgedHtml);
      }).catch(e => {
        logWarn(`  Error in removeUnusedCSSPlugin, could not process purge CSS in ${extractRouteLog(route)}.\n`);
        reject(e);
      });
    });
  });
};

const extractRouteLog = (route) => `"${yellow(`${route.route}/index.html`)}"`;

const removeEmptyStyleTags = (html: string): string => {
  return html.replace('<style></style>', '');
};

const appendCSS = (html, css) => {
  const parts = html.split('</head>');
  return `${parts[0]}<style>${css}</style></head>${parts[1]}`;
};

registerPlugin('postProcessByHtml', RemoveUnusedCSSPlugin, removeUnusedCSSPlugin);
