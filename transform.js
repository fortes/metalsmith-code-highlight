const highlight = require('highlight.js');

const CODE_LANGUAGE_REGEXP = /^lang-(.+)$/;

function getLanguage(element) {
  for (let i = 0; i < element.classList.length; i++) {
    const match = element.classList[i].match(CODE_LANGUAGE_REGEXP);
    if (match) {
      return match[1];
    }
  }

  return null;
}

module.exports = function(options) {
  highlight.configure(options);

  return function highlightContent(root, data, metalsmith, done) {
    const codeBlocks = root.querySelectorAll('code');
    for (let i = 0; i < codeBlocks.length; i++) {
      codeBlock = codeBlocks[i];
      lang = getLanguage(codeBlock);

      if (lang) {
        result = highlight.highlight(lang, codeBlock.textContent, true);
      } else {
        result = highlight.highlightAuto(codeBlock.textContent);
        if (result.language) {
          codeBlock.classList.add('lang-' + result.language);
        }
      }

      codeBlock.innerHTML = result.value;
      if (codeBlock.parentNode && codeBlock.parentNode.classList) {
        // Tag the parent node as well for style adjustments
        codeBlock.parentNode.classList.add('lang-highlight');
      }
    }

    done();
  };
};
