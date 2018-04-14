const express = require('express');
const app = express();

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

// Force SSL always for PWA
app.use(forceSSL());

// Serve the dist directory
app.use(express.static(__dirname + '/dist'));

// Start listening on the default Heroku port or 8080
app.listen(process.env.PORT || 8080);
