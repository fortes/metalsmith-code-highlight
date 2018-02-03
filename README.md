# metalsmith-code-highlight

[![build status](https://travis-ci.org/fortes/metalsmith-code-highlight.svg?branch=master)](https://travis-ci.org/fortes/metalsmith-code-highlight/) [![codecov](https://codecov.io/gh/fortes/metalsmith-code-highlight/branch/master/graph/badge.svg)](https://codecov.io/gh/fortes/metalsmith-code-highlight) [![Greenkeeper badge](https://badges.greenkeeper.io/fortes/metalsmith-code-highlight.svg)](https://greenkeeper.io/)

Finds content with `<code>` elements and highlights it using [HighlightJS](https://github.com/isagalaev/highlight.js).

## Example

Input:

```html
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
```

Output:

```html
<p>Hello there.</p>
<p class="lang-highlight">
  Inline <code class="lang-js hljs javascript"><span class="hljs-built_in">document</span>.all</code>
</p>
<pre class="lang-highlight">
  <code class="lang-coffeescript hljs">
    <span class="hljs-built_in">require</span> <span class="hljs-string">"fs"</span>
    <span class="hljs-built_in">console</span>.log fs.readFileSync <span class="hljs-string">"/etc/passwd"</span><span class="hljs-string">'</span>
  </code>
</pre>
```

## Configuration

Supports the [Highlight.js options](http://highlightjs.readthedocs.org/en/latest/api.html#configure-options) (e.g. `classPrefix`, `languages`, `tabReplace`).

If you'd like to turn off automatic language detection, set `{languages: []}`. Only code blocks marked with an appropriate `class` like `lang-js` will be highlighted (useful when using [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting) in Markdown).

By default, this plugin will highlight all `code` elements. You can override the selector for what to highlight by passing in a `selector` option like so: `{selector: 'pre > code'}`. This will only highlight `<pre>`'s immediate `<code>` children elements. This is a metalsmith-code-highlight specific option—it isn't part of highlight.js.

## Using with `metalsmith-dom-transform`

If you're already using [`metalsmith-dom-transform`](https://github.com/fortes/metalsmith-dom-transform), you can save a little bit of overhead by accessing the code highlight transform directly:

```js
const domTransform = require('metalsmith-dom-transform');
const codeHighlightTransform = require('metalsmith-code-highlight/transform');

metalsmith.use(domTransform({
  transforms: [
    codeHighlightTransform(options),
    // Your other transforms go here
  ]
}));
```

## Changelog

* `1.1.0`: Allow a `selector` option for overriding the default selector of `code`.
* `1.0.3`: Upgrade to `metalsmith-dom-transform` `2.0.0`, no functional changes
* `1.0.2`: Upgrade to `metalsmith-dom-transform` `1.0.1`, may cause slight change in HTML output when there is no content to highlight
* `1.0.1`: Use `highlightBlock` from `highlight.js` for the highlighting, slight change in HTML output
* `1.0.0`: Upgrade to `metalsmith-dom-transform` `1.0.0` (API change)
* `0.1.1`: Upgrade dependencies
* `0.1.0`: Expose transform for use with `metalsmith-dom-transform`

## Alternatives

* [metalsmith-metallic](https://github.com/weswigham/metalsmith-metallic): Highlights only within Markdown
