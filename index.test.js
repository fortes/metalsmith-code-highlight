/* eslint-env jest,node */
const metalsmithCodeHighlight = require('./index');
const {promisify} = require('util');

let files;

beforeEach(() => {
  files = {
    'minimal.html': {
      contents: new Buffer('<code class=lang-js>true</code>'),
    },
    'escape.html': {
      contents: new Buffer('<code class=lang-js>true && false</code>'),
    },
    'doctype.html': {
      contents: new Buffer(`
        <!DOCTYPE html>
        <html>
        <head><title>Test Page</title></head>
        <body>
        <pre class="lang-highlight"><code class=lang-js>var x = [1, 2, 3];</code></pre>
        <code class=lang-bogus>What language is this?</code>
        </body>
        </html>
      `),
    },
    'readme.html': {
      contents: new Buffer(`
        <p>Hello there.</p>
        <p>
          Inline <code class=lang-js>document.all</code>
        </p>
        <pre>
          <code class=lang-coffeescript>
            require "fs"
            console.log fs.readFileSync "/etc/passwd"'
          </code>
        </pre>
      `),
    },
  };

  return promisify(metalsmithCodeHighlight({useFragment: true}))(files, {});
});

test('integration', () => {
  for (let file in files) {
    expect(files[file].contents.toString()).toMatchSnapshot();
  }
});
