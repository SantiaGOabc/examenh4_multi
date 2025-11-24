import React, { useState } from "react";
import { enviarContacto } from "../services/contactoService";
import "./contacto.css"

export default function Contacto() {
const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
const [status, setStatus] = useState<string | null>(null);


const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setStatus(null);
try {
await enviarContacto(form);
setStatus("ok");
setForm({ nombre: "", correo: "", mensaje: "" });
} catch (err) {
setStatus("error");
}
};


return (
<section className="page contact-page">
<h2>Contacto</h2>
<form className="contact-card" onSubmit={handleSubmit}>
<div className="row">
<input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
<input required type="email" placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
</div>
<textarea required placeholder="Mensaje" value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })} />
<button type="submit" className="btn-primary">Enviar mensaje</button>
{status === "ok" && <p className="success">Mensaje enviado correctamente.</p>}
{status === "error" && <p className="error">Error al enviar. Intenta nuevamente.</p>}
</form>
</section>
);
}