import React, { useEffect, useState } from "react";
import { getProductos } from "../services/productosService";
import Card from "../components/Card";


export default function Servicios() {
const [productos, setProductos] = useState<any[]>([]);


useEffect(() => {
(async () => {
try {
const data = await getProductos();
setProductos(data as any[]);
} catch {
setProductos([]);
}
})();
}, []);


return (
<section className="page services-page">
<h2>Servicios y Productos</h2>
<div className="cards">
{productos.length ? (
productos.map((p) => (
<Card key={p.id_producto} title={p.nombre} description={p.descripcion} price={p.precio} />
))
) : (
<p>No hay productos disponibles.</p>
)}
</div>
</section>
);
}