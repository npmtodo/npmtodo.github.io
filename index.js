const registerEl = document.querySelector("#Register");
const loginEl = document.querySelector("#Login");
const appEl = document.querySelector("#App");
const list = document.querySelector("#todo-list");
const todoInput = document.querySelector("#todo-input");
const usernameLogin = document.querySelector("#username-login");
const passwordLogin = document.querySelector("#password-login");
const usernameRegister = document.querySelector("#username-register");
const passwordRegister = document.querySelector("#password-register");

const credentials = {
    username: "",
    password: ""
};

const todos = [];

async function register() {
    try {
        console.log(await (await fetch(CONFIG.RPC_URL, {
            method: "POST",

            body: JSON.stringify({
                method: "register",
                params: {
                    username: usernameRegister.value,
                    password: passwordRegister.value
                }
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })).json());
        
        alert("Account registered!");
    } catch (e) {
        // Debug
        console.log(e);

        alert("An error occured when creating account!");
    }
}

async function login() {
    let storedTodos;
    
    try {
        storedTodos = (await (await fetch(CONFIG.RPC_URL, {
            method: "POST",

            body: JSON.stringify({
                method: "get_todos",
                params: {
                    username: usernameLogin.value,
                    password: passwordLogin.value
                }
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })).json()).payload.todos;
        
        alert("Logged in as " + usernameLogin.value + "!");
    } catch (e) {
        // Debug
        console.log(e);

        alert("An error occured when logging in.");

        return;
    }

    appEl.style.display = "initial";
    registerEl.style.display = "none";
    loginEl.style.display = "none";

    credentials.username = usernameLogin.value;
    credentials.password = passwordLogin.value;

    todos.splice(0, todos.length);
    todos.push(...storedTodos);

    for (const todoText of todos) {
        const newTodo = document.createElement("li");
        newTodo.innerText = todoText;

        list.append(newTodo);
    }
}

function addTodo() {
    if (credentials.username === "") {
        alert("You must log in first!");
        return;
    }

    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;

    todos.push(todoInput.value);
    list.append(newTodo);
}

async function saveTodo() {
    if (credentials.username === "") {
        alert("You must log in first!");
        return;
    }

    try {
        console.log(await (await fetch(CONFIG.RPC_URL, {
            method: "POST",

            body: JSON.stringify({
                method: "update_todos",
                params: {
                    username: credentials.username,
                    password: credentials.password,
                    todos
                }
            }),

            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })).json());

        alert("Todos saved!");
    } catch (e) {
        // Debug
        console.log(e);

        alert("An error occured when saving!");
    }
}
