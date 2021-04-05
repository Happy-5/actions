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
    for (const offense of file.offenses) {
      const level = annotationLevel[offense.severity];
      const properties = {
        file: file.path,
        col: offense.location.column,
        line: offense.location.line,
      };
      const message = `[${offense.cop_name}] ${offense.message}`;

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
