const Handlebars = require('handlebars');

Handlebars.registerHelper('block', function(name) {
  const blocks = this._blocks;
  const content = blocks && blocks[name];
  return content ? content.join('\n') : null;
});
