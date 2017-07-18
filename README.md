# js-cpa

Identify structurally similar functions that are duplicated across a JavaScript bundle/file seamlessly.

Running it on [Inferno](https://github.com/infernojs/inferno)

<img width="490" alt="CPA on Inferno" src="https://user-images.githubusercontent.com/3902525/28320650-6bd7632e-6bd1-11e7-9837-2af42c79c687.png">

### Features

+ Works only across function boundaries
+ Matches the longest common subsequence and ignores the children
+ Ignores comments on the output

### Installation

```sh
npm install -g js-cpa
```

### CLI
```sh
Usage: js-cpa [options] <file ...>


Options:

  -V, --version              output the version number
  -f, --filelist             read filelist from STDIN stream - if/when you cross ARG_MAX. eg: ls *.js | js-cpa -f
  -m, --module               parse files with sourceType=module
  -l, --language <language>  language (js|ts|flow)
  -t, --threshold <n>        threshold (in bytes)
  -C, --no-colors            disable colors in output
  -h, --help                 output usage information
```

### API

```js
const { findDuplicates, stringify }= require('js-cpa');
const fs = require("fs");
const code = fs.readFileSync(filePath, "utf-8");
const duplicates = findDuplicates(code, {
  filename: "test"
});

process.stdout.write(stringify(duplicates)); // prints to stdout
```

##### Options
------
+ filename - name of the file used in the output
+ sourceType - denotes the mode the code should be parsed in. eg - script|module
+ language - denotes the language. eg - (js|ts|flow)
+ threshold - threshold in bytes

##### findDuplicates(code, opts)
------
Finds the optimal duplicate functions that are structurally similar. It tries to find the longest matching subexpression across the AST which ignores the children(inner function) if the parent(outer function) is already mached

##### findAllDuplicates(code, opts)
------
Finds all duplicate functions that are structurally similar.

##### stringify(duplicates, options)
------
Gets the output in a more presentable way

Options
+ colors - enable colors on the stdout
+ newline - prints newline after each duplicates
