// index.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";


export const firebaseConfig = {
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

// Criar um novo frete
export async function createFrete(freteData) {
    try {
        const docRef = await addDoc(collection(db, "fretes"), freteData);
        console.log("Frete criado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao criar frete:", error);
        return null;
    }
}

// Listar todos os fretes
export async function getFretes() {
    try {
        const querySnapshot = await getDocs(collection(db, "fretes"));
        const fretes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return fretes;
    } catch (error) {
        console.error("Erro ao listar fretes:", error);
        return [];
    }
}

// Atualizar um frete
export async function updateFrete(freteId, updatedData) {
    try {
        const freteRef = doc(db, "fretes", freteId);
        await updateDoc(freteRef, updatedData);
        console.log("Frete atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar frete:", error);
    }
}

// Excluir um frete
export async function deleteFrete(freteId) {
    try {
        const freteRef = doc(db, "fretes", freteId);
        await deleteDoc(freteRef);
        console.log("Frete excluído com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir frete:", error);
    }
}

// ------------------------------- CRUD de CARREGAMENTOS ----------------------------------

// Adicionar um novo carregamento a um frete específico
export async function addCarregamento(freteId, carregamentoData) {
    try {
        const carregamentosCol = collection(doc(db, "fretes", freteId), "carregamentos");
        const docRef = await addDoc(carregamentosCol, carregamentoData);
        console.log("Carregamento adicionado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar carregamento:", error);
        return null;
    }
}

// Listar todos os carregamentos de um frete específico
export async function getCarregamentos(freteId) {
    try {
        const carregamentosCol = collection(doc(db, "fretes", freteId), "carregamentos");
        const querySnapshot = await getDocs(carregamentosCol);
        const carregamentos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return carregamentos;
    } catch (error) {
        console.error("Erro ao listar carregamentos:", error);
        return [];
    }
}

// Atualizar um carregamento específico
export async function updateCarregamento(freteId, carregamentoId, updatedData) {
    try {
        const carregamentoRef = doc(db, "fretes", freteId, "carregamentos", carregamentoId);
        await updateDoc(carregamentoRef, updatedData);
        console.log("Carregamento atualizado com sucesso!");
    } catch (error) {
        console.error("Erro ao atualizar carregamento:", error);
    }
}

// Excluir um carregamento específico
export async function deleteCarregamento(freteId, carregamentoId) {
    try {
        const carregamentoRef = doc(db, "fretes", freteId, "carregamentos", carregamentoId);
        await deleteDoc(carregamentoRef);
        console.log("Carregamento excluído com sucesso!");
    } catch (error) {
        console.error("Erro ao excluir carregamento:", error);
    }
}



export { db };
export default firebaseApp;
export { fretesCol };
export { getFirestore, collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where };
