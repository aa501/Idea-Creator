'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

var _changes = require('../changes');

var _utils = require('../utils');

/**
 * User pressed Tab in an editor.
 * Tab       -> Increase item depth if inside a list item
 * Shift+Tab -> Decrease item depth if inside a list item
 */
function onTab(event, change, next, opts) {
    var value = change.value;
    var isCollapsed = value.selection.isCollapsed;


    if (!isCollapsed || !(0, _utils.getCurrentItem)(opts, value)) {
        return next();
    }

    event.preventDefault();

    // Shift+tab reduce depth
    if (event.shiftKey) {
        return (0, _changes.decreaseItemDepth)(opts, change);
    }

    // Tab increases depth
    return (0, _changes.increaseItemDepth)(opts, change);
}
exports.default = onTab;