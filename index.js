const domTransform = require('metalsmith-dom-transform');
const highlightTransform = require('./transform');

module.exports = function(options) {
  return domTransform({
    transforms: [highlightTransform(options)],
  });
};
