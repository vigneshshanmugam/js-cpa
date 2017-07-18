const { findDuplicates, stringify } = require("../");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "fixtures");

describe("fixtures", () => {
  fs.readdirSync(fixturesDir).forEach(filename =>
    test(filename, () => {
      const fixture = fs
        .readFileSync(path.join(fixturesDir, filename))
        .toString();
      expect(
        stringify(findDuplicates(fixture, { filename, sourceType: "module" }), {
          colors: false,
          newline: false
        })
      ).toMatchSnapshot();
    })
  );
});
