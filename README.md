# metalsmith-code-highlight

Finds content with `<code>` elements and highlights it using [HighlightJS](https://github.com/isagalaev/highlight.js).

## Example

Input:

```html
<p>Hello there.</p>
<p>Inline <code class=lang-js>document.all</code></p>
<pre class="lang-highlight"><code class=lang-coffeescript>require "fs"
console.log fs.readFileSync "/etc/passwd"'</code></pre>
```

Output:

```html
<p>Hello there.</p>
<p class="lang-highlight">Inline <code class="lang-js"><span class="hljs-built_in">document</span>.all</code></p>
<pre class="lang-highlight"><code class="lang-coffeescript"><span class="hljs-built_in">require</span> <span class="hljs-string">"fs"</span>
<span class="hljs-built_in">console</span>.log fs.readFileSync <span class="hljs-string">"/etc/passwd"</span></code></pre>
```

## Configuration

Supports the [Highlight.js options](http://highlightjs.readthedocs.org/en/latest/api.html#configure-options):

* `tabReplace`
* `useBR`
* `classPrefix`
* `languages`

## Alternatives

* [metalsmith-metallic](https://github.com/weswigham/metalsmith-metallic): Highlights only within Markdown
