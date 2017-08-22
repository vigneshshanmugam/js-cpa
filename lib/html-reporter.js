const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const chalk = require("chalk");
const mkdir = require("mkdirp");
const ejs = require("ejs");

const projectRoot = path.join(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const viewsDir = path.join(projectRoot, "client/views");
const defaultOptions = {
  reportFileDir: publicDir,
  appFileName: "reporter.js",
  appStyleName: "reporter.css",
  reporterFileName: "report.html"
};

function getAssetsContent(filename) {
  return readFileSync(path.join(publicDir, filename), "utf-8");
}

function hop(o, key) {
  return Object.prototype.hasOwnProperty.call(o, key);
}

class DupSerializer {
  constructor(duplicates) {
    this.duplicates = duplicates;
  }

  serialize() {
    return JSON.stringify(this.getDuplicates(), null, 2);
  }

  getDuplicates() {
    return this.duplicates.map(dup => this.getFileDupsMapping(dup));
  }

  getExtraFileInfo(filename) {
    return {
      filename,
      sourceCode: readFileSync(filename, "utf-8")
    };
  }

  nodeSerializer({ loc, sourceCode: match }) {
    // we just need location from node
    return { loc, match };
  }

  getFileDupsMapping(
    dupList,
    nodeSerializer = this.nodeSerializer,
    extraFileInfo = this.getExtraFileInfo
  ) {
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
        extraFileInfo(filename)
      )
    );
  }
}

class HTMLReporter {
  constructor(duplicates, opts = {}) {
    this.duplicates = duplicates;
    this.opts = Object.assign({}, defaultOptions, opts);
  }

  printError(err) {
    process.stderr.write(chalk.red(err));
  }

  removeWhiteSpaces(value) {
    return value.replace(/ /g, "");
  }

  renderFile() {
    if (this.duplicates.length < 1) {
      process.stderr.write(
        chalk.red(
          chalk.bold(
            "CPA report ::NOT:: created since there were 0 duplicates!!"
          )
        )
      );
      return;
    }

    const duplicates = new DupSerializer(this.duplicates).serialize();

    ejs.renderFile(
      path.join(viewsDir, "index.ejs"),
      {
        mode: "static",
        appFileName: this.opts.appFileName,
        appStyleName: this.opts.appStyleName,
        dumpAssets: getAssetsContent,
        data: duplicates
      },
      (err, reporterHtml) => {
        if (err) {
          this.printError(err);
          return;
        }
        const { reportFileDir, reporterFileName } = this.opts;

        const htmlFilePath = path.join(reportFileDir, reporterFileName);
        mkdir.sync(path.dirname(htmlFilePath));
        writeFileSync(htmlFilePath, reporterHtml, "utf-8");

        process.stdout.write(
          chalk.green(chalk.bold(`CPA report created at ${htmlFilePath}`))
        );
      }
    );
  }
}

module.exports = HTMLReporter;
