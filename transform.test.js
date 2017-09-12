/* eslint-env browser,jest,node */
/*
 * @jest-environment jsdom
 */
jest.mock('highlight.js');
const domTransform = require('metalsmith-dom-transform');
const highlight = require('highlight.js');
const {promisify} = require('util');
const transform = require('./transform');

test('passes options to highlight.js', () => {
  const myOptions = {foo: 'bar'};
  transform(myOptions);

  expect(highlight.configure).toHaveBeenCalledWith(myOptions);
});

describe('highlights', () => {
  let root;
  let transformer;

  beforeEach(() => {
    transformer = promisify(transform());
    root = document.createElement('main');

    highlight.highlight.mockReset();
    highlight.highlightAuto.mockReset();
  });

  test('multiple <code> blocks', () => {
    root.innerHTML = `<h1>Non-code text</h1>
<p>P with <code>inline</code> code.</p>
<pre><code>Code Block Within pre</code></pre>
<code>Naked code block</code>`;

    highlight.highlightAuto
      .mockReturnValueOnce({
        language: 'one',
        value: 'first',
      })
      .mockReturnValueOnce({
        language: 'two',
        value: 'second',
      })
      .mockReturnValueOnce({
        language: 'three',
        value: 'third',
      });

    return transformer(root, {}).then(() => {
      expect(highlight.highlightAuto).toHaveBeenCalledTimes(3);
      expect(highlight.highlightAuto.mock.calls[0][0]).toBe('inline');
      expect(highlight.highlightAuto.mock.calls[1][0]).toBe(
        'Code Block Within pre',
      );
      expect(highlight.highlightAuto.mock.calls[2][0]).toBe('Naked code block');

      // Too lazy to break these out into separate tests, just use HTML
      expect(root.innerHTML).toBe(`<h1>Non-code text</h1>
<p class="lang-highlight">P with <code class="lang-one">first</code> code.</p>
<pre class="lang-highlight"><code class="lang-two">second</code></pre>
<code class="lang-three">third</code>`);
    });
  });

  describe('specified language', () => {
    beforeEach(() => {
      root.innerHTML = `<code class="lang-cobol">true && false</code>`;
      highlight.highlight.mockReturnValue({
        value: 'true && false',
      });

      return transformer(root, {});
    });

    test('finds annotation', () => {
      expect(highlight.highlight.mock.calls[0][0]).toBe('cobol');
    });

    test('passes unescaped code', () => {
      expect(highlight.highlight.mock.calls[0][1]).toBe('true && false');
    });

    test('escapes output', () => {
      expect(root.firstChild.innerHTML).toBe('true &amp;&amp; false');
    });

    test('adds `class=lang-highglight` to parent', () => {
      expect(root.classList.contains('lang-highlight')).toBeTruthy();
    });
  });

  describe('no language found specified', () => {
    beforeEach(() => {
      root.innerHTML = `<code class="plain">UGLY && CODE</code>`;
      highlight.highlightAuto.mockReturnValue({
        language: 'cobol',
        value: 'GORGEOUS && CODE',
      });

      return transformer(root, {});
    });

    test('annotates node with language', () => {
      expect(root.firstChild.classList.contains('lang-cobol')).toBeTruthy();
    });

    test('retains previous class', () => {
      expect(root.firstChild.classList.contains('plain')).toBeTruthy();
    });

    test('passes unescaped code', () => {
      expect(highlight.highlightAuto.mock.calls[0][0]).toBe('UGLY && CODE');
    });

    test('escapes output', () => {
      expect(root.firstChild.textContent).toEqual('GORGEOUS && CODE');
    });

    test('adds `class=lang-highglight` to parent', () => {
      expect(root.classList.contains('lang-highlight')).toBeTruthy();
    });
  });

  test('document fragment', () => {
    const fragment = document.createDocumentFragment();
    const code = document.createElement('code');
    code.innerHTML = `UGLY && CODE`;
    root.innerHTML = `<p>Some <code>inline</code> code.</p>`;
    fragment.appendChild(code);
    fragment.appendChild(root);

    highlight.highlightAuto.mockReset();
    highlight.highlightAuto.mockReturnValue({
      language: '',
      value: '',
    });

    return transformer(fragment, {}).then(() => {
      expect(highlight.highlightAuto).toHaveBeenCalledTimes(2);
    });
  });
});

describe('via domTransform', () => {
  let files;
  let plugin;

  beforeEach(() => {
    files = {
      'index.html': {contents: new Buffer('<p>Hello <code>code</code></p>')},
    };

    plugin = promisify(domTransform({transforms: [transform()]}));
    return plugin(files, {});
  });

  test('runs', () => {
    expect(files['index.html'].contents.toString()).toMatchSnapshot();
  });
});
