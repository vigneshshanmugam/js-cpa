const path = require("path");
const fs = require("fs");
const http = require("http");
const chalk = require("chalk");
const mkdir = require("mkdirp");

const ejs = require("ejs");

const projectRoot = path.resolve(__dirname, "..");

const defaultOptions = {
  reportFileDir: "public",
  appFileName: "reporter.js",
  reporterFileName: "report.html"
};

function getAssetsContent(filename) {
  return fs.readFileSync(`${projectRoot}/public/${filename}`, "utf-8");
}

class HTMLReporter {
  constructor(duplicates, opts) {
    this.duplicates = duplicates;
    this.opts = Object.assign({}, defaultOptions, opts);

    this.renderFile = this.renderFile.bind(this);
    this.printError = this.printError.bind(this);
  }

  printError(err) {
    process.stderr.write(chalk.red(err));
  }

  renderFile() {
    if (!this.duplicates) {
      return;
    }

    ejs.renderFile(
      `${projectRoot}/views/index.ejs`,
      {
        mode: "static",
        appFileName: this.opts.appFileName,
        dumpAssets: getAssetsContent,
        duplicates: JSON.stringify({
          data: this.duplicates.map(duplicate => {
            return duplicate.map(({ node, id }) => {
              return {
                id,
                sourceCode: node.sourceCode,
                loc: node.loc
              };
            });
          })
        })
      },
      (err, reporterHtml) => {
        if (err) {
          this.printError(err);
        }
        const { reportFileDir, reporterFileName } = this.opts;

        const htmlFilePath = path.resolve(reportFileDir, reporterFileName);
        mkdir.sync(path.dirname(htmlFilePath));
        fs.writeFileSync(htmlFilePath, reporterHtml);

        process.stdout.write(chalk.green(chalk.bold("CPA Report created!!")));
      }
    );
  }
}

module.exports = HTMLReporter;
