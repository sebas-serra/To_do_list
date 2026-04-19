const btnAdd = document.getElementById('add');
const btnDelete = document.getElementById('delete');
const btnEdit = document.getElementById('edit');
const actividades = document.getElementById('actividades');

const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalConfirm = document.getElementById('modal-confirm');
const modalCancel = document.getElementById('modal-cancel');
const fechaSeleccionada = document.getElementById('fecha-seleccionada');
const calendario = document.getElementById('calendario');
const calMonthYear = document.getElementById('cal-month-year');
const calPrev = document.getElementById('cal-prev');
const calNext = document.getElementById('cal-next');

let contadorId = 3;
let calYear, calMonth, selectedDate = null;
let modalMode = 'add'; 
let editTarget = null;

// ── Calendar ──────────────────────────────────────────────
function initCal() {
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    selectedDate = null;
    fechaSeleccionada.textContent = 'Sin fecha límite seleccionada';
    renderCal();
}

function renderCal() {
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    calMonthYear.textContent = `${meses[calMonth]} ${calYear}`;

    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const today = new Date();

    let html = '<div class="cal-grid">';
    const dias = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
    dias.forEach(d => { html += `<div class="cal-cell cal-header-cell">${d}</div>`; });

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-cell cal-empty"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${d.toString().padStart(2,'0')}/${(calMonth+1).toString().padStart(2,'0')}/${calYear}`;
        const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
        const isSelected = selectedDate === dateStr;
        let cls = 'cal-cell cal-day';
        if (isToday) cls += ' cal-today';
        if (isSelected) cls += ' cal-selected';
        html += `<div class="${cls}" data-date="${dateStr}">${d}</div>`;
    }

    html += '</div>';
    calendario.innerHTML = html;

    calendario.querySelectorAll('.cal-day').forEach(cell => {
        cell.addEventListener('click', () => {
            selectedDate = cell.dataset.date;
            fechaSeleccionada.textContent = `📅 ${selectedDate}`;
            renderCal();
        });
    });
}

calPrev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCal();
});

calNext.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCal();
});

// ── Modal helpers ─────────────────────────────────────────
function openModal(title, defaultDesc = '', mode = 'add', target = null) {
    modalTitle.textContent = title;
    modalDesc.value = defaultDesc;
    modalMode = mode;
    editTarget = target;
    initCal();
    modalOverlay.classList.remove('hidden');
    modalDesc.focus();
}

function closeModal() {
    modalOverlay.classList.add('hidden');
    selectedDate = null;
}

modalCancel.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// ── Confirm ───────────────────────────────────────────────
modalConfirm.addEventListener('click', () => {
    const desc = modalDesc.value.trim();
    if (!desc) { modalDesc.focus(); return; }
    const fecha = selectedDate || 'sin fecha límite';

    if (modalMode === 'add') {
        const tarea = document.createElement('li');
        tarea.classList.add('act');
        tarea.id = contadorId++;
        tarea.dataset.estado = 'No_hecha';
        tarea.innerHTML = `
            <span class="tarea-texto">${desc}</span>
            <span class="tarea-fecha">${fecha}</span>
        `;
        actividades.appendChild(tarea);
    } else if (modalMode === 'edit' && editTarget) {
        editTarget.querySelector('.tarea-texto').textContent = desc;
        editTarget.querySelector('.tarea-fecha').textContent = fecha;
    }

    closeModal();
});

// ── Buttons ───────────────────────────────────────────────
btnAdd.addEventListener('click', () => {
    openModal('Nueva tarea', '', 'add');
});

btnDelete.addEventListener('click', () => {
    const id = prompt('Ingresa el ID de la tarea a eliminar:');
    const tarea = document.getElementById(id);
    if (tarea) {
        tarea.remove();
    } else {
        alert('No se encontró ninguna tarea con ese ID.');
    }
});

btnEdit.addEventListener('click', () => {
    const id = prompt('Ingresa el ID de la tarea a editar:');
    const tarea = document.getElementById(id);
    if (tarea) {
        const desc = tarea.querySelector('.tarea-texto').textContent;
        openModal('Editar tarea', desc, 'edit', tarea);
    } else {
        alert('No se encontró ninguna tarea con ese ID.');
    }
});

// ── Toggle estado ─────────────────────────────────────────
actividades.addEventListener('click', (e) => {
    const el = e.target.closest('.act');
    if (!el) return;
    el.dataset.estado = el.dataset.estado === 'No_hecha' ? 'hecha' : 'No_hecha';
});