const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require('fs');

const configFilePath = 'config.json';

const askQuestion = (question) => {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const getConfiguration = async () => {
  const config = {};

  config.commentText = await askQuestion('Enter the reply text: ');
  const randomNumbersResponse = await askQuestion('Would you like to add random numbers to the replies? (yes/no): ');
  config.addRandomNumbers = randomNumbersResponse.toLowerCase() === 'yes';
  config.videoId = await askQuestion('Enter the video ID: ');
  config.channelIdsFile = './channel_ids.txt';
  config.commentIdsFile = './comment_ids.txt';
  config.replyParamsProtoFile = './replyParams.proto';
  config.sdcProtoFile = './sdc.proto';
  config.cookies = {};
  config.cookies.SECURE_1PAPISID = await askQuestion('Enter the value for the SECURE_1PAPISID cookie: ');
  config.cookies.SECURE_1PSID = await askQuestion('Enter the value for the SECURE_1PSID cookie: ');
  config.cookies.SECURE_1PSIDTS = await askQuestion('Enter the value for the SECURE_1PSIDTS cookie: ');
  config.delay = {};
  config.delay.min = parseInt(await askQuestion('Enter the minimum delay (in milliseconds): '));
  config.delay.max = parseInt(await askQuestion('Enter the maximum delay (in milliseconds): '));
  const loopResponse = await askQuestion('Should the script loop indefinitely? (yes/no): ');
  config.loop = loopResponse.toLowerCase() === 'yes';

  return config;
};

const saveConfiguration = (config) => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  console.log(`Configuration saved to ${configFilePath}`);
};

const getChannelIds = async () => {
  let channelIds = [];
  let keepGoing = true;

  while (keepGoing) {
    const input = await askQuestion(
      'Enter channel IDs type "save" to finish: '
    );

    if (input.toLowerCase() === 'save') {
      keepGoing = false;
    } else {
      const newIds = input.split(',').map((id) => id.trim());
      channelIds = channelIds.concat(newIds);
      console.log(`Added channel ID: ${newIds.join(', ')}`);
    }
  }

  fs.writeFileSync(
    './channel_ids.txt',
    channelIds.join('\n')
  );
  console.log(
    `Channel IDs saved to ./channel_ids.txt`
  );
};

const main = async () => {
  const config = await getConfiguration();
  saveConfiguration(config);

  await getChannelIds(); 

  readline.close();

  console.log('Running run.js');
  require('./run.js'); 
};

main();
