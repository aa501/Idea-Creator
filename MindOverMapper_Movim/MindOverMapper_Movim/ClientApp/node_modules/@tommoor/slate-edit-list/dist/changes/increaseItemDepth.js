'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

var _utils = require('../utils');

/**
 * Increase the depth of the current item by putting it in a sub-list
 * of previous item.
 * For first items in a list, does nothing.
 */
function increaseItemDepth(opts, change) {
    var previousItem = (0, _utils.getPreviousItem)(opts, change.value);
    var currentItem = (0, _utils.getCurrentItem)(opts, change.value);
    var maxDepth = opts.maxDepth * 2;

    if (!previousItem) {
        return change;
    }

    if (!currentItem) {
        return change;
    }

    // Get the depth of the focused list item.
    var currentItemDepth = change.value.document.getDepth(currentItem.key);

    // Make sure the level of the focused item is below the defined maximum.
    if (currentItemDepth >= maxDepth) {
        return change;
    }

    // Get the depth of the deepest `li` descendant of the focused item.
    var deepestItemDepth = (0, _utils.getDeepestItemDepth)(currentItem, change.value.document);

    // This prevents from indenting parents of too deeply nested list items.
    if (deepestItemDepth >= maxDepth) {
        return change;
    }

    // Move the item in the sublist of previous item
    return moveAsSubItem(opts, change, currentItem, previousItem.key);
}

/**
 * Move the given item to the sublist at the end of destination item,
 * creating a sublist if needed.
 */
function moveAsSubItem(opts, change,
// The list item to add
item,
// The key of the destination node
destKey) {
    var destination = change.value.document.getDescendant(destKey);
    var lastIndex = destination.nodes.size;
    var lastChild = destination.nodes.last();

    // The potential existing last child list
    var existingList = (0, _utils.isList)(opts, lastChild) ? lastChild : null;

    if (existingList) {
        return change.moveNodeByKey(item.key, existingList.key, existingList.nodes.size // as last item
        );
    }
    var currentList = (0, _utils.getListForItem)(opts, change.value, destination);
    if (!currentList) {
        throw new Error('Destination is not in a list');
    }

    // Creating empty list creates also empty list item - placeholder item is meant to be easily deleted in the end
    var tmpBlock = _slate.Block.create({
        object: 'block',
        type: opts.typeItem
    });

    // @TODO Why does empty list contain empty item?
    var newSublist = _slate.Block.create({
        object: 'block',
        type: currentList.type,
        data: currentList.data,
        nodes: [tmpBlock]
    });

    change.withoutNormalizing(function () {
        change.insertNodeByKey(destKey, lastIndex, newSublist);
    });

    change.moveNodeByKey(item.key, newSublist.key, 0);
    change.removeNodeByKey(tmpBlock.key);

    return change;
}

exports.default = increaseItemDepth;