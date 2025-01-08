const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function changeJavaClassName(javaCode, newClassName) {
  // Regex to find the class declaration and replace the class name
  const classRegex = /public class (\w+)/;
  return javaCode.replace(classRegex, `public class ${newClassName}`);
}
app.post("/execute", async (req, res) => {
  let { language, code } = req.body;
  let fileName;

  if (language === null || code === null) {
    return res.status(400).send({ error: "Language and code are required" });
  }
  if (language === "java") {
    code = changeJavaClassName(code, "JavaMain");
    fileName = `temp/JavaMain.java`;
  } else {
    const fileId = uuidv4();
    fileName = `temp/${fileId}.${getFileExtension(language)}`;
  }

  fs.writeFileSync(fileName, code);

  try {
    // Run the code inside a Docker container
    const result = await runInDocker(language, fileName);
    res.send({ output: result });
  } catch (error) {
    res.status(200).send({ output: error, and: "500 not ok" });
  } finally {
    // Clean up the temporary file
    try {
      console.log("file name is : ", fileName);

      fs.unlinkSync(fileName);
      if (language === "java") {
        fs.unlinkSync(`temp/JavaMain.class`);
      }

      if (language === "c" || language === "cpp") {
        fs.unlinkSync(fileName.split(".")[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

function getFileExtension(language) {
  const extensions = {
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
    javascript: "js",
  };
  return extensions[language] || "txt";
}

function runInDocker(language, filePath) {
  const dockerImages = {
    python: "python:3.9",
    java: "openjdk:17",
    c: "gcc:latest",
    cpp: "gcc:latest",
    javascript: "node:latest",
  };

  const commands = {
    python: `python ${filePath}`,
    javascript: `node ${filePath}`,
    java: `javac ${filePath} && java -cp /temp ${filePath
      .replace(".java", "")
      .slice(5)}`,
    c: `gcc ${filePath} -o ${filePath.replace(".c", "")} && ${filePath.replace(
      ".c",
      ""
    )}`,
    cpp: `g++ ${filePath} -o ${filePath.replace(
      ".cpp",
      ""
    )} && ${filePath.replace(".cpp", "")}`,
  };

  const image = dockerImages[language];
  const command = commands[language];

  if (!image || !command) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return new Promise((resolve, reject) => {
    exec(
      `docker run --rm -v "${__dirname}/temp:/temp" ${image} sh -c "${command}"`,

      (error, stdout, stderr) => {
        if (error) {
          return reject(stderr || error);
        }
        resolve(stdout);
      }
    );
  });
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
