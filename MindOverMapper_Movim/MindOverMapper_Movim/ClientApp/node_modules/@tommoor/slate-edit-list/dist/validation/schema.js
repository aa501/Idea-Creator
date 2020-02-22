'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('slate');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Create a schema definition with rules to normalize lists
 */
function schema(opts) {
    var constructedSchema = {
        blocks: _defineProperty({}, opts.typeItem, {
            parent: opts.types.map(function (t) {
                return { type: t };
            }),
            nodes: [{ match: { object: 'block' } }],

            normalize: normalize({
                parent_type_invalid: function parent_type_invalid(change, context) {
                    return change.unwrapBlockByKey(context.node.key, {
                        normalize: false
                    });
                },
                child_object_invalid: function child_object_invalid(change, context) {
                    return wrapChildrenInDefaultBlock(opts, change, context.node);
                }
            })
        })
    };

    // validate all list types, ensure they only have list item children
    opts.types.forEach(function (type) {
        constructedSchema.blocks[type] = {
            nodes: [{ match: { type: opts.typeItem } }],
            normalize: normalize({
                child_type_invalid: function child_type_invalid(change, context) {
                    return change.wrapBlockByKey(context.child.key, opts.typeItem, {
                        normalize: false
                    });
                }
            })
        };
    });

    return constructedSchema;
}

/*
 * Allows to define a normalize function through a keyed collection of functions
 */
function normalize(reasons) {
    return function (change, error) {
        var reasonFn = reasons[error.code];
        if (reasonFn) {
            reasonFn(change, error);
        }
    };
}

/**
 * Wraps all child of a node in the default block type.
 * Returns a change, for chaining purposes
 */
function wrapChildrenInDefaultBlock(opts, change, node) {
    change.wrapBlockByKey(node.nodes.first().key, opts.typeDefault, {
        normalize: false
    });

    var wrapper = change.value.document.getDescendant(node.key).nodes.first();

    // Add in the remaining items
    node.nodes.rest().forEach(function (child, index) {
        return change.moveNodeByKey(child.key, wrapper.key, index + 1, {
            normalize: false
        });
    });

    return change;
}

exports.default = schema;