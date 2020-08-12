const {PurgeCSS} = require('purgecss');
const {registerPlugin} = require('@scullyio/scully');
const extractCss = require('extract-css');

export const RemoveUnusedCSSPlugin = 'removeUnusedCSS';

const index = async (html, route) => {
  const pure = removeEmptyStyleTags(html);

  return new Promise((resolve, reject) => {
    extractCss(pure, {
      removeStyleTags: true,
      applyStyleTags: true
    }, (err, cleanHtml, css) => {
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
        const readyHTML = appendCSS(cleanHtml, res[0].css);
        resolve(readyHTML);
      }).catch(e => reject(e));
    });
  });
};

const removeEmptyStyleTags = (html: string): string => {
  return html.replace('<style></style>', '');
};

const appendCSS = (html, css) => {
  const parts = html.split('</head>');
  return `${parts[0]}<style>${css}</style></head>${parts[1]}`;
};

registerPlugin('render', RemoveUnusedCSSPlugin, index);
