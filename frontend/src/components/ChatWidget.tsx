import "./Chat.css"
import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import { enviarPromptOllama } from "../services/ollamaService";
type Message = { from: "user" | "bot"; text: string };


export default function ChatWidget() {
const [open, setOpen] = useState(false);
const [input, setInput] = useState("");
const [messages, setMessages] = useState<Message[]>([]);
const [loading, setLoading] = useState(false);


const send = async () => {
if (!input.trim()) return;
const userMsg: Message = { from: "user", text: input };
setMessages((m) => [...m, userMsg]);
setInput("");
setLoading(true);
try {
const res = await enviarPromptOllama(input);
let botText = "(sin respuesta)";
if (res && typeof res === "object" && "response" in res && typeof (res as any).response === "string") {
const responseStr = (res as any).response;
botText = responseStr || "(sin respuesta)";
} else if (typeof res === "string") {
botText = res;
} else {
try {
botText = JSON.stringify(res);
} catch {
botText = "(sin respuesta)";
}
}
setMessages((m) => [...m, { from: "bot", text: botText }]);
} catch (e) {
setMessages((m) => [...m, { from: "bot", text: "Error al contactar al servidor." }]);
} finally {
setLoading(false);
}
};


return (
<div className="chat-widget">
{open && (
<div className="chat-panel">
<div className="chat-header">Asistente Virtual</div>
<div className="chat-messages">
{messages.map((msg, i) => (
<div key={i} className={`chat-message ${msg.from}`}>
{msg.text}
</div>
))}
{loading && <div className="chat-message bot">Escribiendo...</div>}
</div>
<div className="chat-controls">
<input
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Escribe tu pregunta sobre tu mascota..."
onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
/>
<button onClick={send}>Enviar</button>
</div>
</div>
)}


<button className="chat-bubble" onClick={() => setOpen((o) => !o)} aria-label="Abrir chat">
<FaComments />
</button>
</div>
);
}