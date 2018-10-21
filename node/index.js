var io = require('socket.io')(8000);

var Twit = require('twit');

consumer_key = "xYFrvrj5Y3e7N14V5L8bps3tC";
consumer_secret = "VpGYbekWBbihOEMG9veHFvkCnqznCpqqdscAcJpR6rUGjXw9o8";
access_token = "887667605850529794-gaTOVNMcujvoKYfl91ozlPRJWFrtXnw";
access_token_secret = "2AIYjeKtcV7EvNUuS5l5HVkMVhEseldsWlEmnoN0gdRsI";

var T = new Twit({
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
  timeout_ms:60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:true,     // optional - requires SSL certificates to be valid.
})

var stream = T.stream('statuses/filter', { track: 'algeria' });

// when connection send hello and receive response
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('reply', function (data) {
    console.log(data);
  });
});
// send stream of tweets
stream.on('tweet', function (tweet) {
    console.log(tweet);
      io.emit('tweet',tweet); 
});
