"use strict";

module.exports = function unpad(str) {
  const lines = str.split("\n");
  if (lines.length < 2) {
    return str;
  }
  const lastline = lines[lines.length - 1];
  const match = lastline.match(/^\s+/);

  if (!match) return str;

  const pad = match[0].length;

  if (pad < 1) return str;

  const searcher = new RegExp(`^\\s{${pad}}`);

  return lines.map(line => line.replace(searcher, "")).join("\n").trim();
};
