import simulateKey from '../simulate-key';

export default function(plugin, editor) {
    const { value } = editor;
    const block = value.document.findDescendant(
        node => node.type == 'code_block'
    );

    editor.moveToStartOfNode(block).moveAnchorTo(0);
    editor.moveFocusTo(0);

    return editor.run('onKeyDown', simulateKey('tab'));
}
