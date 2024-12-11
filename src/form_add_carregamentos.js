// form_add_carregamentos.js
import { getFirestore, doc, getDoc, addDoc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Configuração do Firebase (mesma do detalhes.js)
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

// Seleciona os elementos do formulário
const form = document.getElementById("freteForm");
const adicionarButton = document.getElementById("adicionar_fretes");
const tituloFormulario = document.getElementById("titulo-formulario");

// Função para capturar os dados do formulário
function getFormData() {
    return {
        data: document.getElementById("data").value,
        placa: document.getElementById("placa").value,
        motorista: document.getElementById("motorista").value,
        veiculo: document.getElementById("veiculo").value,
        peso: parseFloat(document.getElementById("peso").value),
        frete_motorista: parseFloat(document.getElementById("frete_motorista").value),
        emissor: document.getElementById("emissor").value,
        data_manifesto: document.getElementById("data_manifesto").value,
        cte: document.getElementById("cte").value,
        data_entrega: document.getElementById("data_entrega").value,
        nfe: document.getElementById("nfe").value,
        obs: document.getElementById("obs").value
    };
}

// Função para validar os dados do formulário
function validateFormData(data) {
    const camposObrigatorios = ['data', 'placa', 'motorista', 'peso', 'frete_motorista'];
    
    for (let campo of camposObrigatorios) {
        if (!data[campo] || (campo === 'peso' && isNaN(data[campo])) || 
            (campo === 'frete_motorista' && isNaN(data[campo]))) {
            console.error(`Campo obrigatório inválido: ${campo}`);
            return false;
        }
    }
    
    return true;
}

// Função para adicionar carregamento
async function addCarregamento(freteId, carregamentoData) {
    try {
        const carregamentosRef = collection(db, `fretes/${freteId}/carregamentos`);
        const docRef = await addDoc(carregamentosRef, carregamentoData);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar carregamento:", error);
        return null;
    }
}

// Função para atualizar carregamento
async function updateCarregamento(freteId, carregamentoId, carregamentoData) {
    try {
        const carregamentoRef = doc(db, `fretes/${freteId}/carregamentos`, carregamentoId);
        await updateDoc(carregamentoRef, carregamentoData);
        return carregamentoId;
    } catch (error) {
        console.error("Erro ao atualizar carregamento:", error);
        return null;
    }
}

// Função para buscar dados de um carregamento específico
async function fetchCarregamento(freteId, carregamentoId) {
    try {
        const carregamentoRef = doc(db, `fretes/${freteId}/carregamentos`, carregamentoId);
        const carregamentoDoc = await getDoc(carregamentoRef);

        if (!carregamentoDoc.exists()) {
            throw new Error("Carregamento não encontrado");
        }

        return { id: carregamentoDoc.id, ...carregamentoDoc.data() };
    } catch (error) {
        console.error("Erro ao buscar carregamento:", error);
        return null;
    }
}

// Função para preencher formulário com dados existentes
function preencherFormulario(carregamento) {
    document.getElementById("data").value = carregamento.data || "";
    document.getElementById("placa").value = carregamento.placa || "";
    document.getElementById("motorista").value = carregamento.motorista || "";
    document.getElementById("veiculo").value = carregamento.veiculo || "";
    document.getElementById("peso").value = carregamento.peso || "";
    document.getElementById("frete_motorista").value = carregamento.frete_motorista || "";
    document.getElementById("emissor").value = carregamento.emissor || "";
    document.getElementById("data_manifesto").value = carregamento.data_manifesto || "";
    document.getElementById("cte").value = carregamento.cte || "";
    document.getElementById("data_entrega").value = carregamento.data_entrega || "";
    document.getElementById("nfe").value = carregamento.nfe || "";
    document.getElementById("obs").value = carregamento.obs || "";
}

// Função para lidar com o envio do formulário
async function handleSubmit(freteId, carregamentoId = null) {
    try {
        // Captura os dados do formulário
        const carregamentoData = getFormData();

        // Valida os dados
        if (!validateFormData(carregamentoData)) {
            alert("Por favor, preencha todos os campos obrigatórios corretamente.");
            return;
        }

        // Verifica se o ID do frete foi fornecido
        if (!freteId) {
            alert("Erro: ID do frete não encontrado!");
            return;
        }

        adicionarButton.disabled = true; // Desabilita o botão durante o envio

        // Verifica se é uma edição ou adição de novo carregamento
        let resultId;
        if (carregamentoId) {
            // Atualização de carregamento existente
            resultId = await updateCarregamento(freteId, carregamentoId, carregamentoData);
            if (resultId) {
                alert("Carregamento atualizado com sucesso!");
            }
        } else {
            // Adição de novo carregamento
            resultId = await addCarregamento(freteId, carregamentoData);
            if (resultId) {
                alert("Carregamento adicionado com sucesso!");
            }
        }

        if (resultId) {
            window.location.href = `../public/detalhes_frete.html?id=${freteId}`;
            form.reset(); // Limpa o formulário após o envio bem-sucedido
        } else {
            alert("Erro ao processar carregamento. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao processar o carregamento:", error);
        alert("Erro ao processar carregamento. Verifique os dados e tente novamente.");
    } finally {
        adicionarButton.disabled = false; // Reabilita o botão após a operação
    }
}

// Verifica se é uma página de edição ou adição
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const freteId = urlParams.get("freteId");
    const carregamentoId = urlParams.get("carregamentoId");

    console.log("Parâmetros recebidos:", { freteId, carregamentoId });

    let tituloFormulario = document.getElementById("titulo-formulario");

    if (!tituloFormulario) {
        tituloFormulario = document.createElement("h2");
        tituloFormulario.id = "titulo-formulario";
        const formElement = document.getElementById("freteForm");
        if (formElement) {
            formElement.insertBefore(tituloFormulario, formElement.firstChild);
        }
    }

    // Determina o título do formulário com base no contexto
    if (carregamentoId) {
        tituloFormulario.textContent = "Editar Carregamento";

        if (freteId) {
            try {
                const carregamento = await fetchCarregamento(freteId, carregamentoId);
                if (carregamento) {
                    preencherFormulario(carregamento);
                }
            } catch (error) {
                console.error("Erro ao buscar carregamento para edição:", error);
                alert("Erro ao carregar dados do carregamento.");
            }
        }
    } else {
        tituloFormulario.textContent = "Adicionar Carregamento";
    }

    // Configura o botão de ação
    const adicionarButton = document.getElementById("adicionarButton");
    if (adicionarButton) {
        adicionarButton.addEventListener("click", async () => {
            try {
                await handleSubmit(freteId, carregamentoId);
            } catch (error) {
                console.error("Erro ao processar o formulário:", error);
                alert("Erro ao enviar os dados.");
            }
        });
    } else {
        console.warn("Botão 'Adicionar/Atualizar' não encontrado.");
    }
});


export { handleSubmit, getFormData };