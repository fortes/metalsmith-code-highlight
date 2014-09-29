var domino = require('domino'),
    highlight = require('highlight.js');

var window, document, container;

var HTML_FILENAME_REGEXP = /\.html$/,
    CODE_LANGUAGE_REGEXP = /(?:^|\w)lang-(.+)(?:$|\w)/;

/**
 * @param {!HTMLElement} element
 * @return {?string} Null if not found
 */
var getLanguage = function(element) {
  var match;

  if (element.className) {
    match = element.className.match(CODE_LANGUAGE_REGEXP);

    if (match) {
      return match[1];
    }
  }
  return null;
};

/**
 * @param {!string} html
 * @return {!string} New HTML with code highlighted
 */
var highlightFile = function(html) {
  var i, len, codeBlocks, codeBlock, lang, result;

  // Parse HTML into DOM
  window = window || domino.createWindow('');
  document = window.document;
  container = document.createElement('div');

  container.innerHTML = html;

  codeBlocks = container.querySelectorAll('code');
  for(i = 0, len = codeBlocks.length; i < len; i++) {
    codeBlock = codeBlocks[i];
    lang = getLanguage(codeBlock);

    if (lang) {
      result = highlight.highlight(lang, codeBlock.innerHTML, true);
    }
    else {
      result = highlight.highlightAuto(codeBlock.innerHTML);
      if (result.language) {
        codeBlock.classList.add('lang-' + result.language);
      }
    }

    codeBlock.innerHTML = result.value;
  }

  return container.innerHTML;
};

module.exports = function(options) {
  highlight.configure(options);

  /**
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */
  return function(files, metalsmith, done) {
    var file, data;
    for (file in files) {
      if (HTML_FILENAME_REGEXP.test(file)) {
        data = files[file];
        data.contents = new Buffer(
          highlightFile(data.contents.toString())
        );
      }
    }

    setImmediate(done);
  }
}
