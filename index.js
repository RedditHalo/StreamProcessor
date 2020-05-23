const EventSource = require('eventsource');
const request = require('request');

const apiKey = process.env.API_KEY;
const baseApiUrl = process.env.API_URL;

const source = new EventSource('http://stream.pushshift.io');
const addHaloRegex = /^(\!RedditHalo)/
var countt = 0;

source.addEventListener('rc', (e) => {
  const comment = JSON.parse(e.data);

  countt++;
  if (countt % 500 === 0) console.log(comment.id)
 
  if (comment.body.match(addHaloRegex)) {
    addHalo(comment);
  }
})

function addHalo(comment) {
  console.log(`Adding halo from comment ${comment.id}`)
  const requestOptions = {
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json'
    },
    json: {
      commentId: comment.id
    }
  };
  console.log("requestOptions", requestOptions)

  request.post(`${baseApiUrl}/add-halo`, requestOptions, (error, response, body) => {
    if (error) {
      console.log("Error:", error)
    } else {
      console.log("Response:", body);
    }
  })
}
