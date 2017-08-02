var domino = require('domino'),
    highlight = require('highlight.js');

var window, document;

var HTML_FILENAME_REGEXP = /\.html$/,
    CODE_LANGUAGE_REGEXP = /(?:^|\w)lang-(.+)(?:$|\w)/,
    DOCTYPE_TAG_REGEXP = /^[\s]*<!DOCTYPE ([^>]*)>/i

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
 * @return {?string} Null if not found
 */
var getDocType = function(html) {
  var match = (html || '').match(DOCTYPE_TAG_REGEXP);
  if (match) {
    return match[0];
  }
  return null;
};

/**
 * @param {!string} html
 * @return {!string} New HTML with code highlighted
 */
var highlightFile = function(html) {
  var i, len, preBlocks, codeBlocks, codeBlock, container, lang, result, finalHtml,
      docType = getDocType(html);

  // Parse HTML into DOM.  If doctype present, load as entire html document
  // instead of setting an elem innerHTML.
  if (docType) {
    container = domino.createWindow(html).document;
  }
  else {
    window = window || domino.createWindow('');
    document = window.document;
    container = document.createElement('div');

    container.innerHTML = html;
  }

  preBlocks = container.querySelectorAll('pre');
  for(i = 0, len = preBlocks.length; i < len; i++) {
    preBlocks[i].classList.add('lang-highlight');
  }

  codeBlocks = container.querySelectorAll('code');
  for(i = 0, len = codeBlocks.length; i < len; i++) {
    codeBlock = codeBlocks[i];
    lang = getLanguage(codeBlock);

    if (lang) {
      result = highlight.highlight(lang, codeBlock.textContent, true);
    }
    else {
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

  if (docType) {
    finalHtml = docType + '\n' + container.getElementsByTagName('html')[0]
      .outerHTML;
  }
  else {
    finalHtml = container.innerHTML;
  }

  return finalHtml;
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
