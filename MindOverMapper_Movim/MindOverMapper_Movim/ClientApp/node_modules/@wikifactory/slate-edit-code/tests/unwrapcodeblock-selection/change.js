export default function(plugin, editor) {
    const newValue = plugin.changes.unwrapCodeBlock(editor, 'paragraph');

    return newValue;
}
