import API from "./api";


export const enviarPromptOllama = async (prompt: string) => {
const res = await API.post("/ollama-prompt", { prompt });
return res.data;
};