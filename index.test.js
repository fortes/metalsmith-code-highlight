/* eslint-env jest,node */
const metalsmithCodeHighlight = require('./index');
const {promisify} = require('util');

const files = {
  'escape.html': {
    contents: new Buffer('<code class=lang-js>true && false</code>'),
  },
  'code.html': {
    contents: new Buffer('<code class=lang-js>// Hi</code>'),
  },
  'double.html': {
    contents: new Buffer(
      `
          <p>Hello there.</p>
          <p>Inline <code class="lang-js other">document.all</code></p>
          <pre class="lang-highlight"><code class=lang-coffeescript>
          \nrequire "fs"\nconsole.log fs.readFileSync "/etc/passwd"
          </code></pre>
        `,
    ),
  },
  'doctype.html': {
    contents: new Buffer(
      `
          <!DOCTYPE html>
          <html>
          <head><title>Test Page</title></head>
          <body>
          <pre class="lang-highlight"><code class=lang-js>var x = [1, 2, 3];</code></pre>
          <code class=lang-bogus>What language is this?</code>
          </body>
          </html>
        `,
    ),
  },
};

beforeEach(() => {
  return promisify(metalsmithCodeHighlight({useFragments: true}))(files, {});
});

for (let file in files) {
  test(file, () => {
    expect(files[file].contents.toString()).toMatchSnapshot();
  });
}
