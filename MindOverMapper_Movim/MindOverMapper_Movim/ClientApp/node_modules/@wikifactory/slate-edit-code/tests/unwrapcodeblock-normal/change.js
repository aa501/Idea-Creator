export default function(plugin, editor) {
    return plugin.changes.unwrapCodeBlock(editor, 'paragraph');
}
