import { Model } from "@blink-mind/core";

export const downloadFile = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

export function generateSimpleModel() {
  return Model.create({
    rootTopicKey: "root",
    topics: [
      {
        key: "root",
        blocks: [{ type: "CONTENT", data: "Loading..." }],
        subKeys: null
      }
    ]
  });
}