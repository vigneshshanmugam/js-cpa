"use strict";

const CPA = require("./cpa");
const Reporter = require("./reporter");

module.exports = {
  CPA,
  findDuplicates(code, filename = "") {
    const cpa = new CPA();
    cpa.add(code, filename);
    return cpa.findOptimalDuplicates();
  },
  findAllDuplicates(code, filename = "") {
    const cpa = new CPA();
    cpa.add(code, filename);
    return cpa.findAllDuplicates();
  },
  Reporter,
  stringify(duplicates, opts) {
    const r = new Reporter(duplicates);
    return r.toString(opts);
  }
};
