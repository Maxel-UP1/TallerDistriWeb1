const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("view"));

let productos = []; // Lista de productos

// Obtener productos
app.get("/productos", (req, res) => {
    res.json(productos);
});

// Agregar un nuevo producto
app.post("/productos", (req, res) => {
    const nuevoProducto = req.body;
    productos.push(nuevoProducto);

    io.emit("productos", productos); // Enviar la lista actualizada a todos
    res.json({ mensaje: "Producto agregado", producto: nuevoProducto });
});

// Eliminar producto
app.delete("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    productos.splice(index, 1); // Eliminar producto
    io.emit("productos", productos); // Enviar lista actualizada

    res.json({ mensaje: "Producto eliminado" });
});

// Actualizar producto
app.put("/productos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    productos[index] = { ...productos[index], ...req.body }; // Actualizar datos
    io.emit("productos", productos); // Enviar lista actualizada

    res.json({ mensaje: "Producto actualizado", producto: productos[index] });
});

// WebSockets
io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");
    socket.emit("productos", productos); // Enviar lista actualizada
});

// Iniciar servidor
const PORT = 5000;
const HOST = "0.0.0.0"; // Acepta conexiones externas

server.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

//const PORT = 5000;
//server.listen(PORT, () => {
   // console.log(`Servidor corriendo en http://localhost:${PORT}`);
//});
