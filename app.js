// Local development server. On Vercel, public/ is served statically (see vercel.json).
const express = require('express');

const app = express();
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.redirect('/angularfire.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server is listening on http://localhost:' + port);
});
