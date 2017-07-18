"use strict";

const CPA = require("./cpa");
const Reporter = require("./reporter");

module.exports = {
  CPA,
  findDuplicates(code, opts) {
    const cpa = new CPA();
    cpa.add(code, opts);
    return cpa.findOptimalDuplicates();
  },
  findAllDuplicates(code, opts) {
    const cpa = new CPA();
    cpa.add(code, opts);
    return cpa.findAllDuplicates();
  },
  Reporter,
  stringify(duplicates, opts) {
    const r = new Reporter(duplicates);
    return r.toString(opts);
  }
};
