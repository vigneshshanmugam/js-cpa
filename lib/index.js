"use strict";

const CPA = require("./cpa");
const Reporter = require("./reporter");

module.exports = {
  CPA,
  findDuplicates(code, opts) {
    const cpa = new CPA(opts);
    cpa.add(code, { filename: opts.filename });
    return cpa.findOptimalDuplicates();
  },
  findAllDuplicates(code, opts) {
    const cpa = new CPA(opts);
    cpa.add(code, { filename: opts.filename });
    return cpa.findAllDuplicates();
  },
  Reporter,
  stringify(duplicates, opts) {
    const r = new Reporter(duplicates);
    return r.toString(opts);
  }
};
