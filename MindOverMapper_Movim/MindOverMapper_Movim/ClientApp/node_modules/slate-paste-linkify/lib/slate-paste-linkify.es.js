import isUrl from 'is-url';

function PasteLinkify() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$isActiveQuer = options.isActiveQuery,
      isActiveQuery = _options$isActiveQuer === undefined ? 'isLinkActive' : _options$isActiveQuer,
      _options$wrapCommand = options.wrapCommand,
      wrapCommand = _options$wrapCommand === undefined ? 'wrapLink' : _options$wrapCommand,
      _options$unwrapComman = options.unwrapCommand,
      unwrapCommand = _options$unwrapComman === undefined ? 'unwrapLink' : _options$unwrapComman;


  return {
    onCommand: function onCommand(command, change, next) {
      var type = command.type,
          args = command.args;
      var value = change.value;
      var selection = value.selection;
      var isCollapsed = selection.isCollapsed,
          start = selection.start;

      var url = void 0;

      if (type === 'insertText' && isUrl(url = args[0]) || type === 'insertFragment' && isUrl(url = args[0].text)) {
        // If there is already a link active, unwrap it so that we don't end up
        // with a confusing overlapping inline situation.
        if (change.query(isActiveQuery, value)) {
          change.command(unwrapCommand);
        }

        // If the selection is collapsed, we need to allow the default inserting
        // to occur instead of just wrapping the existing text in a link.
        if (isCollapsed) {
          next();
          change.moveAnchorTo(start.offset).moveFocusTo(start.offset + url.length);
        }

        // Wrap the selection in a link, and collapse to the end of it.
        change.command(wrapCommand, url).moveToEnd();
        return;
      }

      next();
    }
  };
}

export default PasteLinkify;
//# sourceMappingURL=slate-paste-linkify.es.js.map
