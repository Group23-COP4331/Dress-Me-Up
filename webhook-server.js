const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

// Update this to the absolute path of your repository working copy.
const repoPath = '/root/Dress-Me-Up';
// Update this to the directory where the build output should go.
const deployPath = '/var/www/html';

app.post('/git-webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  console.log(`Payload size: ${JSON.stringify(req.body).length} bytes`);

  if (req.headers['x-github-event'] === 'push') {
    // Chain commands: git pull, npm install, npm run build (from frontend directory), and then copy the build output.
    const cmd = `
      cd ${repoPath} &&
      git pull origin main &&
      cd ${repoPath}/backend &&
      npm install &&
      cd ${repoPath}/frontend &&
      npm install &&
      npm run build &&
      rm -rf ${deployPath}/* &&
      cp -r ${repoPath}/frontend/dist/* ${deployPath}
    `;

    exec(cmd, { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during automation: ${error}`);
        return res.status(500).send(`Error: ${error}`);
      }
      console.log(`Automation output: ${stdout}`);
      res.status(200).send('Repository updated, frontend built, and deployed successfully.');
    });
  } else {
    res.status(200).send('Event ignored (not a push event).');
  }
});

const port = 5002;
app.listen(port, () => {
  console.log(`Webhook server listening on port ${port}`);
});
