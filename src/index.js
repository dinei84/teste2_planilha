import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js"; // Importação de query e where

const firebaseConfig = {
    apiKey: "AIzaSyDcpggR7jf2BEPNLqRj1Iz368F0dDtD1-4",
    authDomain: "planilha-8938f.firebaseapp.com",
    projectId: "planilha-8938f",
    storageBucket: "planilha-8938f.firebasestorage.app",
    messagingSenderId: "211015132743",
    appId: "1:211015132743:web:45f443dc9e65b72fe37362"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const fretesCol = collection(db, "fretes");

// Função para buscar documentos pelo campo cidade_destino
async function getFretesByCidadeDestino(cidade) {
    try {
        // Cria uma query que filtra os documentos pelo campo cidade_destino
        const fretesQuery = query(fretesCol, where("cidade_destino", "==", cidade));
        const querySnapshot = await getDocs(fretesQuery);
        
        // Mapeia os documentos encontrados para uma lista
        const fretesList = querySnapshot.docs.map(doc => doc.data());
        return fretesList;
    } catch (error) {
        console.error("Erro ao buscar fretes por cidade_destino:", error);
        return [];
    }
}

// Exemplo de uso para buscar fretes pela cidade de destino
getFretesByCidadeDestino("PALMAS").then(fretes => {
    if (fretes.length > 0) {
        console.log("Fretes encontrados:", fretes);
    } else {
        console.log("Nenhum frete encontrado para essa cidade.");
    }
}).catch(error => {
    console.error("Erro ao buscar os fretes:", error);
});
