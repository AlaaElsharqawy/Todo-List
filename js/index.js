const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const loadingScreen = document.querySelector(".loading");
const list = document.querySelector(".task-list");
const apiKey = "6759649060a208ee1fdde82c";
let allTodos = [];

getAllTodos();

formElement.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

async function addTodo() {
  showLoading();
  //create object
  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };

  const objConfigurations = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "content-type": "application/json",
    },
  };
  //call api and send object
  let response = await fetch(
    "https://todos.routemisr.com/api/v1/todos",
    objConfigurations
  );

  if (response.ok) {
    let data = await response.json(); //BE send {message:"success"}

    if (data.message === "success") {
      toastr.success("Task Added Successfully");
      await getAllTodos();

      formElement.reset();
    } else {
      toastr.error("Task is empty");
    }
  }

  hideLoading();
}

async function getAllTodos() {
  showLoading();
  let response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  if (response.ok) {
    let data = await response.json();

    if (data.message) {
      allTodos = data.todos;
      displayData();

      console.log(allTodos);
    }
  }
  hideLoading();
}

function displayData() {
  let cartona = "";
  for (const todo of allTodos) {
    cartona += `
          <li class="d-flex  justify-content-between align-items-center border-bottom py-3">
     

              <span onclick=" markCompleted('${todo._id}')" style="${
      todo.completed ? "text-decoration: line-through;" : ""
    }" class="task-name fs-5">${todo.title}</span>

              <div class="icons d-flex gap-3">
                 ${
                   todo.completed
                     ? ' <i class="fa-regular fa-circle-check fs-5" ></i>'
                     : ""
                 }
                  <i onclick=" deleteTodo('${
                    todo._id
                  }')" class="fa-solid fa-trash text-danger fs-5" ></i>
              </div>
          </li>
        `;
  }

  if (cartona.length > 0) {
    list.classList.remove("d-none");
    document.querySelector(".task-list").innerHTML = cartona;
    changeProgress();
  } else {
    list.classList.add("d-none");
  }
}

async function deleteTodo(id) {
  Swal.fire({
    title: "Are you sure Delete?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      //code delete
      let removeTodo = {
        todoId: id,
      };
      const objConfigurations = {
        method: "DELETE",
        body: JSON.stringify(removeTodo),
        headers: {
          "content-type": "application/json",
        },
      };

      let response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        objConfigurations
      );

      if (response.ok) {
        let data = await response.json();

        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your todo has been deleted.",
            icon: "success",
          });
          await getAllTodos();
          console.log(data);
        }
      }
      hideLoading();
    }
  });
}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure complete?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "green",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      let Todo = {
        todoId: id,
      };
      const objConfigurations = {
        method: "PUT",
        body: JSON.stringify(Todo),
        headers: {
          "content-type": "application/json",
        },
      };

      let response = await fetch(
        "https://todos.routemisr.com/api/v1/todos",
        objConfigurations
      );

      if (response.ok) {
        let data = await response.json();

        if (data.message === "success") {
          Swal.fire({
            title: "Completed!",
            text: "Your todo has been completed.",
            icon: "success",
          });
          await getAllTodos();
          console.log(data);
        }
      }

      hideLoading();
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {
  const completedTask = allTodos.filter((todo) => todo.completed).length;
  const totalTask = allTodos.length;

  document.getElementById("progress").style.width = `
  ${(completedTask / totalTask) * 100}%`;
  const statusNumber = document.querySelectorAll(".status-number span");
  statusNumber[0].innerHTML = completedTask;
  statusNumber[1].innerHTML = totalTask;
}
