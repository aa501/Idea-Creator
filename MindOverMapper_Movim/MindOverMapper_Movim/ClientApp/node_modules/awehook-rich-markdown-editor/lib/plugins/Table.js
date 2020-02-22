"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function TablePlugin() {
  return {
    schema: {
      blocks: {
        "table-cell": {
          data: {
            align: function align(_align) {
              return ["left", "center", "right"].includes(_align);
            }
          },
          normalize: function normalize(change, error) {
            if (error.code === "node_data_invalid") {
              change.setNodeByKey(error.node.key, {
                data: error.node.data.set("align", "left")
              });
            }
          }
        }
      }
    },

    commands: {
      setColumnAlign: function setColumnAlign(editor, align) {
        var pos = editor.getPosition(editor.value);
        var columnCells = editor.getCellsAtColumn(pos.table, pos.getColumnIndex());

        columnCells.forEach(function (cell) {
          var data = cell.data.toObject();
          editor.setNodeByKey(cell.key, { data: _extends({}, data, { align: align }) });
        });
        return editor;
      },
      clearSelectedColumn: function clearSelectedColumn(editor, table, columnIndex) {
        var cells = editor.getCellsAtColumn(table, columnIndex);

        cells.forEach(function (cell) {
          if (!cell) return;

          var data = cell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: _extends({}, data, {
              selected: undefined
            })
          });
        });
      },
      clearSelectedRow: function clearSelectedRow(editor, table, rowIndex) {
        var cells = editor.getCellsAtRow(table, rowIndex);

        cells.forEach(function (cell) {
          if (!cell) return;

          var data = cell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: _extends({}, data, {
              selected: undefined
            })
          });
        });
      },
      resetAlign: function resetAlign(editor, table, rowIndex) {
        var headCells = editor.getCellsAtRow(table, 0);

        // we need to re-query position as the table has been edited
        // since it was originally queried (pre-insert)
        var position = editor.getPositionByKey(editor.value.document, table.key);
        var cells = editor.getCellsAtRow(position.table, rowIndex);

        // take the alignment data from the head cells and map onto
        // the individual data cells
        cells.forEach(function (cell, index) {
          var headCell = headCells.get(index);
          var data = headCell.data.toObject();
          editor.setNodeByKey(cell.key, {
            data: _extends({}, data, { selected: undefined })
          });
        });
      },
      clearSelected: function clearSelected(editor, table) {
        var previouslySelectedRows = table.data.get("selectedRows") || [];
        var previouslySelectedColumns = table.data.get("selectedColumns") || [];

        editor.withoutSaving(function () {
          previouslySelectedRows.forEach(function (rowIndex) {
            editor.clearSelectedRow(table, rowIndex);
          });

          previouslySelectedColumns.forEach(function (columnIndex) {
            editor.clearSelectedColumn(table, columnIndex);
          });

          if (previouslySelectedRows.length || previouslySelectedColumns.length) {
            editor.setNodeByKey(table.key, {
              data: {
                selectedTable: false,
                selectedColumns: [],
                selectedRows: []
              }
            });
          }
        });

        return editor;
      },
      selectColumn: function selectColumn(editor, selected) {
        var pos = editor.getPosition(editor.value);
        var selectedColumn = pos.getColumnIndex();

        editor.withoutSaving(function () {
          editor.clearSelected(pos.table);

          editor.setNodeByKey(pos.table.key, {
            data: {
              selectedColumns: selected ? [selectedColumn] : [],
              selectedRows: []
            }
          });

          var cells = editor.getCellsAtColumn(pos.table, selectedColumn);

          cells.forEach(function (cell) {
            var data = cell.data.toObject();
            editor.setNodeByKey(cell.key, {
              data: _extends({}, data, {
                selected: selected
              })
            });
          });
        });

        return editor;
      },
      selectRow: function selectRow(editor, selected) {
        var pos = editor.getPosition(editor.value);
        var selectedRow = pos.getRowIndex();

        editor.withoutSaving(function () {
          editor.clearSelected(pos.table);

          editor.setNodeByKey(pos.table.key, {
            data: {
              selectedColumns: [],
              selectedRows: selected ? [selectedRow] : []
            }
          });

          var cells = editor.getCellsAtRow(pos.table, selectedRow);

          cells.forEach(function (cell) {
            var data = cell.data.toObject();
            editor.setNodeByKey(cell.key, {
              data: _extends({}, data, {
                selected: selected
              })
            });
          });
        });

        return editor;
      },
      selectAll: function selectAll(editor) {
        var selected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var pos = editor.getPosition(editor.value);

        editor.withoutSaving(function () {
          editor.withoutNormalizing(function () {
            var width = pos.getWidth();
            var height = pos.getHeight();
            var data = {
              selectedTable: true,
              selectedColumns: Array.from(Array(width).keys()),
              selectedRows: Array.from(Array(height).keys())
            };

            editor.setNodeByKey(pos.table.key, { data: data });

            for (var y = 0; y < pos.getHeight(); y++) {
              var cells = editor.getCellsAtRow(pos.table, y);

              cells.forEach(function (cell) {
                var data = cell.data.toObject();
                editor.setNodeByKey(cell.key, {
                  data: _extends({}, data, {
                    selected: selected
                  })
                });
              });
            }
          });
        });
      }
    }
  };
}
exports.default = TablePlugin;