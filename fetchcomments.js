const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const videoId = config.videoId;

const customEndpointUrl = `https://yt.lemnoslife.com/noKey/commentThreads?part=snippet&videoId=${videoId}&maxResults=100`;

async function fetchCommentIds() {
  let commentIds = [];
  let nextPageToken = ''; 

  do {
    const url = nextPageToken 
      ? `${customEndpointUrl}&pageToken=${nextPageToken}` 
      : customEndpointUrl;

    const res = await fetch(url);
    const data = await res.json();

    commentIds = commentIds.concat(data.items.map((item) => item.id));
    nextPageToken = data.nextPageToken; 
  } while (nextPageToken);

  return commentIds;
}

fetchCommentIds()
  .then((commentIds) => {
    console.log(`Fetched ${commentIds.length} comment IDs.`);
    fs.writeFileSync('comment_ids.txt', commentIds.join('\n'));
    console.log('Comment IDs saved to comment_ids.txt');
  })
  .catch((err) => {
    console.error('Error fetching comment IDs:', err);
  });
