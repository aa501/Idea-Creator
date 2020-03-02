import toPascal from 'to-pascal-case';

/**
 * A Slate plugin to add soft breaks on return.
 *
 * @param {Object} options
 * @return {Object}
 */

function CollapseOnEscape() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return {
    onKeyDown: function onKeyDown(event, change, next) {
      var value = change.value;
      var selection = value.selection;

      if (event.key != 'Escape') return next();
      if (selection.isCollapsed) return next();
      var edge = toPascal(options.toEdge || 'start');
      change['moveTo' + edge]();
    }
  };
}

export default CollapseOnEscape;
//# sourceMappingURL=slate-collapse-on-escape.es.js.map
