const highlight = require('highlight.js');

module.exports = function(options) {
  highlight.configure(options);

  return function highlightContent(root, data, metalsmith, done) {
    const codeBlocks = root.querySelectorAll('code');
    for (let i = 0; i < codeBlocks.length; i++) {
      codeBlock = codeBlocks[i];
      highlight.highlightBlock(codeBlock);

      // Tag the parent node as well for style adjustments
      if (codeBlock.parentNode && codeBlock.parentNode.classList) {
        codeBlock.parentNode.classList.add('lang-highlight');
      }
    }

    done();
  };
};
