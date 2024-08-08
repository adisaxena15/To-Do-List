let completedTaskCount = 0;
let numberingEnabled = false;

function updateTaskCounter(card) {
    const counterElement = card.querySelector('.task-counter');
    const completedTasks = card.querySelectorAll('.task.completed').length;
    counterElement.textContent = `Tasks completed today: ${completedTasks}`;
}
function updateTaskNumbers(card) {
    const tasks = card.querySelectorAll('.task');
    tasks.forEach((task, index) => {
        const number = task.querySelector('.task-number');
        if (numberingEnabled) {
            number.textContent = (index + 1) + '.';
        } else {
            number.textContent = '';
        }
    });
}

function toggleNumbering(button) {
    numberingEnabled = !numberingEnabled;
    const card = button.closest('.card');
    updateTaskNumbers(card);
}

function resetCount(button) {
    const card = button.closest('.card');
    const completedTasks = card.querySelectorAll('.task.completed');
    completedTasks.forEach(task => {
        task.classList.remove('completed');
        task.querySelector('input[type="checkbox"]').checked = false;
        task.querySelector('.delete').style.display = 'none';
    });
    updateTaskCounter(card);
}

function deleteTask(button) {
    const task = button.parentElement;
    const card = task.closest('.card');
    task.remove();
    if (card.querySelectorAll('.task').length === 0) {
        card.querySelector('.tasks').style.display = 'none';
    }
    if (numberingEnabled) updateTaskNumbers(card);
}


function deleteCard(button){
    const card = button.closest('.card');
    card.remove();
}

function addTask(card) {
    if (card.querySelector('.newtask input').value.length === 0) {
        alert("Please Enter a Task");
    } else {
        card.querySelector('.tasks').style.display = 'block';

        const taskNumber = numberingEnabled ? (card.querySelectorAll('.task').length + 1) + '.' : '';

        const newTaskHTML = `
           <div class="task" draggable="true">
                <span class="task-number">${taskNumber}</span>
                <span class="taskname" contenteditable="true">
                    ${card.querySelector('.newtask input').value}
                </span>
                <label class="check-container">
                    <input type="checkbox" onclick="toggleComplete(this)">
                    <div class="checkmark"></div>
                </label>
                <button class="delete" onclick="deleteTask(this)">
                    <i class="far fa-trash-alt"></i>
                </button>
                <div class="description-box">.</div>
            </div>    
        `;

        card.querySelector('.tasks').insertAdjacentHTML('beforeend', newTaskHTML);

        const newTask = card.querySelector('.tasks').lastElementChild;

        newTask.addEventListener('dragstart', handleDragStart);
        newTask.addEventListener('dragover', handleDragOver);
        newTask.addEventListener('drop', handleDrop);
        newTask.addEventListener('dragend', handleDragEnd);

        
        card.querySelector('.newtask input').value = "";

        if (numberingEnabled) updateTaskNumbers(card);
 
    }
}

function toggleComplete(checkbox) {
    const task = checkbox.parentElement.parentElement;
    const card = task.closest('.card');
    task.classList.toggle('completed');

    const deleteButton = task.querySelector('.delete');
    const checkContainer = checkbox.parentElement;

    if (checkbox.checked) {
        checkContainer.style.marginLeft = '-50px';
        deleteButton.style.display = 'block';

        setTimeout(() => {
            deleteButton.style.opacity = '1';
            deleteButton.style.transform = 'translateX(0)';
        }, 100);
    } else {
        checkContainer.style.marginLeft = '0';
        deleteButton.style.opacity = '0';
        deleteButton.style.transform = 'translateX(20px)';

        setTimeout(() => {
            deleteButton.style.display = 'none';
        }, 300);
    }

    updateTaskCounter(card);
}

function addCard() {
    const cardHTML = `
        <div class="card">
            <div class="header" contenteditable="true">To Do List</div>
            <button class="delete-card" onclick="deleteCard(this)"><i class="fa-regular fa-circle-xmark"></i></button>
            <button class="toggle-numbering" onclick="toggleNumbering(this)">Toggle Numbering</button>
            <button class="reset-count" onclick="resetCount(this)">Reset</button>
            <div class="task-counter">Tasks completed today: 0</div>
            <div class="newtask">
                <input type="text" placeholder="Enter your Task Here...">
                <button onclick="addTask(this.closest('.card'))"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="tasks" style="display: none;"></div>
        </div>
    `;
    const cardContainer = document.getElementById('cards-container');
    cardContainer.insertAdjacentHTML('beforeend', cardHTML);

    // Add event listener for enter key on the input field in the new card
    const newCard = cardContainer.lastElementChild;
    newCard.querySelector('.newtask input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask(newCard);
        }
    });
}

document.getElementById('add-card').onclick = addCard;


let draggedTask = null;
function handleDragStart(event) {
    draggedTask = this;
    setTimeout(() => {
        this.classList.add('dragging');
    }, 0);
}

function handleDragOver(event) {
    event.preventDefault();
    const taskContainer = this.closest('.tasks');
    const afterElement = getDragAfterElement(taskContainer, event.clientY);
    if (afterElement == null) {
        taskContainer.appendChild(draggedTask);
    } else {
        taskContainer.insertBefore(draggedTask, afterElement);
    }
}

function handleDrop() {
    this.classList.remove('dragging');
    const card = this.closest('.card');
    updateTaskNumbers(card); // Update task numbers after drop
}

function handleDragEnd() {
    this.classList.remove('dragging');
    const card = this.closest('.card');
    updateTaskNumbers(card); // Update task numbers after drag end
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}