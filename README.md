# js-cpa

Identify structurally similar code patterns that are duplicated across a JavaScript bundle/file seamlessly.

Running it on [Inferno](https://github.com/infernojs/inferno)

<img width="746" alt="CPA on Inferno" src="https://user-images.githubusercontent.com/3902525/27997771-bb00c6da-64ff-11e7-9f12-56059f0ae617.png">

### Installation
```sh
npm install js-cpa
```

### Usage
```js
js-cpa <file-path>
```

```js
const findMatches = require('js-cpa');
findMatches(filePath)
```

### Features

+ Works only across function boundaries
+ Matches the longest common subsequence and ignores the children
+ Ignores comments on the Output


Thanks to [Boopathi](https://twitter.com/heisenbugger) for making the implementation much simpler. 
