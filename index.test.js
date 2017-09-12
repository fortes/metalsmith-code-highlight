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
  expect(files['code.html'].contents.toString()).toBe(
    '<code class="lang-js"><span class="hljs-comment">// Hi</span></code>',
  );
});

test('escape entities', () => {
  expect(files['escape.html'].contents.toString()).toBe(
    '<code class="lang-js"><span class="hljs-literal">true</span> &amp;&amp; <span class="hljs-literal">false</span></code>',
  );
});

test('multiple code blocks', () => {
  expect(files['double.html'].contents.toString()).toBe(
    `<p>Hello there.</p><p class="lang-highlight">Inline <code class="lang-js"><span class="hljs-built_in">document</span>.all</code></p><pre class="lang-highlight"><code class="lang-coffeescript">
<span class="hljs-built_in">require</span> <span class="hljs-string">"fs"</span>
<span class="hljs-built_in">console</span>.log fs.readFileSync <span class="hljs-string">"/etc/passwd"</span></code></pre>`,
  );
});

test('doctype', () => {
  expect(files['doctype.html'].contents.toString()).toBe(
    `<!DOCTYPE html><html><head><title>Test Page</title></head><body><pre class="lang-highlight"><code class="lang-js"><span class="hljs-keyword">var</span> x = [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>];</code></pre></body></html>`,
  );
});
