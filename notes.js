"use strict";

let array = [];

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const content = () => fs.readFileSync("notes.txt", "utf8");

const question = (str) => new Promise((answer) => rl.question(str, answer));
const add = (data) => {
  fs.appendFileSync("notes.txt", `${data}`, () => {});
};

const readArr = () => {
  array = [];
  let lines = content().split("\n");
  for (let line in lines) {
      array.push(lines[line].split(","));
  }
  array.pop();
  return array;
};

const addToObjectDate = () => {
  let objectArray = [];
  for (let i = 0; i < array.length; i++) {
    const notesObj = {
      Title: array[i][0],
      Descr: array[i][1],
      Time: new Date(Number(array[i][2])),
    };
    objectArray.push(notesObj);
  }
  return objectArray;
};

rl.prompt();
const commands = {
  help() {
    console.log("Commands:", Object.keys(commands).join(", "));
  },
  show() {
    readArr();
    console.table(addToObjectDate());
  },
  add() {
    Input.title();
  },
  delete() {
    Input.deletetitle();
  },
  find() {
    Input.find();
  },
  exit() {
    rl.close();
  },
};
rl.on("line", (line) => {
  line = line.trim();
  const command = commands[line];
  if (command) command();
  else console.log("\x1b[31m", "Unknown command", "\x1b[0m");
  rl.prompt();
}).on("close", () => {
  console.log("Bye!");
  process.exit(0);
});

const Input = {
  title: async () => {
    let k = 0;
    const name = await question("Enter your title: ");
    readArr();
    for (const line of array) {
      if (line[0] == name.toString()) {
        k++;
      }
    }
    if (k != 0) {
      console.log("\x1b[31m", "already used", "\x1b[0m");
      Input.title();
    } else {
      add(name);
      add(",");
      return Input.desc();
    }
  },
  desc: async () => {
    const desc = await question("Enter your description: ");
    add(desc);
    add(",");
    return Input.date();
  },
  date: async () => {
    add(Date.now());
    add("\n");
    return Input.results();
  },
  results: async () => {
    console.log("\x1b[32m", "was written", "\x1b[0m");
    return Input.end();
  },
  deletetitle: async () => {
    const del = await question("Enter title which you want to delete: ");
    const replace = require('replace-in-file');


    readArr();
    let lineToReplace = '';
    const lineFound =()=>{
      for(const line of array){
        if(line.includes(del)){
       lineToReplace = line.join(',')+'\n';
       console.dir(lineToReplace);
       return lineToReplace;
        };
       }
    }
    
    lineFound();
    const options = {
      files: 'notes.txt',
      from: lineToReplace,
      to: '',
    };

    try {
      const results = await replace(options)
      console.log('Replacement results:', results);
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
    readArr();
    return Input.end();
  },
  find: async () => {
    const findTitle = await question("Enter title which you want to find: ");
    readArr();
    for (const line of array) {
      if (findTitle.toString().trim() == line[0].toString().trim()) {
        const mess = "\x1b[33m" +
        "Title: " +
        "\x1b[0m" +
        "\n" +
        line[0] +
        "\n" +
        "\n" +
        "\x1b[33m" +
        "Description: " +
        "\x1b[0m" +
        "\n" +
        line[1] +
        "\n" +
        "\n" +
        "\x1b[33m" +
        "Time: " +
        "\x1b[0m" +
        "\n" +
        line[2] +
        "\n" +
        "\n" +
        "\n"
        console.log(mess);
      }
    }
    return Input.end();
  },
  end: async () => {
    rl.prompt();
  },
};
