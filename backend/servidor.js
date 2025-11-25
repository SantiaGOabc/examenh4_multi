const http = require('http');
const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Bienvenido a VoxNews!\n');
});

server.listen(port, hostname, () => {
    console.log(`Servidor VoxNews corriendo en http://${hostname}:${port}/`);
});