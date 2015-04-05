---
number: 2
title: Headers
id: headers
---

Sometimes paragraphs aren't enough and it's important to have some headers. Headers are single lines of text that are rendered larger and more boldly than normal text.

Headers can be written in two ways: with **hashes** or **underlines**.

### Hashes

One or more hashes are added at the start of a line of text to make it a header. The hash symbols are not rendered, only the text. One hash creates the largest header, two hashes the second largest, etc. The smallest header can have six hashes. Seven or more hashes will not make the header any smaller.

Optionally, this style of header can be closed with hashes. Closing the header has no effect outside of appearance. The number of closing hashes does not need to match the number of opening hashes.

<!-- ```technical
The size of the header corresponds to the HTML tag used to render the Markdown. For example, `#` corresponds to the `<h1>` tag and `######` generates a `<h6>` tag
``` -->

```editor
# The first (and largest) header

## The second header with optional closing hashes ###

...

###### The sixth (and smallest) header
```

### Underlines

Underlined headers only come in two sizes: the largest header (equivalent to `#`) and the second largest header (equivalent to `##`). Underlines are created by adding at least three `=` or `-` symbols below the header text. More than three symbols do not make a difference but may be added for aesthetic reasons.

```editor
This is the largest header
==========================

And this is the smaller header
---
```
