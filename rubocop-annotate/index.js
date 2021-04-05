const core = require("@actions/core");
const command = require("@actions/core/lib/command")
const github = require("@actions/github");
const path = require("path");
const fs = require("fs");

try {
  const annotationLevel = JSON.parse(core.getInput("levels"));
  const fullPath = path.resolve(core.getInput("path"));
  const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));

  for (const file of json.files) {

    const annotations = {};

    for (const offense of file.offenses) {
      const col = offense.location.column;
      const line = offense.location.line;
      const properties = { file: file.path, line, col };
      const level = annotationLevel[offense.severity];
      const message = `[${offense.cop_name}] ${offense.message}`;

      const key = `${file.path}:${line}`

      if (annotations[key]) {
        const annotation = annotations[key]

        annotation.message = annotation.message + "\n" + message

        if (annotation.level === "notice") {
          annotation.level = level
        } else if (annotation.level === "warning" && level !== "notice") {
          annotation.level = level
        }

      } else {
        annotations[key] = { level, properties, message }
      }
    }

    for (const annotationKey in annotations) {
      const { level, properties, message } = annotations[annotationKey];
      command.issueCommand(level, properties, message);
    }
  }

} catch (error) {
  if (error.code === "ENOENT") {
    core.setFailed(`File '${fullPath}' doesn't exist`)
  } else {
    core.setFailed(error.message);
  }
}
