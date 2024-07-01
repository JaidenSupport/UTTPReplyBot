const { spawn } = require('child_process');

const firstScript = 'fetchcomments.js';
const secondScript = 'main.js';

const runScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    const process = spawn('node', [scriptPath], { stdio: 'inherit' });

    process.on('error', (error) => {
      reject(`Failed to start script '${scriptPath}': ${error}`);
    });

    process.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Script '${scriptPath}' exited with code ${code}`);
      }
    });
  });
};

(async () => {
  try {
    console.log(`Running script: ${firstScript}`);
    await runScript(firstScript);
    console.log(`Script '${firstScript}' finished successfully.`);

    console.log(`Running script: ${secondScript}`);
    await runScript(secondScript);
    console.log(`Script '${secondScript}' finished successfully.`);

  } catch (error) {
    console.error(error);
  }
})();
