export default function(plugin, editor) {
    const schema = plugin.schema;
    return editor.normalize(schema);
}
