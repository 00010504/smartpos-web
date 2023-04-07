import tasks from "./tasks/tasks";
import startTask from "./functions/startTask";

self.onmessage = onMessage;

function onMessage({ data }) {
  if (data.task in tasks) {
    startTask(data.task, data.payload);
  }
}
