import API from "./api";

export const getNoticias = async () => {
  const res = await API.get("/api/noticias");
  return res.data;
};

export const createNoticia = async (noticia: {
  nombre: string;
  descripcion: string;
  imagen?: string;
}) => {
  const res = await API.post("/api/noticias", noticia);
  return res.data;
};
