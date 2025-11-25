const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

const CONTEXTO_VOXNEWS = `
Eres VoxNews, medio informativo de Cochabamba, Bolivia. 
Slogan: "Trust us, your news".
Solo respondes sobre noticias, comunicación y periodismo.
Si el tema no es relacionado, redirige amablemente a temas informativos.
`;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Configuración de la base de datos
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "doremifasollasiDo123.",
  database: "voxnews",
  port: "3306",
};

const dbConnection = mysql.createConnection(dbConfig);

dbConnection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos MySQL establecida");
});

const obtenerDatosTabla = () => {
  return new Promise((resolve, reject) => {
    dbConnection.query("SELECT * FROM noticias", (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

app.post("/ollama-prompt", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Prompt recibido:", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const datosTabla = await obtenerDatosTabla();
    
    // Construir contexto con datos reales
    let contextoDatos = "Base de datos vacía";
    if (datosTabla.length > 0) {
      contextoDatos = "Noticias disponibles:\n";
      datosTabla.forEach((noticia, index) => {
        contextoDatos += `${index + 1}. ${noticia.nombre}: ${noticia.descripcion}\n`;
      });
    }

    const promptCompleto = `
${CONTEXTO_VOXNEWS}

INFORMACIÓN ACTUAL DE LA BASE DE DATOS:
${contextoDatos}

PREGUNTA DEL USUARIO: ${prompt}

INSTRUCCIONES: 
- Responde basándote en el contexto de VoxNews y la información de la base de datos
- Si la pregunta es sobre noticias, usa los datos reales de la tabla
- Si no hay datos relevantes, sugiere crear nuevo contenido
- Mantén el tono profesional periodístico
- Siempre incluye el slogan al final

RESPUESTA:
    `;

    const ollamaResponse = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt: promptCompleto,
        stream: false,
      }
    );

    res.json({ 
      response: ollamaResponse.data.response,
      datosConsultados: datosTabla.length
    });

  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: error.message 
    });
  }
});

app.get("/api/noticias", (req, res) => {
  dbConnection.query("SELECT * FROM noticias", (error, results) => {
    if (error) {
      console.error("Error al obtener noticias:", error);
      return res.status(500).json({ error: "Error al obtener noticias" });
    }
    res.status(200).json(results);
  });
});

app.post("/api/noticias", (req, res) => {
  const { nombre, descripcion, imagen } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ error: "Nombre y descripción son requeridos" });
  }

  const query = "INSERT INTO noticias (nombre, descripcion, imagen) VALUES (?, ?, ?)";
  dbConnection.query(query, [nombre, descripcion, imagen || null], (error, results) => {
    if (error) {
      console.error("Error al insertar noticia:", error);
      return res.status(500).json({ error: "Error al guardar la noticia" });
    }

    res.status(201).json({
      message: "Noticia creada exitosamente",
      noticiaId: results.insertId,
    });
  });
});

app.put("/api/noticias/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen } = req.body;

  const query = "UPDATE noticias SET nombre = ?, descripcion = ?, imagen = ? WHERE id = ?";
  dbConnection.query(query, [nombre, descripcion, imagen, id], (error, results) => {
    if (error) {
      console.error("Error al actualizar noticia:", error);
      return res.status(500).json({ error: "Error al actualizar noticia" });
    }

    res.json({ message: "Noticia actualizada exitosamente" });
  });
});

app.delete("/api/noticias/:id", (req, res) => {
  const { id } = req.params;

  dbConnection.query("DELETE FROM noticias WHERE id = ?", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar noticia:", error);
      return res.status(500).json({ error: "Error al eliminar noticia" });
    }

    res.json({ message: "Noticia eliminada exitosamente" });
  });
});

app.get("/", (req, res) => {
  res.send("¡Bienvenido a VoxNews - Backend API!");
});

app.get("/servicios", (req, res) => {
  res.send("Servicios de noticias - VoxNews");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});