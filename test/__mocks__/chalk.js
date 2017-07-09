const chalk = jest.genMockFromModule("fs");

chalk.grey = msg => msg;
chalk.bold = {};
chalk.bold.green = msg => msg;
chalk.bold.red = msg => msg;
chalk.bold.cyan = msg => msg;

module.exports = chalk;
