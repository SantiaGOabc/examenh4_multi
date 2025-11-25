import React, { useEffect, useState } from "react";
import { getNoticias } from "../services/NoticiasService";
import "./home.css"

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getNoticias();
        setNoticias(data as any[]);
      } catch {
        setNoticias([]);
      }
    })();
  }, []);

  return (
    <section className="page noticias-page">
      <h2>Noticias</h2>
      <div className="cards-container">
        {noticias.length ? (
          noticias.map((p) => (
            
            <div key={p.id_noticia} className="card">
              {p.imagen && (
                <img
                  src={p.imagen}
                  className="card-image"
                />
              )}
              <div className="card-body">
                <h3 className="card-title">{p.titulo}</h3>
                <p className="card-description">{p.descripcion}</p>
                <button className="card-button">Ver más</button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay noticias disponibles.</p>
        )}
      </div>
    </section>
  );
}
