# js-cpa

Identify structurally similar code patterns that are duplicated across a JavaScript bundle/file seamlessly.

Running it on [Inferno](https://github.com/infernojs/inferno)

<img width="746" alt="CPA on Inferno" src="https://user-images.githubusercontent.com/3902525/27997771-bb00c6da-64ff-11e7-9f12-56059f0ae617.png">

### Features

+ Works only across function boundaries
+ Matches the longest common subsequence and ignores the children
+ Ignores comments on the Output

### Installation

```sh
npm install -g js-cpa
```

### CLI
```sh
Usage: js-cpa [options] <file ...>


Options:

  -V, --version              output the version number
  -f, --filelist             read filelist from stdio stream - if/when you cross ARG_MAX. eg: ls *.js | js-cpa -f
  -m, --module               parse files with sourceType=module
  -l, --language <language>  language (js|ts|flow)
  -t, --threshold <n>        Threshold (in bytes)
  -C, --no-colors            Disable colors in output
  -h, --help                 output usage information
```

### API
```js
const { findDuplicates, stringify }= require('js-cpa');
const fs = require("fs");
const code = fs.readFileSync(filePath, "utf-8);
const duplicates = findDuplicates(code);

process.stdout.write(stringify(duplicates)); // prints to stdout
```


