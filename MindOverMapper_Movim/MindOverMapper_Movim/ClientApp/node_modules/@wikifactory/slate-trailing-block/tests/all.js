const expect = require('expect');
const fs = require('fs');
const path = require('path');
const Slate = require('slate');
const readMetadata = require('read-metadata');

const TrailingBlock = require('../lib');

const PLUGIN = TrailingBlock({
    match: node => (node.type == 'paragraph' || node.type == 'footnote')
});

const SCHEMA = {
    plugins: [PLUGIN]
};


function deserializeValue(json) {
    return Slate.Value.fromJSON(
        json,
        { normalize: false }
    );
}

describe('slate-trailing-block', function() {
    const tests = fs.readdirSync(__dirname);

    tests.forEach(function(test) {
        if (test[0] === '.' || path.extname(test).length > 0) return;

        it(test, function() {
            const dir = path.resolve(__dirname, test);
            const input = readMetadata.sync(path.resolve(dir, 'input.yaml'));
            const expectedPath = path.resolve(dir, 'expected.yaml');
            const expected =
                fs.existsSync(expectedPath) && readMetadata.sync(expectedPath);

            const valueInput = deserializeValue(input);
            const editorInput = new Slate.Editor({ plugins: [PLUGIN], value: valueInput });

            editorInput.run('onChange');

            if (expected) {
                const newDocJSon = editorInput.value.toJSON();
                expect(newDocJSon).toEqual(deserializeValue(expected).toJSON());
            }
        });
    });
});
