const { google } = require('googleapis');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

const apiKey = config.apiKey;
const videoId = config.videoId;

const youtube = google.youtube({
  version: 'v3',
  auth: apiKey,
});

async function fetchCommentIds() {
  let commentIds = [];
  let nextPageToken = '';

  do {
    const res = await youtube.commentThreads.list({
      part: 'snippet',
      videoId: videoId,
      maxResults: 100,
      pageToken: nextPageToken,
    });
    commentIds = commentIds.concat(
      res.data.items.map((item) => item.id)
    );

    nextPageToken = res.data.nextPageToken;
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