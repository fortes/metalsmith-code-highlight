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

beforeEach(() => {
  highlight.highlightBlock.mockReset();
  highlight.highlightBlock.mockImplementation(block => {
    block.classList.add('highlighted');
  });
});

describe('highlights', () => {
  let root;
  let transformer;

  beforeEach(() => {
    transformer = promisify(transform());
    root = document.createElement('main');
  });

  test('multiple <code> blocks', () => {
    root.innerHTML = `<h1>Non-code text</h1>
<p>P with <code>inline</code> code.</p>
<pre><code>Code Block Within pre</code></pre>
<code>Naked code block</code>`;

    return transformer(root, {}, {}).then(() => {
      expect(root.outerHTML).toMatchSnapshot();
    });
  });

  test('document fragment', () => {
    const fragment = document.createDocumentFragment();
    const code = document.createElement('code');
    code.innerHTML = `UGLY && CODE`;
    root.innerHTML = `<p>Some <code>inline</code> code.</p>`;
    fragment.appendChild(code);
    fragment.appendChild(root);

    return transformer(fragment, {}, {}).then(() => {
      expect(highlight.highlightBlock).toHaveBeenCalledTimes(2);
      expect(code.outerHTML).toMatchSnapshot();
      expect(root.outerHTML).toMatchSnapshot();
    });
  });

  test('via custom selector', () => {
    let transformer = promisify(transform({selector: 'pre > code'}));
    root.innerHTML = `<h1>Non-code text</h1>
<p>P with <code>inline</code> code.</p>
<pre><code>Code Block Within pre</code></pre>
<code>Naked code block</code>`;

    return transformer(root, {}, {}).then(() => {
      expect(highlight.highlightBlock).toHaveBeenCalledTimes(1);
      expect(root.outerHTML).toMatchSnapshot();
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
