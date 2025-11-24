import API from "./api";


export const getProductos = async () => {
const res = await API.get("/api/productos");
return res.data;
};