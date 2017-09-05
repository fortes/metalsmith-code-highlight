const domTransform = require('metalsmith-dom-transform');
const highlight = require('highlight.js');

const CODE_LANGUAGE_REGEXP = /(?:^|\w)lang-(.+)(?:$|\w)/;

function getLanguage(element) {
  if (element.className) {
    const match = element.className.match(CODE_LANGUAGE_REGEXP);

    if (match) {
      return match[1];
    }
  }

  return null;
}

function highlightContent(root, data, done) {
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
    if (codeBlock.parentNode) {
      // Tag the parent node as well for style adjustments
      codeBlock.parentNode.classList.add('lang-highlight');
    }
  }

  done();
}

module.exports = function(options) {
  highlight.configure(options);

  return domTransform({
    transforms: [highlightContent],
  });
};
