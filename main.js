var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use('/public', express.static('www'));
app.use(bodyParser.json({ type: 'application/json', limit: '10mb' }));

app.get(/(^(?!(\/api.))(?!(reqs.)))\S+/, function (req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});
