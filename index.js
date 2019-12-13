
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const toJson = require('unsplash-js').toJson;

const Unsplash = require('unsplash-js').default;
global.fetch = require('node-fetch');


// require syntax
var unsplash = new Unsplash({
    accessKey: process.env.ACCESS_KEY,
    // Optionally you can also configure a custom header to be sent with every request
    // headers: {"X-Custom-Header": "foo"},
    // Optionally if using a node-fetch polyfill or a version of fetch which supports the timeout option, you can configure the request timeout for all requests
    timeout: 500 // values set in ms
});

app.use(cors());

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

router.get('/random', function(req, res) {
    const count = req['query']['count'] === undefined ? 1 : req['query']['count'];
    var images = [];
    if (req['query']['keyword'] === undefined) {
        unsplash.photos.getRandomPhoto({"count": count})
            .then(toJson)
            .then(response => {
                response.forEach(element => {
                    images.push(element['urls']['regular']);
                });
                var data = {"data" : images};
                res.json(data);
            }).catch(err => {
            res.json({"err": err})
        });
    } else {
        const keyword = req['query']['keyword'];
        unsplash.search.photos(keyword, 1, count, { orientation: "portrait" })
            .then(toJson)
            .then(response => {
                console.log(response);
                response['results'].forEach(element => {
                    images.push(element['urls']['regular']);
                });
                var data = {"data" : images};
                res.json(data);
            }).catch(err => {
            res.json({"err": err})
        })
    }

});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
