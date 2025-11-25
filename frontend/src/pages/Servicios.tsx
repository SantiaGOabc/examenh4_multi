import React, { useState } from "react";
import { createNoticia } from "../services/NoticiasService";
import "./servicio.css"

export default function CrearNoticia() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rutaImagen = imagen ? `../../public/fotos/${imagen}.jpg` : undefined;

      const nuevaNoticia = rutaImagen
        ? { nombre, descripcion, imagen: rutaImagen }
        : { nombre, descripcion };
      const response = (await createNoticia(nuevaNoticia)) as { message: string };
      setMensaje(response.message);

      setNombre("");
      setDescripcion("");
      setImagen("");
    } catch (error) {
      setMensaje("Error al crear la noticia");
    }
  };

  return (
    <section className="page crear-noticia">
      <h2>Crear Noticia</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Imagen (nombre sin extensión):</label>
          <input
            type="text"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
        </div>
        <button type="submit">Guardar Noticia</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </section>
  );
}
