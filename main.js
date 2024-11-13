// main.js
import { createFrete, getFretesByCidadeDestino, getFreteById, updateFrete, deleteFrete } from './index.js';



// Exemplo de uso: criar um novo frete
const novoFrete = {
    cliente: "Empresa XYZ",
    expedidor: "Empresa ABC",
    cidade_destino: "São Paulo",
    valor: 150.0,
    peso: 500,
    cliente: "Empresa XYZ"
};
createFrete(novoFrete).then(id => {
    if (id) {
        console.log("Frete criado com sucesso com ID:", id);
    }
});

// Exemplo de uso: buscar fretes por cidade_destino
getFretesByCidadeDestino("São Paulo").then(fretes => {
    console.log("Fretes encontrados para São Paulo:", fretes);
});

// Exemplo de uso: buscar frete por ID
getFreteById("ID_DO_FRETE").then(frete => {
    if (frete) {
        console.log("Dados do frete:", frete);
    } else {
        console.log("Frete não encontrado.");
    }
});

// Exemplo de uso: atualizar um frete
updateFrete("ID_DO_FRETE", { valor: 200.0 }).then(success => {
    if (success) {
        console.log("Frete atualizado com sucesso.");
    }
});

// Exemplo de uso: deletar um frete
deleteFrete("ID_DO_FRETE").then(success => {
    if (success) {
        console.log("Frete deletado com sucesso.");
    }
});
