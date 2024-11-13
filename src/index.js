import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";

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

// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    const inputPesquisar = document.getElementById("pesquisar");
    const btnPesquisar = document.getElementById("btnPesquisar");

    // Função para buscar documentos pelo campo cidade_destino
    async function getFretesByCidadeDestino(cidade) {
        try {
            if (!cidade) {
                console.log("Por favor, insira uma cidade para pesquisar");
                return [];
            }

            const fretesCol = collection(db, "fretes");
            const fretesQuery = query(fretesCol, where("cidade_destino", "==", cidade));
            const querySnapshot = await getDocs(fretesQuery);
            
            const fretesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return fretesList;
        } catch (error) {
            console.error("Erro ao buscar fretes por cidade_destino:", error);
            return [];
        }
    }

    // Função que será chamada quando clicar no botão de pesquisa
    async function realizarPesquisa() {
        const termoPesquisa = inputPesquisar.value.trim();
        
        if (termoPesquisa) {
            try {
                const fretes = await getFretesByCidadeDestino(termoPesquisa);
                if (fretes.length > 0) {
                    console.log("Fretes encontrados:", fretes);
                    // Aqui você pode adicionar código para mostrar os resultados na página
                } else {
                    console.log("Nenhum frete encontrado para a cidade:", termoPesquisa);
                }
            } catch (error) {
                console.error("Erro na pesquisa:", error);
            }
        } else {
            console.log("Por favor, insira um termo de pesquisa");
        }
    }

    // Adiciona evento de clique ao botão
    btnPesquisar.addEventListener('click', realizarPesquisa);

    // Opcional: Adiciona evento de pressionar Enter no input
    inputPesquisar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarPesquisa();
        }
    });
});