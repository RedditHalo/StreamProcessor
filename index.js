const EventSource = require('eventsource');

var source = new EventSource('http://stream.pushshift.io');
const regex = /^(\!RedditDiamond)/

source.addEventListener('rc', (e) => {
  var comment = JSON.parse(e.data);

  if (comment.body.match(regex)) {
    console.log(comment);
  }
})