# @wikifactory/slate-trailing-block

[![NPM version](https://badge.fury.io/js/%40wikifactory%2Fslate-trailing-block.svg)](https://badge.fury.io/js/%40wikifactory%2Fslate-trailing-block)

Slate plugin to ensure a trailing block.

### Install

```
npm install @wikifactory/slate-trailing-block
```

### Simple Usage

```js
import TrailingBlock from 'slate-trailing-block'

const plugins = [
  TrailingBlock({ type: 'paragraph' })
]
```

#### Arguments

This plugin accepts options to redefine the following block types:

- ``[type: String]`` — type for the trailing block
- ``[match: Function]`` — function that checks against the last node

### Utilities

`slate-trailing-block` exports utilities and changes:

#### `changes.focusAtEnd`

`plugin.changes.focusAtEnd(editor: Editor) => Editor`

Focus at the end of the last block.
