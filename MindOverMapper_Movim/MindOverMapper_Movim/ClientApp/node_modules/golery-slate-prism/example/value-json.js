/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import {Value } from 'slate';

let text = `{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"heading","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Slate + Code Highlighting","marks":[]}]}]},{"object":"block","type":"paragraph","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"This page is a basic example of Slate + slate-prism + slate-edit-code plugins:","marks":[]}]}]},{"object":"block","type":"code_block","isVoid":false,"data":{"syntax":"javascript"},"nodes":[{"object":"block","type":"code_line","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"// Some javascript","marks":[]}]}]},{"object":"block","type":"code_line","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"var msg = 'Hello world';","marks":[]}]}]}]},{"object":"block","type":"paragraph","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Syntax can be set on a per-block basis:","marks":[]}]}]},{"object":"block","type":"code_block","isVoid":false,"data":{"syntax":"html"},"nodes":[{"object":"block","type":"code_line","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"<!-- Some HTML -->","marks":[]}]}]},{"object":"block","type":"code_line","isVoid":false,"data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Hello World","marks":[]}]}]}]}]}}`;
let json = JSON.parse(text);
let INITIAL_VALUE = Value.fromJSON(json);

console.log(INITIAL_VALUE);
export default  INITIAL_VALUE;
