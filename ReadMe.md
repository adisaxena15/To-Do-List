## Concept Clarifications

1. `.querySelector()`:  
   Returns the first element within the document that matches the specified selector or group of selectors.
2. `EventListener()`:  
    allow you to execute a function when a specific event occurs.
    `document.getElementById('myButton').addEventListener('click', function() {      
    alert('Button was clicked!');
});`  
This means that when button is clicked, there is an alert displayed when the following function is executed.

3. `.length`:  
   some functions return a NodeList of elements whose number we can access through .length.

4. `.insertAdjacentHTML('beforeend', newTaskHTML)`  
   allows you to INSERT text into the element specified without replacing what's already there. `beforebegin, afterbegin, beforeend, afterend` allows to insert the text accordingly.

5. `forEach`:  
   provides an index and a key for our usage. 

6. `element.closest(selector)`:  
   returns the closest ancestor of the current element (or the current element itself) that matches the selector. It will travel upward the element div tree until it finds a selector class. 

7. `.remove(element)`:  
   removes that element from the dorm

## Explanation of Functions
### Function updateTaskCounter()
This function updates the number of tasks updated for each card. 
1. `const completedTasks = card.querySelectorAll('.task.completed').length;`
selects all the tasks that have been completed and displays it by updating the inner text of class .taskcounter (using variable `counterElement`).

### Function addTask()
1. first it checks whether there is any input in the input part for it to create a new task  
    ```
    if (card.querySelector('.newtask input').value.length === 0) {
        alert("Please Enter a Task");}
    ```

2. Else, it will display the white block for tasks and also enables the numebering system for each task.

3. Then, a new dynamic file of HTML is inserted to the tasks class div. 

4. `const newTask = card.querySelector('.tasks').lastElementChild;`   
   This property gets the last child element within the selected tasks container. In this context, it will be the most recently added task element.

5. `card.querySelector('.newtask input').value = ""`  
   The input value of the new task text is reset after each input. 

6. the updateTaskNumbers is called if numbering is enabled.

### Function updateTaskNUmbers()
1. Since we do a `querySelectorAll()` for the task, we get a NodeList of all the task elements in a specific card. 
2. for each of those, we pass the task and its index into the function 
3. We have a class called task-number which displays the taskNumber in the HTML file. we select that and store that into the `number` variable.
4. if numbering is enabled, we display `number` using index+1. This is because index for first task starts at zero.  
   ``` 
    tasks.forEach((task, index) => {   
         const number = task.querySelector('.task-number');   
     });
    ```

### Function resetCount(button): to uncheck a task
1. we get the card class from travelling upward button using `button.closest('.card')`
2. completedTasks has a NodeList of all the tasks completed using `querySelectorAll`
```
completedTasks.forEach(task => {
        task.classList.remove('completed');
        task.querySelector('input[type="checkbox"]').checked = false;
        task.querySelector('.delete').style.display = 'none';
    });
```
3. it removes the visually-striking effect from a task. Finds the checkbox within the task and unchecks it. 
4. Then it hides the delete button and updates the **counter** by sending a newly updated card with a reduced task. 

### Function deleteTask(button): to delete a task

1. removes the task by getting button's `.parentElement`.
2. also gets the card variable by `.closest`
```
if (card.querySelectorAll('.task').length === 0) {
        card.querySelector('.tasks').style.display = 'none';
}
```
1. If there are no more tasks in the `NodeList`, then we should hide the white box.

2. if numbering is enabled, we should update the **numbering** by sending a newly updated card with a deleted task

### Function deleteCard(button)
1. if the delete button is pressed, this function gets activated. 
2. it gets the card from using `button.closest('.card.)` and removes it

### Function addCard()
1. inserts a new HTML text into the #cardContainer. 
```
    const cardContainer = document.getElementById('cards-container');
    cardContainer.insertAdjacentHTML('beforeend', cardHTML);
```
2. Gets a newCard using this code because the lastElementChild is the newest card added into the card-container
```
const newCard = cardContainer.lastElementChild;
```
3. This is the most important line. It allows new cards to be made. Everytime the button with id="add-card" is pressed, it calls the add card function.
```
document.getElementById('add-card').onclick = addCard;
``` 

## Drag-Drop Functionality
There are event-listeners such as `dragstart, dragover, dragend, drop`. In the `addTask()` function, whenever one of these are done on the NewTask class, it will call the following functions.  
Initially, a variable `draggedTask` is set to null. This variable is used to specify which function is being done.

### Function handleDragStart()
1. `draggedTask = this`: Sets the draggedTask to the task that is being dragged.
```
setTimeout(() => {
        this.classList.add('dragging');
    }, 0);
```
2. Adds the dragging class to the task after a short delay. This class can be used to style the dragging task differently.

### Function handleDragOver()
![alt text](image.png)

### Function handleDrop() & Function handleDragEnd()
1. `this.classList.remove('dragging')`: removes the dragging class from the task class, which is specified by `this`.
2. we then get the card and update the Task numbers by `updateTaskNumbers(card)`.