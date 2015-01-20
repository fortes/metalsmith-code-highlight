# metalsmith-code-highlight

Finds content with `<code>` elements and highlights it using [HighlightJS](https://github.com/isagalaev/highlight.js).

## Configuration

Supports the [Highlight.js options](http://highlightjs.readthedocs.org/en/latest/api.html#configure-options):

* `tabReplace`
* `useBR`
* `classPrefix`
* `languages`

You can also customise which blocks of code you would like to highlight by passing `scoped` and a `querySelector` of your choice.

```js
var Metalsmith = require('metalsmith'),
    highlight  = require('metalsmith-code-highlight');

Metalsmith(__dirname)
    .use(highlight({
        scoped: 'pre code'
    }))
    .build();
```

This option defaults to `code`.

## Alternatives

* [metalsmith-metallic](https://github.com/weswigham/metalsmith-metallic): Highlights only within Markdown
