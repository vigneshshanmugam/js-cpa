function generateHash(str) {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

module.exports = function matcher(labels) {
  let parentPattern = "";
  let tempArr = [];
  let patterns = [];
  // Determine the top level scope
  let pointer = 0;

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];

    // start of function
    switch (label) {
      case "{":
        pointer++;
        break;
      case "}":
        pointer--;
        const previous = labels[i - 1];
        previous !== "}" && tempArr.push(previous);
        if (pointer === 0 && tempArr.length > 1) {
          patterns = patterns.concat([parentPattern, ...tempArr]);
          parentPattern = "";
          tempArr = [];
        }
        break;
      default:
        parentPattern += label;
    }
  }
  return patterns;
};
