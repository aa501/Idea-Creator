import simulateKey from '../simulate-key';

export default function(plugin, editor) {
    return editor.run('onKeyDown', simulateKey('backspace'));
}
