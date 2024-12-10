//detalhes.js

import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDcpggR7jf2BEPNLqRj1Iz368F0dDtD1-4",
    authDomain: "planilha-8938f.firebaseapp.com",
    projectId: "planilha-8938f",
    storageBucket: "planilha-8938f.firebasestorage.app",
    messagingSenderId: "211015132743",
    appId: "1:211015132743:web:45f443dc9e65b72fe37362" 
};

// Inicializa Firebase e Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchFreteDetails(freteId) {
    console.log('Tentando buscar frete com ID:', freteId);
    
    try {
        // Verifica se o ID é válido
        if (!freteId || typeof freteId !== 'string' || freteId.trim() === '') {
            throw new Error("ID do frete inválido ou não fornecido");
        }

        const freteRef = doc(db, "fretes", freteId);
        console.log('Referência do documento:', freteRef);
        
        const freteDoc = await getDoc(freteRef);
        console.log('Documento existe?', freteDoc.exists());
        
        if (!freteDoc.exists()) {
            throw new Error(`Frete com ID ${freteId} não encontrado.`);
        }
        
        const freteData = freteDoc.data();
        console.log('Dados do frete recuperados:', freteData);

        // Buscar o nome do frete e exibir no HTML
        const freteNomeElement = document.getElementById("frete-nome");
        if (freteNomeElement) {
            // Use a propriedade que contém o nome do frete, adjust as needed
            const nomeDoFrete = freteData.cliente || 'Frete sem nome';
            freteNomeElement.textContent = nomeDoFrete;
        }

        // Add the ID to the returned data for later use
        freteData.id = freteId;

        return freteData;
    } catch (error) {
        console.error("Erro detalhado ao buscar frete:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error; // Propaga o erro para ser tratado na função principal
    }
}

async function fetchCarregamentos(freteId) {
    console.log('Tentando buscar carregamentos para o frete:', freteId);
    
    try {
        const carregamentosRef = collection(db, `fretes/${freteId}/carregamentos`);
        console.log('Referência da coleção de carregamentos:', carregamentosRef);
        
        const carregamentosSnap = await getDocs(carregamentosRef);
        const carregamentos = [];
        
        carregamentosSnap.forEach((doc) => {
            carregamentos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`${carregamentos.length} carregamentos encontrados`);
        return carregamentos;
    } catch (error) {
        console.error("Erro ao buscar carregamentos:", error);
        return [];
    }
}

function renderFreteDetails(frete) {
    console.log('Renderizando detalhes do frete:', frete);
    
    const detalhesContainer = document.getElementById("frete-details");
    if (!detalhesContainer) {
        console.error("Container de detalhes não encontrado!");
        return;
    }
    
    detalhesContainer.innerHTML = "<h1>Detalhes do Frete</h1>";

    const freteFields = [
        { label: "Cliente", value: frete.cliente },
        { label: "Cliente Destino", value: frete.cliente_destino },
        { label: "Recebedor", value: frete.recebedor },
        { label: "Localização", value: frete.localizacao },
        { label: "Origem", value: frete.origem },
        { label: "Destino", value: frete.destino },
        { label: "Produto", value: frete.produto },
        { label: "Embalagem", value: frete.embalagem },
        { label: "Lote", value: frete.lote },
        { label: "Pedido", value: frete.pedido },
        { label: "Liberado", value: frete.liberado },
        { label: "Operação", value: frete.operacao },
        { label: "Data Início", value: frete.data },
        { label: "Valor Empresa", value: `R$ ${parseFloat(frete.valor_empresa || 0).toFixed(2)}` },
        { label: "Valor Motorista", value: `R$ ${parseFloat(frete.valor_motorista || 0).toFixed(2)}` },
    ];

    freteFields.forEach((field) => {
        if (field.value) {
            detalhesContainer.innerHTML += `
                <p><strong>${field.label}:</strong> ${field.value}</p>
            `;
        }
    });

    //adicionar botão de voltar
    detalhesContainer.innerHTML += `
        <a href="../index.html">Voltar</a>
    `;

    //adicionar botão de editar
    detalhesContainer.innerHTML += `
        <a href="../editar_frete.html?id=${frete.id}">Editar</a>
    `;

    //adicionar botão de adicionar carregamento
    detalhesContainer.innerHTML += `
        <a href="../public/form_add_carregamento.html?id=${frete.id}">Adicionar Carregamento</a>
    `;
}

function renderCarregamentos(carregamentos) {
    console.log('Renderizando carregamentos:', carregamentos);
    
    const carregamentosContainer = document.getElementById("carregamentos-list");
    if (!carregamentosContainer) {
        console.error("Container de carregamentos não encontrado!");
        return;
    }
    
    carregamentosContainer.innerHTML = "<h2>Carregamentos</h2>";

    if (!Array.isArray(carregamentos) || carregamentos.length === 0) {
        carregamentosContainer.innerHTML += `
            <p>Não existem carregamentos para esse frete.</p>
        `;
        return;
    }

    carregamentos.forEach((carregamento, index) => {
        const carregamentoDiv = document.createElement("div");
        carregamentoDiv.className = "carregamento-item";

        carregamentoDiv.innerHTML = `
            <p><strong>Carregamento ${index + 1}</strong></p>
            <p><strong>Data da OC:</strong> ${carregamento.data || "Não informado"}</p>
            <p><strong>Placa:</strong> ${carregamento.placa || "Não informado"}</p>
            <p><strong>Motorista:</strong> ${carregamento.motorista || "Não informado"}</p>
            <p><strong>Tipo de Veículo:</strong> ${carregamento.veiculo || "Não informado"}</p>
            <p><strong>Peso:</strong> ${carregamento.peso || "0"} kg</p>
            <p><strong>Frete Motorista:</strong> R$ ${parseFloat(carregamento.frete_motorista || 0).toFixed(2)}</p>
            <p><strong>Emissor:</strong> ${carregamento.emissor || "Não informado"}</p>
            <p><strong>Data Manifesto:</strong> ${carregamento.data_manifesto || "Não informado"}</p>
            <p><strong>CTE:</strong> ${carregamento.cte || "Não informado"}</p>
            <p><strong>Data Entrega:</strong> ${carregamento.data_entrega || "Não informado"}</p>
            <p><strong>NFe:</strong> ${carregamento.nfe || "Não informado"}</p>
            <p><strong>Observação:</strong> ${carregamento.obs || "Nenhuma"}</p>
        `;

        carregamentosContainer.appendChild(carregamentoDiv);
    });
}

async function loadDetails() {
    console.log('Iniciando carregamento dos detalhes...');
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const freteId = urlParams.get("id");
        
        console.log('ID do frete recuperado da URL:', freteId);

        if (!freteId) {
            throw new Error("ID do frete não fornecido na URL!");
        }

        // Tenta buscar os detalhes do frete
        const frete = await fetchFreteDetails(freteId);
        if (frete) {
            renderFreteDetails(frete);
            
            // Só busca carregamentos se conseguiu carregar o frete
            const carregamentos = await fetchCarregamentos(freteId);
            renderCarregamentos(carregamentos);
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        
        // Mostra mensagem de erro mais específica para o usuário
        const errorContainer = document.createElement('div');
        errorContainer.style.color = 'red';
        errorContainer.style.padding = '20px';
        errorContainer.innerHTML = `
            <h2>Erro ao carregar detalhes</h2>
            <p>${error.message}</p>
        `;
        document.body.insertBefore(errorContainer, document.body.firstChild);
    }
}

// Adiciona logging para garantir que o evento está sendo registrado
console.log('Registrando evento DOMContentLoaded...');
document.addEventListener("DOMContentLoaded", loadDetails);