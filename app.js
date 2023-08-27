const { App } = require('@slack/bolt');
const { getTasks, addTask, updateTask, deleteTask } = require('./controllers');
require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command('/tasks', getTasks);
app.command('/add', addTask);
app.command('/update', updateTask);
app.command('/delete', deleteTask);

app.message('hey', async ({ command, say }) => {
  try {
    say('Hey! I can help you manage your tasks.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

(async () => {
  const port = 3000;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`Slack Bot is running on port ${port}!`);
})();
