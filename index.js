const EventSource = require('eventsource');
const request = require('request');

const apiKey = process.env.API_KEY;
const baseApiUrl = process.env.API_URL;

const source = new EventSource('http://stream.pushshift.io');
const addDiamondRegex = /^(\!RedditDiamond( add)?)/

source.addEventListener('rc', (e) => {
  const comment = JSON.parse(e.data);

  if (comment.body.match(addDiamondRegex)) {
    addDiamond(comment);
  }
})

function postComment(comment) {
  const requestOptions = {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    json: {
      commentId: comment.id
    }
  };

  request.post(`${baseApiUrl}/add-halo`, requestOptions, (error, response, body) => {
    if (error) {
      console.log("Error:", error)
    } else {
      console.log("Response:", body);
    }
  })
}
