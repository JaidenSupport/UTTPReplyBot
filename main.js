const crypto = require('crypto');
const protobuf = require('protobufjs');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');


const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

async function getRandomDelay() {
  const minDelay = config.delay.min || 0;
  const maxDelay = config.delay.max || 0;
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

async function readChannelIds() {
  try {
    const data = await fs.promises.readFile(config.channelIdsFile, 'utf-8');
    const channelIds = data.split('\n').map(id => id.trim()).filter(id => id);
    if (channelIds.length === 0) {
      throw new Error("No channel IDs found. Please check the configuration file.");
    }
    return channelIds;
  } catch (err) {
    console.error("Error reading channel IDs:", err);
    process.exit(1);
  }
}

function getRandomChannelId(channelIds) {
  if (channelIds.length === 0) {
    console.error("No channel IDs found. Please check the configuration file.");
    process.exit(1);
  }
  const randomIndex = Math.floor(Math.random() * channelIds.length);
  return channelIds[randomIndex];
}

async function encodeProtobuf(protoPath, messageType, jsonData) {
  try {
    const root = await protobuf.load(protoPath);
    const MessageType = root.lookupType(messageType);
    const errMsg = MessageType.verify(jsonData);
    if (errMsg) throw Error(errMsg);
    const message = MessageType.create(jsonData);
    const buffer = MessageType.encode(message).finish();
    return Buffer.from(buffer).toString('hex');
  } catch (error) {
    console.error(`Error encoding protobuf:`, error);
    throw error;
  }
}

function generateSapisidhash(timestamp, cookie) {
  const data = `${timestamp} ${cookie} https://www.youtube.com`;
  return crypto.createHash('sha1').update(data).digest('hex');
}

async function processCommentId(commentId, channelIds) {
  try {
    const replyParamsHex = await encodeProtobuf(
      config.replyParamsProtoFile,
      'replyParams',
      { videoId: config.videoId, commentId: commentId }
    );

    if (!replyParamsHex) {
      console.error(`Error encoding reply parameters for commentId ${commentId}`);
      return;
    }

    const encodedReplyParams = encodeURIComponent(Buffer.from(replyParamsHex, 'hex').toString('base64'));

    const channelId = getRandomChannelId(channelIds);
    console.log(`Using channel ID: ${channelId} for commentId ${commentId}`);

    const sdcHex = await encodeProtobuf(
      config.sdcProtoFile,
      'sdc',
      { channelID: channelId }
    );

    if (!sdcHex) {
      console.error(`Error encoding serialized delegation context for commentId ${commentId}`);
      return;
    }

    const serializedDelegationContext = encodeURIComponent(Buffer.from(sdcHex, 'hex').toString('base64'));

    const currentTime = Math.floor(Date.now() / 1000);
    const sapisidhashToken = generateSapisidhash(currentTime, config.cookies.SECURE_1PAPISID);


    let commentText = config.commentText;
    if (config.addRandomNumbers) {
      const randomNumbers = Math.floor(Math.random() * 90000) + 10000;
      commentText += ` ${randomNumbers}`;
    }

    const requestBody = {
      commentText: commentText,
      createReplyParams: encodedReplyParams,
      context: {
        client: {
          clientName: "WEB",
          clientVersion: "2.20240308.00.00"
        },
        user: {
          lockedSafetyMode: false,
          serializedDelegationContext: serializedDelegationContext
        }
      }
    };

    const requestHeaders = {
      'authorization': `SAPISIDHASH ${currentTime}_${sapisidhashToken}`,
      'content-type': 'application/json',
      'cookie': `__Secure-1PAPISID=${config.cookies.SECURE_1PAPISID}; __Secure-1PSID=${config.cookies.SECURE_1PSID}; __Secure-1PSIDTS=${config.cookies.SECURE_1PSIDTS}`,
      'origin': 'https://www.youtube.com'
    };

    const response = await axios.post(
      'https://www.youtube.com/youtubei/v1/comment/create_comment_reply',
      requestBody,
      { headers: requestHeaders }
    );

    console.log(`Response for commentId ${commentId}:`, response.data);

    const delay = await getRandomDelay();
    console.log(`Waiting for ${delay / 1000} seconds...`);
    await new Promise(resolve => setTimeout(resolve, delay));

  } catch (error) {
    console.error(`Error for commentId ${commentId}:`, error);
  }
}

async function processCommentIds(channelIds) {
  try {
    const fileStream = fs.createReadStream(config.commentIdsFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      const commentId = line.trim();
      if (commentId) {
        await processCommentId(commentId, channelIds);
      }
    }
  } catch (error) {
    console.error("Error reading comment IDs file:", error);
  }
}

async function main() {
  const channelIds = await readChannelIds();

  await processCommentIds(channelIds);

  while (config.loop) {
    await processCommentIds(channelIds);
    console.log("Finished!");
  }
}

main();