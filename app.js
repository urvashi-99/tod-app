const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = [];
let currentFilter = "all";

let todosString = localStorage.getItem("todos");
if (todosString) {
  todos = JSON.parse(todosString);
}

const populateTodos = () => {
  let filteredTodos = todos;
  if (currentFilter === "active") {
    filteredTodos = todos.filter((todo) => !todo.isCompleted);
  } else if (currentFilter === "completed") {
    filteredTodos = todos.filter((todo) => todo.isCompleted);
  }
  
  let string = "";
  for (const todo of filteredTodos) {
    string += `
      <li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
        <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
        <span class="todo-text">${todo.title}</span>
        <button class="delete-btn">×</button>
      </li>
    `;
  }
  todoListUl.innerHTML = string;
  
  remaining.innerHTML = todos.filter((item) => !item.isCompleted).length;
  
  let deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((element) => {
    element.addEventListener("click", (e) => {
      const confirmation = confirm("Do you really want to delete?");
      if (confirmation) {
        todos = todos.filter((todo) => todo.id !== e.target.parentNode.id);
        localStorage.setItem("todos", JSON.stringify(todos));
        populateTodos();
      }
    });
  });
  
  let todoCheckboxes = document.querySelectorAll(".todo-checkbox");
  todoCheckboxes.forEach((element) => {
    element.addEventListener("click", (e) => {
      todos = todos.map((todo) =>
        todo.id === element.parentNode.id ?
        { ...todo, isCompleted: e.target.checked } :
        todo
      );
      localStorage.setItem("todos", JSON.stringify(todos));
      populateTodos();
    });
  });
  
  const hasCompleted = todos.some((todo) => todo.isCompleted);
  clearCompletedBtn.style.display = hasCompleted ? "inline-block" : "none";
};

addTodoBtn.addEventListener("click", () => {
  let todoText = inputTag.value.trim();
  if (todoText.length < 4) {
    alert("You can't add a todo that small");
    return;
  }
  inputTag.value = "";
  let todo = {
    id: "todo-" + Date.now(),
    title: todoText,
    isCompleted: false,
  };
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  populateTodos();
});

clearCompletedBtn.addEventListener("click", () => {
  const confirmation = confirm("Remove all completed todos?");
  if (confirmation) {
    todos = todos.filter((todo) => !todo.isCompleted);
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    populateTodos();
  });
});

populateTodos();
let todoCheckboxes = document.querySelectorAll(".todo-checkbox");
todoCheckboxes.forEach((element) => {
  element.addEventListener("click", (e) => {
    todos = todos.map((todo) =>
      todo.id === element.parentNode.id
        ? { ...todo, isCompleted: e.target.checked }
        : todo
    );
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
  });
});