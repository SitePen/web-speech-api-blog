import "./style.css";

const synth = window.speechSynthesis;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const list = document.getElementById("list");
const btn = document.getElementById("listen");
const btnCurrent = document.getElementById("current");
const btnComplete = document.getElementById("complete");

const recognition = new SpeechRecognition();

let doComplete = false;

recognition.addEventListener("result", (event) => {
  const result = event.results[0][0].transcript;
  if (doComplete) {
    const todo = findTodo(result);
    todo && completeTodo(todo);
  } else {
    const todo = createTodo(result);
    todo && list.appendChild(todo);
  }
  recognition.stop();
});

recognition.addEventListener("nomatch", (event) => {
  console.log("No match", event);
});

recognition.addEventListener("error", (event) => {
  console.log("Error", event);
});

btn.addEventListener("click", () => {
  doComplete = false;
  recognition.start();
});

btnCurrent.addEventListener("click", async () => {
  const todos = [...document.querySelectorAll("li")];
  for (const todo of todos) {
    await speakTodo(todo.innerText);
  }
});

btnComplete.addEventListener("click", () => {
  doComplete = true;
  recognition.start();
});

/**
 * @param {String} phrase
 */
async function speakTodo(phrase) {
  return new Promise((resolve) => {
    let utterance = new SpeechSynthesisUtterance(phrase);
    utterance.addEventListener("end", resolve);
    synth.speak(utterance);
  });
}

/**
 * @param {String} content
 * @returns HTMLUListElement | null
 */
function createTodo(content) {
  if (isDuplicate(content)) return;
  const todoElement = document.createElement("li");
  todoElement.innerText = content;
  todoElement.setAttribute("data-content", content);
  return todoElement;
}

/**
 *
 * @param {HTMLUListElement} todoElement
 */
function completeTodo(todoElement) {
  todoElement.classList.add("complete");
}

/**
 * @param {String} content
 * @returns HTMLUListElement
 */
function findTodo(content) {
  const todoElement = [...document.querySelectorAll("li")].find(
    (element) => element.innerText.toLowerCase() === content.toLowerCase()
  );
  return todoElement;
}

/**
 * @param {String} content
 * @returns Boolean
 */
function isDuplicate(content) {
  const count = [...document.querySelectorAll("li")].filter((element) => {
    return element.innerText === content;
  }).length;

  return count > 0;
}
