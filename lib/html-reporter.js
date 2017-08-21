const path = require("path");
const fs = require("fs");
const http = require("http");
const chalk = require("chalk");
const mkdir = require("mkdirp");

const ejs = require("ejs");

const projectRoot = path.join(__dirname, "..");

const defaultOptions = {
  reportFileDir: "public",
  appFileName: "reporter.js",
  appStyleName: "reporter.css",
  reporterFileName: "report.html"
};

function getAssetsContent(filename) {
  return fs.readFileSync(path.join(projectRoot, "public", filename), "utf-8");
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
      sourceCode: fs.readFileSync(filename).toString()
    };
  }

  nodeSerializer(node) {
    // we just need to location from node
    return {
      loc: node.loc,
      match: node.sourceCode
    };
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
          nodes: map[filename]
        },
        extraFileInfo(filename)
      )
    );
  }
}

class HTMLReporter {
  constructor(duplicates, opts) {
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
      path.join(projectRoot, "views", "index.ejs"),
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
        fs.writeFileSync(htmlFilePath, reporterHtml);

        process.stdout.write(
          chalk.green(chalk.bold(`CPA report created at ${htmlFilePath}`))
        );
      }
    );
  }
}

module.exports = HTMLReporter;
