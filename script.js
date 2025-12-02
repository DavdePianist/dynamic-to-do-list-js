// Wait for the HTML document to fully load
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn'); // Add Task button
    const taskInput = document.getElementById('task-input');   // Input field
    const taskList = document.getElementById('task-list');     // UL element

    // Load tasks from Local Storage and render them
    function loadTasks() {
        // Read stored tasks (array of strings) or default to empty array
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // For each stored task, create a DOM item but do NOT save it again
        storedTasks.forEach(taskText => addTask(taskText, false));
    }

    // Save the provided array of tasks to Local Storage
    function saveTasksArray(tasksArray) {
        localStorage.setItem('tasks', JSON.stringify(tasksArray));
    }

    // Get the current tasks array from Local Storage
    function getStoredTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    }

    /**
     * Add a task to the DOM and optionally save it to Local Storage.
     * @param {string|null} providedText - If provided, adds this text as the task. If null, reads from input.
     * @param {boolean} save - Whether to save the task to Local Storage. Default true.
     */
    function addTask(providedText = null, save = true) {

        // Determine task text (either from parameter or input)
        let taskText = (providedText !== null) ? String(providedText).trim() : taskInput.value.trim();

        // If input (or provided text) is empty, alert the user and return
        if (taskText === "") {
            if (providedText === null) { // only alert if user attempted to add via UI
                alert("Please enter a task.");
            }
            return;
        }

        // Create the li element and content span
        const li = document.createElement('li');
        li.classList.add('task-item'); // using classList.add()
        li.dataset.task = taskText; // store raw task text for reliable removal

        const span = document.createElement('span');
        span.textContent = taskText;

        // Create the Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.classList.add('remove-btn'); // using classList.add()

        // Assign click event to remove button
        removeBtn.onclick = function () {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove from Local Storage array
            const storedTasks = getStoredTasks();
            // Remove the first occurrence of the matching task text
            const index = storedTasks.indexOf(taskText);
            if (index !== -1) {
                storedTasks.splice(index, 1);
                saveTasksArray(storedTasks);
            }
        };

        // Append elements: span (text) + remove button into li, then li into list
        li.appendChild(span);
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If requested, save the new task into Local Storage
        if (save) {
            const storedTasks = getStoredTasks();
            storedTasks.push(taskText);
            saveTasksArray(storedTasks);
        }

        // Clear the input field if the task was added from UI input
        if (providedText === null) {
            taskInput.value = "";
        }
    }

    // Event listener for Add Task button
    addButton.addEventListener('click', function () {
        addTask(); // reads from input and saves
    });

    // Event listener for pressing Enter key in the input field
    taskInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addTask(); // reads from input and saves
        }
    });

    // Load tasks from Local Storage when page loads
    loadTasks();
});
