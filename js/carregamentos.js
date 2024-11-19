import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../src/index.js";

// Adicionar carregamento à subcoleção
async function addCarregamento(freteId, carregamentoData) {
    try {
        const carregamentosCol = collection(db, `fretes/${freteId}/carregamentos`);
        const docRef = await addDoc(carregamentosCol, carregamentoData);
        console.log("Carregamento adicionado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar carregamento:", error);
        return null;
    }
}
