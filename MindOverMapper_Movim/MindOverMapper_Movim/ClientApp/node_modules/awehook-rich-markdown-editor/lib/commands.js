"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slate = require("slate");

var commands = {
  wrapLink: function wrapLink(editor, href) {
    if (!editor.isLinkActive()) {
      editor.wrapInline({ type: "link", data: { href: href } });
    }
  },
  unwrapLink: function unwrapLink(editor) {
    editor.unwrapInline("link");
  },
  insertImageFile: function insertImageFile(editor, file) {
    var _editor$props = editor.props,
        uploadImage = _editor$props.uploadImage,
        onImageUploadStart = _editor$props.onImageUploadStart,
        onShowToast = _editor$props.onShowToast,
        onImageUploadStop = _editor$props.onImageUploadStop;


    if (!uploadImage) {
      console.warn("uploadImage callback must be defined to handle image uploads.");
    }

    if (onImageUploadStart) onImageUploadStart();

    var key = _slate.KeyUtils.create();
    var alt = "";

    // load the file as a data URL
    var placeholderSrc = URL.createObjectURL(file);
    var node = _slate.Block.create({
      key: key,
      type: "image",
      isVoid: true,
      data: { src: placeholderSrc, alt: alt, loading: true }
    });

    editor.insertBlock(node).insertBlock("paragraph").onChange(editor);

    // withoutSaving prevents this op from being added to the history, so you can't
    // undo back to showing the upload placeholder. 'onChange' addition is a hack
    // to get around a bug in slate-drop-or-paste-images
    editor.withoutSaving(function (editor) {
      // now we have a placeholder, start the image upload. This could be very fast
      // or take multiple seconds. The user may further edit the content during this time.
      uploadImage(file).then(function (src) {
        if (!src) {
          throw new Error("No image url returned from uploadImage callback");
        }

        // replace the placeholder with the final image if we can. The user may have
        // removed it during upload so we need to take that into account.
        try {
          editor.setNodeByKey(key, {
            data: { src: src, alt: alt, loading: false }
          });
        } catch (err) {
          console.warn("Image placeholder could not be found", err);
        }
      }).catch(function (err) {
        // if there was an error during upload, remove the placeholder image
        editor.removeNodeByKey(key);

        if (onShowToast) {
          onShowToast("Sorry, an error occurred uploading the image");
        }
        throw err;
      }).finally(function () {
        if (onImageUploadStop) onImageUploadStop();
      });
    });
  }
};
exports.default = commands;