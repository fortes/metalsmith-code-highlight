const highlight = require('highlight.js');
const defaults = {selector: 'code'};

module.exports = function(options) {
  highlight.configure(options);
  let normalizedOptions = Object.assign({}, defaults, options);
  let {selector} = normalizedOptions;

  return function highlightContent(root, data, metalsmith, done) {
    Array.from(root.querySelectorAll(selector)).forEach(node => {
      highlight.highlightBlock(node);

      // Tag the parent node as well for style adjustments
      if (node.parentNode && node.parentNode.classList) {
        node.parentNode.classList.add('lang-highlight');
      }
    });

    done();
  };
};
