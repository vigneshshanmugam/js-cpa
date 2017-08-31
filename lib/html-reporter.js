const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const chalk = require("chalk");
const ejs = require("ejs");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const viewsDir = path.join(projectRoot, "client/views");
const defaultOptions = {
  appFileName: "reporter.js",
  appStyleName: "reporter.css"
};

function getAssetsContent(filename) {
  return readFileSync(path.join(publicDir, filename), "utf-8");
}

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}

class DupSerializer {
  constructor(duplicates, sources) {
    this.duplicates = duplicates;
    this.sources = sources;
  }

  serialize() {
    return JSON.stringify(this.getDuplicates(), null, 2);
  }

  getDuplicates() {
    return this.duplicates.map(dup => this.getFileDupsMapping(dup));
  }

  getFileInfo(filename) {
    return {
      filename,
      sourceCode: this.sources.get(filename)
    };
  }

  nodeSerializer({ loc, sourceCode: match }) {
    // we just need location from node
    return {
      loc,
      match
    };
  }

  getFileDupsMapping(dupList, nodeSerializer = this.nodeSerializer) {
    // create a ListMultiMap<file, node>
    const map = dupList.reduce((acc, cur) => {
      if (hop(acc, cur.id)) {
        acc[cur.id].push(nodeSerializer(cur.node));
      } else {
        acc[cur.id] = [nodeSerializer(cur.node)];
      }
      return acc;
    }, {});

    // convert that to List<Map>
    return Object.keys(map).map(filename =>
      Object.assign(
        {
          // sort nodes by location
          nodes: map[filename].sort((a, b) => {
            if (a.loc.start.line === b.loc.start.line) {
              return a.loc.start.column - b.loc.start.column;
            }
            return a.loc.start.line - b.loc.start.line;
          })
        },
        this.getFileInfo(filename)
      )
    );
  }
}

class HTMLReporter {
  static get TYPE_RESULT() {
    return "RESULT";
  }

  static get TYPE_WARNING() {
    return "WARNING";
  }

  constructor(duplicates, sources, opts = {}) {
    this.duplicates = duplicates;
    this.sources = sources;
    this.opts = Object.assign({}, defaultOptions, opts);
  }

  printError(err) {
    process.stderr.write(chalk.red(err));
  }

  removeWhiteSpaces(value) {
    return value.replace(/ /g, "");
  }

  renderFile() {
    return new Promise((resolve, reject) => {
      if (this.duplicates.lenght < 1) {
        return resolve({
          type: HTMLReporter.TYPE_WARNING,
          warning: "There are NO duplicates. Report is not generated"
        });
      }

      const duplicates = new DupSerializer(
        this.duplicates,
        this.sources
      ).serialize();

      ejs.renderFile(
        path.join(viewsDir, "index.ejs"),
        {
          mode: "static",
          appFileName: this.opts.appFileName,
          appStyleName: this.opts.appStyleName,
          dumpAssets: getAssetsContent,
          data: duplicates
        },
        (err, reportHtml) => {
          if (err) return reject(err);

          resolve({
            type: HTMLReporter.TYPE_RESULT,
            html: reportHtml
          });
        }
      );
    });
  }
}

module.exports = HTMLReporter;
