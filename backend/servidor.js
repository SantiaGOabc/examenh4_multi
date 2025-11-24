const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Bienvenido a TechSolutions Bolivia!\n');
});

server.listen(port, hostname, () => {
    console.log(`Servidor TechSolutions corriendo en http://${hostname}:${port}/`);
});