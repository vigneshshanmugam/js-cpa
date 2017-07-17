const { findDuplicates, stringify } = require("../");
const path = require("path");
const fs = require("fs");

const fixturesDir = path.join(__dirname, "fixtures");

describe("fixtures", () => {
  fs.readdirSync(fixturesDir).forEach(name =>
    test(name, () => {
      const fixture = fs.readFileSync(path.join(fixturesDir, name)).toString();
      expect(
        stringify(findDuplicates(fixture, name), {
          colors: false,
          newline: false
        })
      ).toMatchSnapshot();
    })
  );
});
