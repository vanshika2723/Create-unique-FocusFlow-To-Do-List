// Store tasks in memory
let tasks = [];

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const taskCount = document.getElementById("taskCount");
const remainingText = document.getElementById("remainingText");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");


// Render tasks
function renderTasks() {

    taskList.innerHTML = "";

    // Empty state
    emptyMessage.style.display =
        tasks.length === 0 ? "block" : "none";


    // Create task elements
    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <button 
                class="complete-btn" 
                data-action="complete"
                data-index="${index}"
                aria-label="Complete task"
            >
                ✓
            </button>

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button 
                class="delete-btn"
                data-action="delete"
                data-index="${index}"
                aria-label="Delete task"
            >
                🗑
            </button>
        `;

        taskList.appendChild(li);
    });


    updateStats();
}


// Add task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}


// Update statistics
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const remaining = total - completed;

    const progress =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    taskCount.textContent = total;

    remainingText.textContent =
        `${remaining} ${remaining === 1 ? "remaining" : "remaining"}`;

    progressText.textContent = `${progress}%`;

    progressFill.style.width = `${progress}%`;
}


// Event: Add button
addTaskBtn.addEventListener("click", addTask);


// Event: Enter key
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Event Delegation
taskList.addEventListener("click", function (event) {

    const button = event.target.closest("button");

    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;


    // Complete task
    if (action === "complete") {

        tasks[index].completed =
            !tasks[index].completed;

        renderTasks();
    }


    // Delete task
    if (action === "delete") {

        tasks.splice(index, 1);

        renderTasks();
    }

});


// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// Initial render
renderTasks();