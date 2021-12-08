"use strict";

const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const content = () => fs.readFileSync("notes.txt", "utf8");

const question = (str) => new Promise((answer) => rl.question(str, answer));
const add = (data) => {
  fs.appendFileSync("notes.txt",`${data}`, () => {});
};
let array = [];
const readArr = () => {
  array = [];
  let lines = content().split("\n");
  for (let line in lines) {
    array.push(lines[line].split(","));
  }
  array.pop();
  return array;
};

const addToObject = () => {
  let objectArray = [];
  for (let i = 0; i < array.length; i++) {
    const notesObj = {
      Title: array[i][0],
      Descr: array[i][1],
      Time: array[i][2],
    };
    objectArray.push(notesObj);
  }
  return objectArray;
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

/*const a =Number(array[2][2]);
console.log(a);
let date = new Date(a);
console.log(date);
*/

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

  exit() {
    rl.close();
  },
};
rl.on("line", (line) => {
  line = line.trim();
  const command = commands[line];
  if (command) command();
  else console.log("\x1b[31m","Unknown command",'\x1b[0m');
  rl.prompt();
}).on("close", () => {
  console.log("Bye!");
  process.exit(0);
});

const Input = {
  title: async () => {
    const title = await question("Enter your title: ");
 
    for(let i in  readArr()){
      console.log(i);
      console.log(array[0][i]);
      console.dir(array[i]);
      if(title === array[0][i]){
       console.log("\x1b[31m","This title is already declared",'\x1b[0m');
       return Input.title();
      }
      else{
        add(title);
        add(",");
        return Input.desc();
      }
    }
    
  },
  desc: async () => {
    const desc = await question( "Enter your description: ");
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
    console.log("\x1b[32m", "was written",'\x1b[0m');
    return Input.end();
  },
  deletetitle: async () => {
    const del = await question( "Enter title which you want to delete: ");
    readArr();
    for (let i in array) {
      if (array[i][0] === del) {
        array[i].splice(0,1)
      }
    }
    let clearDate = content().split('\n').filter(function(line){ 
      return line.indexOf(`${del}` ) == -1;
    }).join('\n');
    fs.truncateSync( "notes.txt", 0, ()=>{});
    add(clearDate);
    return rl.prompt();
  },
  end: async () => {
    rl.prompt();
  },
};