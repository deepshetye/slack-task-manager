const fs = require('fs');

let raw = fs.readFileSync('tasks.json'); // Reading tasks.json file
let tasks = JSON.parse(raw);

const getTasks = async ({ command, ack, say }) => {
  try {
    await ack();
    let message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Tasks',
            emoji: true,
          },
        },
      ],
    };

    tasks.data.map((task, index) => {
      message.blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${index + 1}. ${task.title}* | *${task.status}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: task.description,
          },
        }
      );
    });
    say(message);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
};

const addTask = async ({ command, ack, say }) => {
  try {
    await ack();
    const data = command.text.split('|');
    const newTask = {
      title: data[0].trim(),
      description: data[1].trim(),
      status: 'Pending',
    };

    fs.readFile('tasks.json', function (err, data) {
      const json = JSON.parse(data);
      json.data.push(newTask);
      fs.writeFile('tasks.json', JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('Successfully saved to tasks.json!');
      });
    });
    say(`You've added a new tasks with the title *${newTask.title}.*`);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
};

const updateTask = async ({ command, ack, say }) => {
  try {
    await ack();
    const index = parseInt(command.text) - 1;
    fs.readFile('tasks.json', function (err, data) {
      const json = JSON.parse(data);

      let newArray = [json.data];

      newArray[index] = {
        ...newArray[index],
        status: 'Done',
      };

      fs.writeFile(
        'tasks.json',
        JSON.stringify({ data: [...newArray] }),
        function (err) {
          if (err) throw err;
        }
      );
    });
    say(`Task with id=${index + 1} is marked "Done"`);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
};

const deleteTask = async ({ command, ack, say }) => {
  try {
    await ack();
    const index = parseInt(command.text) - 1;
    fs.readFile('tasks.json', function (err, data) {
      const json = JSON.parse(data);

      let newArray = json.data.filter((task, idx) => index !== idx);

      fs.writeFile(
        'tasks.json',
        JSON.stringify({ data: [...newArray] }),
        function (err) {
          if (err) throw err;
        }
      );
    });
    say(`Task with id=${index + 1} is deleted successfully!`);
  } catch (error) {
    console.log('err');
    console.error(error);
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
