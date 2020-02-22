// @flow
import { type Change } from 'slate';
import { Text } from 'slate';
import type Options from '../options';
import { unwrapList, splitListItem, decreaseItemDepth } from '../changes';
import { getCurrentItem, getItemDepth } from '../utils';

function isEmptyListItem(editor, listItem) {
    if (editor.isVoid(listItem) || listItem.text !== '') {
        return false;
    }
    try {
        let nodes = listItem.nodes.get(0).nodes;
        if (nodes.size !== 1) return false;
        let child = nodes.get(0);
        if (!Text.isText(child)) {
            return false;
        }
        return child.text === '';
    } catch(e) {
        return true;
    }
}
/**
 * User pressed Enter in an editor
 *
 * Enter in a list item should split the list item
 * Enter in an empty list item should remove it
 * Shift+Enter in a list item should make a new line
 */
function onEnter(
    event: *,
    change: Change,
    next: Function,
    opts: Options
): void | any {
    // Pressing Shift+Enter
    // should split block normally
    if (event.shiftKey) {
        return next();
    }

    const { value } = change;
    const currentItem = getCurrentItem(opts, value);

    // Not in a list
    if (!currentItem) {
        return next();
    }

    event.preventDefault();

    // If expanded, delete first.
    if (value.selection.isExpanded) {
        change.delete();
    }

    if (isEmptyListItem(change, currentItem)) {
        // Block is empty, we exit the list
        if (getItemDepth(opts, value) > 1) {
            return decreaseItemDepth(opts, change);
        }
        // Exit list
        return unwrapList(opts, change);
    }
    // Split list item
    return splitListItem(opts, change);
}

export default onEnter;
