/* eslint-env jest,node */
const metalsmithCodeHighlight = require('./index');
const {promisify} = require('util');

let files;

beforeEach(() => {
  files = {
    'escape.html': {
      contents: new Buffer('<code class=lang-js>true && false</code>'),
    },
    'code.html': {
      contents: new Buffer('<code class=lang-js>// Hi</code>'),
    },
    'double.html': {
      contents: new Buffer(
        '<p>Hello there.</p>' +
          '<p>Inline <code class=lang-js>document.all</code></p>' +
          '<pre class="lang-highlight"><code class=lang-coffeescript>' +
          '\nrequire "fs"\nconsole.log fs.readFileSync "/etc/passwd"' +
          '</code></pre>',
      ),
    },
    'doctype.html': {
      contents: new Buffer(
        '<!DOCTYPE html>' +
          '<html>' +
          '<head><title>Test Page</title></head>' +
          '<body><pre class="lang-highlight"><code class=lang-js>var x = [1, 2, 3];</code></pre></body>' +
          '</html>',
      ),
    },
  };

  return promisify(metalsmithCodeHighlight({useFragments: true}))(files, {});
});

test('<code>', () => {
  expect(files['code.html'].contents.toString()).toMatchSnapshot();
});

test('escape entities', () => {
  expect(files['escape.html'].contents.toString()).toMatchSnapshot();
});

test('multiple code blocks', () => {
  expect(files['double.html'].contents.toString()).toMatchSnapshot();
});

test('doctype', () => {
  expect(files['doctype.html'].contents.toString()).toMatchSnapshot();
});
