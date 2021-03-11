/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

figma.showUI(__html__);

function SVGFromBuffer (buffer) {
  const svg = new Uint8Array(buffer).reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, "")
  return svg
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "get-buffer") {
    const nodes = figma.currentPage.selection
    if (!nodes.length) {
      figma.notify('Please select icons.')
      return
    }
    const promises = nodes.map((node: FrameNode) => new Promise((resolve, _reject) => {
      node.exportAsync({format: 'SVG'})
        .then(buffer => {
          resolve({name: node.name, svg: SVGFromBuffer(buffer)})
        })
    }))
    Promise.all(promises)
      .then(icons => {
        figma.ui.postMessage({
          type: 'svg-got',
          message: icons
        });
      })
  }

};
