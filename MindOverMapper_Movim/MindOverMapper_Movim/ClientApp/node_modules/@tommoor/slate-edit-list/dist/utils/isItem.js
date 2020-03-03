'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('slate');

/**
 * True if the node is a list item
 */
function isItem(opts, node) {
  return opts.typeItem.includes(node.type);
}
exports.default = isItem;