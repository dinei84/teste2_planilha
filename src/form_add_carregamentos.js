// formHandler.js
import { addCarregamento } from "./index.js"; // Ajuste o caminho de acordo com a estrutura do seu projeto

// Seleciona os elementos do formulário
const form = document.getElementById("freteForm");
const adicionarButton = document.getElementById("adicionar_fretes");

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
    // Adicione suas validações aqui
    return true; // Retorna true se os dados forem válidos
}

// Função para lidar com o envio do formulário
async function handleSubmit(freteId) {
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

        // Envia os dados para a coleção "carregamentos"
        const carregamentoId = await addCarregamento(freteId, carregamentoData);
        
        if (carregamentoId) {
            alert("Carregamento adicionado com sucesso!");
            form.reset(); // Limpa o formulário após o envio bem-sucedido
        } else {
            alert("Erro ao adicionar carregamento. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao processar o carregamento:", error);
        alert("Erro ao adicionar carregamento. Verifique os dados e tente novamente.");
    }
}

// Adiciona evento de clique ao botão "Adicionar"
adicionarButton.addEventListener("click", () => {
    // Substitua "ID_DO_FRETE_AQUI" pelo ID real do frete
    const freteId = "7ohnf7sPnvSTXi8P98gQ"; 
    handleSubmit(freteId);
});

export { handleSubmit, getFormData };