const core = require("@actions/core");
const command = require("@actions/core/lib/command")
const github = require("@actions/github");
const path = require("path");
const fs = require("fs");

const levelPriority = { error: 0, warning: 10000, notice: 20000 };

function higherLevel(level1, level2) {
  if (level1 === "error" || (level1 === "warning" && level2 === "notice")) {
    return level1;
  } else {
    return level2;
  }
}

try {
  const annotationLevel = JSON.parse(core.getInput("levels"));
  const fullPath = path.resolve(core.getInput("path"));
  const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const annotations = [];

  for (const file of json.files) {

    const annotationMap = {};

    for (const offense of file.offenses) {
      const col = offense.location.column;
      const line = offense.location.line;
      const properties = { file: file.path, line, col };
      const level = annotationLevel[offense.severity];
      const message = `[${offense.cop_name}] ${offense.message}`;
      const key = `${file.path}:${line}`;
      const annotation = annotationMap[key];

      if (annotation) {
        annotation.size = annotation.size + 1;
        annotation.message = annotation.message + "\n" + message;
        annotation.level = higherLevel(annotation.level, level);
      } else {
        annotationMap[key] = { size: 1, level, properties, message }
        annotations.push(annotationMap[key]);
      }
    }
  }

  annotations.sort(function (a, b) {
    return levelPriority[a.level] + a.size - levelPriority[b.level] - b.size;
  });

  for (const { level, properties, message } of annotations) {
    command.issueCommand(level, properties, message);
  }

} catch (error) {
  if (error.code === "ENOENT") {
    core.setFailed(`File '${fullPath}' doesn't exist`)
  } else {
    core.setFailed(error.message);
  }
}
