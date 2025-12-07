let tasksData = {}


let newTaskbtn = document.getElementById('newTask')
let addTask = document.getElementById('addTask')
let tasks = document.querySelectorAll(".task")
let cols = document.querySelectorAll(".col")
let todoCol = document.getElementById("todoCol")
let progressCol = document.getElementById("progressCol")
let doneCol = document.getElementById("doneCol")
let draggedTask = null;



function initalRender() {
    if (localStorage.getItem('tasksData')) {
        tasksData = JSON.parse(localStorage.getItem('tasksData'))

        cols.forEach((col) => {
            if (tasksData[col.id]) {

                tasksData[col.id].forEach((t) => {

                    let div = document.createElement("div")
                    div.setAttribute('draggable', true)
                    div.classList.add('task')

                    div.innerHTML = ` <div class="top">
                    <h4>${t.title}</h4>
                  <div>
                    <i class="ri-delete-bin-6-line"></i>
                    <i class="ri-pencil-line"></i>
                 </div>
                </div>

                <p>${t.desp}</p>
            `
                    col.appendChild(div)

                    div.addEventListener('dragstart', () => {
                        draggedTask = div;
                    })
                })


                col.querySelector('.count').textContent = tasksData[col.id].length


            }
        })
    }
}


initalRender();



tasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
        draggedTask = task;
        console.log(draggedTask);

    })
})



newTaskbtn.addEventListener('click', function () {
    document.getElementById('addTaskView').style.display = 'flex'
})



addTask.addEventListener('click', function () {

    let title = document.getElementById('taskTitle').value;
    let desp = document.getElementById('titleDesp').value;

    let div = document.createElement("div")
    div.setAttribute('draggable', true)
    div.classList.add('task')

    div.innerHTML = ` <div class="top">
                    <h4>${title}</h4>
                  <div>
                    <i class="ri-delete-bin-6-line"></i>
                    <i class="ri-pencil-line"></i>
                 </div>
                </div>

                <p>${desp}</p>
            `

    todoCol.appendChild(div)

    div.addEventListener('dragstart', () => {
        draggedTask = div;
    })

    // increase count 
    let count = todoCol.querySelector('.count')
    count.textContent = parseInt(count.textContent) + 1

    document.getElementById('addTaskView').style.display = 'none'


    // add new task in todoCol
    if (!tasksData.todoCol) {
        tasksData.todoCol = []
    }
    tasksData.todoCol.push({
        title: div.querySelector('h4').textContent,
        desp: div.querySelector('p').textContent
    })
    localStorage.setItem('tasksData', JSON.stringify(tasksData))
})




function col_drag_action(col) {

    col.addEventListener("dragenter", (e) => {
        col.classList.add("hover-over") // good practice to add allow to drop

    })

    col.addEventListener("dragleave", (e) => {
        col.classList.remove("hover-over")
    })



    col.addEventListener("dragover", (e) => {
        e.preventDefault();
        // Prevent the browser's default behavior (which is to block dropping).
        // this enable col zone, to accept the item , when item is dragover 

    })



    col.addEventListener("drop", (e) => {
        if (draggedTask) {
            col.appendChild(draggedTask)
        }

        col.classList.remove("hover-over")


        cols.forEach((col) => {
            let col_tasks = col.querySelectorAll('.task')
            col.querySelector('.count').textContent = col_tasks.length;


            tasksData[col.id] = Array.from(col_tasks).map((t) => {
                return {
                    title: t.querySelector('h4').textContent,
                    desp: t.querySelector('p').textContent
                }
            })

            localStorage.setItem('tasksData', JSON.stringify(tasksData));
        })

    })



}


cols.forEach((col) => {
    col_drag_action(col)
})


