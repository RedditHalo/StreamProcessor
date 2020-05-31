const request = require('request');
const snoowrap = require('snoowrap');
const InboxStream = require('snoostorm').InboxStream;

const client =  new snoowrap({
  userAgent: process.env.USER_AGENT,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
});

const inbox = new InboxStream(client);
inbox.on("item", handleMessage);

async function handleMessage(message){
  console.log(`Processing message with id: ${message.id}`);

  if (message.constructor.name === "Comment") {
    const comment = await message.fetch();

    if (comment.saved) {
      return;
    }

    if (comment.body.match(/u\/DonateOrElse( add)?/gi)) {
      addHalo(comment);
    }

    message.save();
  } else if (message.constructor.name === "PrivateMessage") {
    const pm = await message.fetch();

    //TODO process then mark as read
    
    await pm.markAsRead();
  } 
}

function addHalo(comment) {
  console.log(`Adding halo from comment ${comment.id}`);

  const requestOptions = {
    headers: {
      'x-api-key': process.env.HALO_API_KEY,
      'Content-Type': 'application/json'
    },
    json: {
      commentId: comment.id
    }
  };

  console.log("requestOptions", requestOptions);

  request.post(`${process.env.HALO_API_ENDPOINT}/add-halo`, requestOptions, (error, response, body) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Response:", body);
    }
  });
}
