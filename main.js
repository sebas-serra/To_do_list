const btnAdd = document.getElementById('add')
const btnDelete = document.getElementById('delete')
const btnEdit = document.getElementById('edit')
const activiades = document.getElementById('actividades')

btnAdd.addEventListener('click', () =>{
    let tarea = document.createElement("li");
    tarea.classList.add("act")
    tarea.innerText = "hola"
    tarea.dataset.estado = "No_hecha"
    activiades.appendChild(tarea);
})

activiades.addEventListener('click', (e) => {
    const el = e.target.closest(".act")
    if (!el) return
    el.dataset.estado = el.dataset.estado == "No_hecha" ? "hecha" : "No_hecha"
})


