const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const CSV_FILE = path.join(__dirname, 'to_do_list_personal.csv');
const CSV_HEADER = 'id,descripcion,estado,fecha\n';

// Crear CSV si no existe
if (!fs.existsSync(CSV_FILE)) {
    fs.writeFileSync(CSV_FILE, CSV_HEADER +
        '1,Tarea de IPO,No_hecha,sin fecha límite\n' +
        '2,Tarea de Sistemas,No_hecha,sin fecha límite\n'
    );
    console.log('✅ Archivo to_do_list_personal.csv creado.');
} else {
    console.log('📂 Usando to_do_list_personal.csv existente.');
}

// Leer CSV y devolver array de objetos
function leerCSV() {
    const contenido = fs.readFileSync(CSV_FILE, 'utf8');
    const lineas = contenido.trim().split('\n').slice(1); // saltar header
    return lineas
        .filter(l => l.trim() !== '')
        .map(linea => {
            const partes = linea.split(',');
            return {
                id: partes[0],
                descripcion: partes.slice(1, partes.length - 2).join(','), // por si hay comas en la descripcion
                estado: partes[partes.length - 2],
                fecha: partes[partes.length - 1]
            };
        });
}

// Guardar array de tareas en CSV
function guardarCSV(tareas) {
    const lineas = tareas.map(t => `${t.id},${t.descripcion},${t.estado},${t.fecha}`);
    fs.writeFileSync(CSV_FILE, CSV_HEADER + lineas.join('\n') + '\n');
}

// Tipos MIME para archivos estáticos
const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // ── API ──────────────────────────────────────────────
    if (url.pathname === '/api/tareas') {

        // GET — devolver todas las tareas
        if (req.method === 'GET') {
            const tareas = leerCSV();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(tareas));
        }

        // POST — añadir tarea
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const { descripcion, estado, fecha } = JSON.parse(body);
                const tareas = leerCSV();
                const maxId = tareas.reduce((m, t) => Math.max(m, parseInt(t.id) || 0), 0);
                const nueva = { id: String(maxId + 1), descripcion, estado, fecha };
                tareas.push(nueva);
                guardarCSV(tareas);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(nueva));
            });
            return;
        }

        // PUT — editar tarea
        if (req.method === 'PUT') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const { id, descripcion, estado, fecha } = JSON.parse(body);
                const tareas = leerCSV();
                const idx = tareas.findIndex(t => t.id === String(id));
                if (idx === -1) {
                    res.writeHead(404); return res.end('No encontrada');
                }
                tareas[idx] = { id: String(id), descripcion, estado, fecha };
                guardarCSV(tareas);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(tareas[idx]));
            });
            return;
        }

        // DELETE — eliminar tarea
        if (req.method === 'DELETE') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                const { id } = JSON.parse(body);
                let tareas = leerCSV();
                const antes = tareas.length;
                tareas = tareas.filter(t => t.id !== String(id));
                if (tareas.length === antes) {
                    res.writeHead(404); return res.end('No encontrada');
                }
                guardarCSV(tareas);
                res.writeHead(200);
                res.end('OK');
            });
            return;
        }
    }

    // ── Archivos estáticos ───────────────────────────────
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    filePath = path.join(__dirname, filePath);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('Archivo no encontrado');
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('   Abre esa URL en tu navegador.\n');
});