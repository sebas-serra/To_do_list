const btnAdd = document.getElementById('add')
const btnDelete = document.getElementById('delete')
const btnEdit = document.getElementById('edit')
const activiades = document.getElementById('actividades')

let contadorId = 3;

btnAdd.addEventListener('click', () =>{
    let tarea = document.createElement("li");
    tarea.classList.add("act")
    tarea.id = contadorId++;
    tarea.innerText = prompt("Ingresa una descripcion de la tarea:");
    tarea.dataset.estado = "No_hecha"
    activiades.appendChild(tarea);
})

btnDelete.addEventListener('click', () =>{
    
    let id = prompt("Ingresa el ID de la tarea a eliminar:");
    let tarea = document.getElementById(id);
    if (tarea) {
        tarea.remove();
    } else {
        alert("No se encontró ninguna tarea con ese ID.");
    }
})



btnEdit.addEventListener('click', () =>{
    
    let id = prompt("Ingresa el ID de la tarea a editar:");
    let tarea = document.getElementById(id);
    if (tarea) {
        tarea.innerText = prompt("Ingrese la descripcion nueva")
    } else {
        alert("No se encontró ninguna tarea con ese ID.");
    }
})

activiades.addEventListener('click', (e) => {
    const el = e.target.closest(".act")
    if (!el) return
    el.dataset.estado = el.dataset.estado == "No_hecha" ? "hecha" : "No_hecha"
})


