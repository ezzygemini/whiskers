const argument = require('ezzy-argument');
const ExpressMvc = require('ezzy-express-mvc');
const app = new ExpressMvc(__dirname + '/root', undefined, undefined, '/doc');
app.listen(argument('port', 1933));
module.exports = app;
