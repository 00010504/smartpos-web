import submitImages from "./submitImages";
import submitFiles from "./submitFiles";
import tasks from "../tasks/tasks";

export default function startTask(task, payload) {
  switch (task) {
    case tasks.submit_images: {
      submitImages(payload);
      break;
    }

    case tasks.submit_files: {
      submitFiles(payload);
      break;
    }

    default: {
      break;
    }
  }
}
