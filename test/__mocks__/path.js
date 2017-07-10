const path = jest.genMockFromModule('path');

path.resolve = function(context, filename) {
  return filename;
}

path.relative = function(context, filename) {
  return filename;
}

path.join = function(a, b) {
  return a + '/' + b;
}

module.exports = path;
