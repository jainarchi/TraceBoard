let tasksData = {}


let newTaskbtn = document.getElementById('newTask')
let addTask = document.getElementById('addTask')
let tasks = document.querySelectorAll(".task")
let cols = document.querySelectorAll(".col")
let todoCol = document.getElementById("todoCol")
let progressCol = document.getElementById("progressCol")
let doneCol = document.getElementById("doneCol")
let draggedTask = null;
let taskBeingEdit = null ;

function updateColCount(){
    cols.forEach((col) =>{
        let tasks = col.querySelectorAll('.task');
        let count = col.querySelector('.count');

        count.textContent = tasks.length
    })
}

function makeTaskCard(title , desp , column){

       let div = document.createElement("div")
                    div.setAttribute('draggable', true)
                    div.classList.add('task')

                    div.innerHTML = ` <div class="top">
                    <h4>${title}</h4>

                  <div> 
                    <img class='delete-btn icon' src='./assets/system-solid-39.webp' title="Icon by Lordicon.com" alt="delete" />
                    <img class='edit-btn icon' src='./assets/edit-document-hover-pinch.webp' title="Icon by Lordicon.com" alt="edit" />

                 </div>
                </div>

                <p>${desp}</p>
             `

     column.appendChild(div)

     div.addEventListener('dragstart', () => {
        draggedTask = div;
    })

    

    div.querySelector('.delete-btn').addEventListener('click' , ()=>{
        div.remove()
        updateLocalStorage();
        updateColCount();

    })


    div.querySelector('.edit-btn').addEventListener('click' , ()=>{
        newTaskbtn.click()
        taskBeingEdit = div ;

        document.getElementById('taskTitle').value = div.querySelector('h4').textContent ;
        document.getElementById('titleDesp').value = div.querySelector('p').textContent ;


        addTask.textContent = 'Update Task'

    })

}

function updateLocalStorage(){

    cols.forEach((col) =>{
        let col_tasks = col.querySelectorAll('.task');

        tasksData[col.id] = Array.from(col_tasks).map((t) =>{
            return {
                title : t.querySelector('h4').textContent ,
                desp : t.querySelector('p').textContent

            }
        })
    })
    localStorage.setItem('tasksData' , JSON.stringify(tasksData));
}

function initalRender() {
    if (localStorage.getItem('tasksData')) {
        tasksData = JSON.parse(localStorage.getItem('tasksData'))

        cols.forEach((col) => {
            if (tasksData[col.id]) {

                tasksData[col.id].forEach((t) => {
                    makeTaskCard(t.title , t.desp , col)
                })

               updateColCount();

            }
        })
    }
}

initalRender();



newTaskbtn.addEventListener('click', function () {
    document.getElementById('addTaskView').style.display = 'flex'
})



addTask.addEventListener('click', function () {

    let title = document.getElementById('taskTitle').value.trim();
    let desp = document.getElementById('titleDesp').value.trim();


    if(title === '' || desp === ''){
        alert('Please enter both title & description.')
        return ;
    }


    if(taskBeingEdit){
        taskBeingEdit.querySelector('h4').textContent = title ; 
        taskBeingEdit.querySelector('p').textContent = desp ;
        taskBeingEdit = null ;
    }
     else{
        makeTaskCard(title , desp , todoCol)
        updateColCount();
    }
    

    updateLocalStorage();


    document.getElementById('addTaskView').style.display = 'none'
    document.getElementById('taskTitle').value = '';
    document.getElementById('titleDesp').value = '';

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

        updateLocalStorage();
        updateColCount();
    })
}


cols.forEach((col) => {
    col_drag_action(col)
})


