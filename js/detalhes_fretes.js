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



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchFreteDetails(freteId) {
    try {
        const freteDoc = await getDoc(doc(db, "fretes", freteId));
        if (!freteDoc.exists()) {
            throw new Error("Frete não encontrado.");
        }
        return freteDoc.data();
    } catch (error) {
        console.error("Erro ao buscar detalhes do frete:", error);
        return null;
    }
}

async function fetchCarregamentos(freteId) {
    try {
        const carregamentosSnap = await getDocs(collection(db, `fretes/${freteId}/carregamentos`));
        const carregamentos = [];
        carregamentosSnap.forEach((doc) => {
            carregamentos.push(doc.data());
        });
        return carregamentos;
    } catch (error) {
        console.error("Erro ao buscar carregamentos:", error);
        return [];
    }
}

function renderFreteDetails(frete) {
    const detalhesContainer = document.getElementById("frete-details");
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
}

function renderCarregamentos(carregamentos) {
    const carregamentosContainer = document.getElementById("carregamentos-list");
    carregamentosContainer.innerHTML = "<h2>Carregamentos</h2>";

    if (carregamentos.length === 0) {
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
    const urlParams = new URLSearchParams(window.location.search);
    const freteId = urlParams.get("id");

    if (!freteId) {
        alert("ID do frete não fornecido!");
        return;
    }

    const frete = await fetchFreteDetails(freteId);
    if (frete) {
        renderFreteDetails(frete);
    } else {
        alert("Erro ao carregar detalhes do frete.");
        return;
    }

    const carregamentos = await fetchCarregamentos(freteId);
    renderCarregamentos(carregamentos);
}

document.addEventListener("DOMContentLoaded", loadDetails);
