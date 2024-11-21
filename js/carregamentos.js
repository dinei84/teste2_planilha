import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/index.js";

// Adicionar carregamento à subcoleção
async function addCarregamento(freteId, carregamentoData) {
    try {
        console.log("Frete ID:", freteId);
        console.log("Dados do Carregamento:", carregamentoData);

        const carregamentosCol = collection(db, `fretes/${freteId}/carregamentos`);
        const docRef = await addDoc(carregamentosCol, carregamentoData);
        
        console.log("Carregamento adicionado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar carregamento:", error.message);
        return null;
    }
}