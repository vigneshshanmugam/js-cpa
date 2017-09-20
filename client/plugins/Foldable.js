Prism.hooks.add("complete", env => {
  const pre = env.element.parentNode;
  const dataOpen = pre.dataset.open;

  if (!dataOpen) return;

  const element = env.element;

  const lines = [];

  // for (let i = 0; i < element.childNodes.length; i++) {
  //   const node = element.childNodes[i];
  //   if (node.nodeType === Node.TEXT_NODE) {
  //     const split = node.nodeValue.split("\n");
  //     if (split.length > 1) {
  //       const previousSibling = node;
  //       const parent = node.parentNode;
  //       node.nodeValue = split[0];
  //       for (let j = 1; j < split.length; j++) {}
  //     }
  //     lines.push(...node.nodeValue.split("\n"));
  //   }
  // }

  // console.log(lines);

  // console.log(getLinesShown(dataOpen, 0, 100));
});

function getLinesShown(dataOpen, start, end) {
  const parts = dataOpen
    .split(",")
    .map(part => part.split("-").map(it => parseInt(it, 10)));

  let lines = Array.from({ length: end - start }, () => ({
    type: "HIDE"
  }));

  for (const part of parts) {
    for (let i = part[0]; i < part[1]; i++) {
      lines[i].type = "SHOW";
    }
  }

  return lines;
}
