'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

/**
 * Find all `list_item` descendants of a node and retrieve the deepest depth.
 */
function getDeepestItemDepth(node, document) {
    return node.filterDescendants(function (descendant) {
        return descendant.type === 'list_item';
    }).reduce(function (maxLevel, descendant) {
        return Math.max(maxLevel, document.getDepth(descendant.key));
    }, 0);
}
exports.default = getDeepestItemDepth;