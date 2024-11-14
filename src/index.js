// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDcpggR7jf2BEPNLqRj1Iz368F0dDtD1-4",
    authDomain: "planilha-8938f.firebaseapp.com",
    projectId: "planilha-8938f",
    storageBucket: "planilha-8938f.firebasestorage.app",
    messagingSenderId: "211015132743",
    appId: "1:211015132743:web:45f443dc9e65b72fe37362"
};

// Inicializando Firebase e Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const fretesCol = collection(db, "fretes");

// Função CREATE - adiciona um novo frete
export async function createFrete(data) {
    try {
        const docRef = await addDoc(fretesCol, data);
        console.log("Frete criado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao criar frete:", error);
        return null;
    }
}

// Função READ - busca fretes por cidade_destino
export async function getFretesByCidadeDestino(cidade) {
    try {
        const fretesQuery = query(fretesCol, where("cidade_destino", "==", cidade));
        const querySnapshot = await getDocs(fretesQuery);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Erro ao buscar fretes por cidade_destino:", error);
        return [];
    }
}

// Função READ - busca frete por ID
export async function getFreteById(id) {
    try {
        const freteDocRef = doc(fretesCol, id);
        const freteDoc = await getDoc(freteDocRef);
        return freteDoc.exists() ? freteDoc.data() : null;
    } catch (error) {
        console.error("Erro ao buscar frete por ID:", error);
        return null;
    }
}

// Função UPDATE - atualiza um frete pelo ID
export async function updateFrete(id, data) {
    try {
        const freteDocRef = doc(fretesCol, id);
        await updateDoc(freteDocRef, data);
        console.log("Frete atualizado com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao atualizar frete:", error);
        return false;
    }
}

// Função DELETE - deleta um frete pelo ID
export async function deleteFrete(id) {
    try {
        const freteDocRef = doc(fretesCol, id);
        await deleteDoc(freteDocRef);
        console.log("Frete deletado com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao deletar frete:", error);
        return false;
    }
}


export { db };
export default firebaseApp;
export { fretesCol };
export { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where };