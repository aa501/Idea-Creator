import assert from 'assert';

export default function(plugin, editor) {
    assert.equal(plugin.utils.isInCodeBlock(editor.value), true);

    return editor;
}
