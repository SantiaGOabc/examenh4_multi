import API from "./api";

export const enviarContacto = async (data: { nombre: string; correo: string; mensaje: string }) => {
  const res = await API.post("/api/save", data);
  return res.data;
};