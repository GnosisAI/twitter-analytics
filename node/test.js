var Twit = require('twit');
var amqp = require('amqplib/callback_api');

consumer_key = "xYFrvrj5Y3e7N14V5L8bps3tC";
consumer_secret = "VpGYbekWBbihOEMG9veHFvkCnqznCpqqdscAcJpR6rUGjXw9o8";
access_token = "887667605850529794-gaTOVNMcujvoKYfl91ozlPRJWFrtXnw";
access_token_secret = "2AIYjeKtcV7EvNUuS5l5HVkMVhEseldsWlEmnoN0gdRsI";

var T = new Twit({
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true, // optional - requires SSL certificates to be valid.
})

var stream = T.stream('statuses/filter', {
    track: 'fr'
});

stream.on('tweet', function (tweet) {
    var text = tweet.extended_tweet;
    if (text) {
        io.emit('tweet', text.full_text);
    }
});

amqp.connect('amqp://localhost:9999', function (err, conn) {
conn.createChannel(function (err, ch) {
    var q = 'tweet';

    ch.assertQueue(q, {
        durable: false
    });
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
});
});