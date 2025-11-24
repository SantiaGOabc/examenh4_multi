const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

const CONTEXTO_TECHSOLUTIONS = `
Eres un asistente virtual experto en servicios tecnológicos.
Nombre de la Empresa: TechSolutions Bolivia.
Ubicación: Av. Tecnológica 456, Cochabamba, Bolivia.
Teléfono: +591 76543210.
Servicios: 
- Venta de equipos de computación (laptops, PCs, componentes)
- Reparación y mantenimiento de laptops y PCs
- Instalación de software y sistemas operativos
- Redes y cableado estructurado
- Consultoría en TI
- Desarrollo de software a medida
- Servicios de hosting y dominios
Horario: Lunes a Viernes de 8:00 a 19:00, Sábados de 9:00 a 14:00.
Información adicional:
Diagnóstico gratuito de equipos.
Reparación básica de laptops: desde 150 Bs.
Instalación de software: 80 Bs.
Asesoría en redes: 200 Bs.
Venta de laptops desde 2500 Bs.
Responde únicamente preguntas relacionadas con tecnología, computación, reparación, venta de equipos y servicios TI.
Si la pregunta no es relevante con nuestros servicios tecnológicos, responde amablemente que solo puedes ayudar con temas de tecnología y computación.
`;

// Middleware para analizar el cuerpo de las peticiones JSON
app.use(bodyParser.json());
// Middleware para habilitar CORS (permite peticiones desde diferentes dominios)
app.use(cors());

// Configuración de la conexión a la base de datos MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "doremifasollasiDo123.",
  database: "perros", // Cambia este nombre si quieres una BD específica para tech
  port: "3306",
};

const dbConnection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
dbConnection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos MySQL establecida");
});

app.post("/ollama-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const promptConContexto = `${CONTEXTO_TECHSOLUTIONS}\nPregunta: ${prompt}`;

    // Llamada a la API de Ollama (stream: true)
    const ollamaResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt: promptConContexto,
        stream: true,
      },
      { responseType: "stream" }
    );

    let result = "";
    ollamaResponse.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) result += json.response;
        } catch (e) {
          // Ignorar líneas que no sean JSON válidos
        }
      }
    });

    ollamaResponse.data.on("end", () => {
      res.json({ response: result.trim() });
    });

    ollamaResponse.data.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Servicios para contactos/registros
app.post("/api/registro", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Registro");
  console.log("Datos recibidos en el servidor como JSON:", req.body);

  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Nombre y email son campos requeridos." });
  }

  const query =
    "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)";
  dbConnection.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error("Error al insertar datos en la tabla:", error);
      return res
        .status(500)
        .json({ error: "Error al guardar los datos en la base de datos." });
    }

    res.status(201).json({
      message: "Datos guardados correctamente.",
      id: results.insertId,
    });
  });
});

app.post("/api/save", (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  console.log("Registro");
  console.log("Datos recibidos en el servidor como JSON:", req.body);

  if (!nombre || !correo) {
    return res
      .status(400)
      .json({ error: "Nombre y email son campos requeridos." });
  }

  const query =
    "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)";
  dbConnection.query(query, [nombre, correo, mensaje], (error, results) => {
    if (error) {
      console.error("Error al insertar datos en la tabla:", error);
      return res
        .status(500)
        .json({ error: "Error al guardar los datos en la base de datos." });
    }

    res.status(201).json({
      message: "Datos guardados correctamente.",
      id: results.insertId,
    });
  });
});

// Servicio para obtener productos (ahora serán productos tecnológicos)
app.get("/api/productos", (req, res) => {
  const query = "SELECT * FROM productos";
  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error al obtener datos de la tabla:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener los datos de la base de datos." });
    }

    res.status(200).json(results);
  });
});

// Servicios básicos
app.get("/", (req, res) => {
  res.send("¡Bienvenido a TechSolutions Bolivia - Backend API!");
});

app.get("/servicio", (req, res) => {
  res.send("Servicios de tecnología - TechSolutions Bolivia");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor TechSolutions escuchando en el puerto ${port}`);
});