// detalhes_frete.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { firebaseConfig } from "../src/index.js";

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para obter o ID do frete da URL
function getFreteIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para carregar os detalhes do frete
async function loadFreteDetails() {
    const freteId = getFreteIdFromUrl();
    if (!freteId) {
        console.error("ID do frete não encontrado na URL");
        document.getElementById("frete-details").innerHTML = "Frete não encontrado";
        return;
    }

    try {
        // Buscar dados do frete
        const freteDoc = await getDoc(doc(db, "fretes", freteId));
        
        if (!freteDoc.exists()) {
            document.getElementById("frete-details").innerHTML = "Frete não encontrado";
            return;
        }

        const freteData = freteDoc.data();
        displayFreteDetails(freteData);

        // Buscar carregamentos relacionados
        const carregamentosSnapshot = await getDocs(collection(db, "fretes", freteId, "carregamentos"));
        const carregamentos = carregamentosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        displayCarregamentos(carregamentos);

    } catch (error) {
        console.error("Erro ao carregar detalhes do frete:", error);
        document.getElementById("frete-details").innerHTML = `Erro ao carregar detalhes: ${error.message}`;
    }
}

// Função para exibir os detalhes do frete
function displayFreteDetails(frete) {
    const detailsContainer = document.getElementById("frete-details");
    detailsContainer.innerHTML = `
        <div class="frete-info">
            <h2>Detalhes do Frete</h2>
            <p><strong>Cliente:</strong> ${frete.cliente || 'N/A'}</p>
            <p><strong>Origem:</strong> ${frete.origem || 'N/A'}</p>
            <p><strong>Destino:</strong> ${frete.destino || 'N/A'}</p>
            <p><strong>Valor:</strong> R$ ${frete.valor?.toFixed(2) || '0.00'}</p>
            <p><strong>Status:</strong> ${frete.status || 'N/A'}</p>
            <p><strong>Data:</strong> ${frete.data ? new Date(frete.data).toLocaleDateString() : 'N/A'}</p>
        </div>
    `;
}

// Função para exibir os carregamentos
function displayCarregamentos(carregamentos) {
    const carregamentosContainer = document.getElementById("carregamentos-list");
    if (!carregamentosContainer) return;

    if (carregamentos.length === 0) {
        carregamentosContainer.innerHTML = "<p>Nenhum carregamento encontrado</p>";
        return;
    }

    const carregamentosHTML = carregamentos.map(carregamento => `
        <div class="carregamento-item">
            <h3>Carregamento ${carregamento.id}</h3>
            <p><strong>Produto:</strong> ${carregamento.produto || 'N/A'}</p>
            <p><strong>Quantidade:</strong> ${carregamento.quantidade || 'N/A'}</p>
            <p><strong>Local de Coleta:</strong> ${carregamento.localColeta || 'N/A'}</p>
        </div>
    `).join('');

    carregamentosContainer.innerHTML = carregamentosHTML;
}

// Carregar detalhes quando a página for carregada
document.addEventListener('DOMContentLoaded', loadFreteDetails);