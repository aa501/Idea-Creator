import assert from 'assert';

export default function(plugin, editor) {
    plugin.changes.wrapCodeBlock(editor);

    assert.equal(editor.value.selection.start.offset, 5);

    return editor;
}
