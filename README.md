# js-cpa

Identify structurally similar code patterns that are duplicated across a JavaScript bundle/file seamlessly.

[!CPA on Inferno.js](https://user-images.githubusercontent.com/3902525/27997771-bb00c6da-64ff-11e7-9f12-56059f0ae617.png)

### Installation
```sh
npm install js-cpa
```

### Usage
```js
js-cpa <file-path>
```

### Features

+ Works only across function boundaries
+ Matches the longest common subsequence and ignores the children
+ Ignores comments on the Output
