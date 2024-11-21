//mostrador.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcpggR7jf2BEPNLqRj1Iz368F0dDtD1-4",
    authDomain: "planilha-8938f.firebaseapp.com",
    projectId: "planilha-8938f",
    storageBucket: "planilha-8938f.firebasestorage.app",
    messagingSenderId: "211015132743",
    appId: "1:211015132743:web:45f443dc9e65b72fe37362" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const fretesCol = collection(db, "fretes");

// Função para renderizar a lista de fretes
async function renderFretes() {
    console.log('Iniciando renderização dos fretes...');
    const fretesList = document.getElementById("fretes-list");
    
    if (!fretesList) {
        console.error("Elemento 'fretes-list' não encontrado");
        return;
    }
    
    fretesList.innerHTML = "";

    try {
        const querySnapshot = await getDocs(fretesCol);
        console.log(`Encontrados ${querySnapshot.size} fretes`);
        
        querySnapshot.forEach((docSnapshot) => {
            const frete = docSnapshot.data();
            frete.id = docSnapshot.id;
            console.log('Processando frete:', frete.id);
            fretesList.appendChild(createFreteElement(frete));
        });
    } catch (error) {
        console.error("Erro ao buscar fretes:", error);
        fretesList.innerHTML = `<p class="error">Erro ao carregar fretes: ${error.message}</p>`;
    }
}

function createFreteElement(frete) {
    console.log('Criando elemento para frete:', frete.id);
    
    const freteLink = document.createElement("a");
    const href = `../public/detalhes_frete.html?id=${frete.id}`;
    console.log('Link gerado:', href);
    freteLink.href = href;
    freteLink.className = "frete-link";

    freteLink.addEventListener('click', (e) => {
        console.log('Clique no frete:', frete);
        console.log('URL de destino:', e.currentTarget.href);
    });

    const freteItem = document.createElement("div");
    freteItem.className = "frete-item";

    const freteInfo = document.createElement("div");
    freteInfo.className = "frete-info";

    // Organização dos dados em 5 colunas
    const groups = [
        {
            title: "Informações do Cliente",
            items: {
                "Cliente": frete.cliente || 'Não informado',
                "Cliente Destino": frete.cliente_destino || 'Não informado',
                "Recebedor": frete.recebedor || 'Não informado'
            }
        },
        {
            title: "Localização",
            items: {
                "Origem": frete.origem || 'Não informada',
                "Destino": frete.destino || 'Não informado',
                "Localização Atual": frete.localizacao || 'Não informada'
            }
        },
        {
            title: "Produto",
            items: {
                "Produto": frete.produto || 'Não informado',
                "Embalagem": frete.embalagem || 'Não informada',
                "Lote": frete.lote || 'Não informado'
            }
        },
        {
            title: "Status",
            items: {
                "Pedido": frete.pedido || 'Não informado',
                "Liberado": frete.liberado || 'Não informado',
                "Operação": frete.operacao || '0%'
            }
        },
        {
            title: "Valores",
            items: {
                "Data": frete.data || 'Não informada',
                "Valor Empresa": `R$ ${parseFloat(frete.valor_empresa || 0).toFixed(2)}`,
                "Valor Motorista": `R$ ${parseFloat(frete.valor_motorista || 0).toFixed(2)}`
            }
        }
    ];

    groups.forEach(group => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "frete-info-group";
        
        const titleP = document.createElement("p");
        titleP.className = "group-title";
        titleP.innerHTML = `<strong>${group.title}</strong>`;
        groupDiv.appendChild(titleP);

        Object.entries(group.items).forEach(([label, value]) => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${label}:</strong> ${value}`;
            groupDiv.appendChild(p);
        });

        freteInfo.appendChild(groupDiv);
    });

    const freteActions = document.createElement("div");
    freteActions.className = "frete-actions";

    const updateButton = document.createElement("button");
    updateButton.className = "button update-btn";
    updateButton.textContent = "Atualizar";
    updateButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateFrete(frete.id);
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "button delete-btn";
    deleteButton.textContent = "Excluir";
    deleteButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteFrete(frete.id);
    };

    const addLoadButton = document.createElement("button");
    addLoadButton.className = "button add-load-btn";
    addLoadButton.textContent = "Adicionar Carregamento";
    addLoadButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addLoad(frete.id);
    };

    freteActions.appendChild(updateButton);
    freteActions.appendChild(deleteButton);
    freteActions.appendChild(addLoadButton);

    freteItem.appendChild(freteInfo);
    freteItem.appendChild(freteActions);
    freteLink.appendChild(freteItem);

    return freteLink;
}

async function updateFrete(id) {
    console.log('Iniciando atualização do frete:', id);
    const newDescricao = prompt("Digite a nova descrição do frete:");
    if (!newDescricao) return;

    try {
        const freteRef = doc(db, "fretes", id);
        await updateDoc(freteRef, { descricao: newDescricao });
        alert("Frete atualizado com sucesso!");
        await renderFretes();
    } catch (error) {
        console.error("Erro ao atualizar frete:", error);
        alert(`Erro ao atualizar frete: ${error.message}`);
    }
}

async function deleteFrete(id) {
    console.log('Iniciando exclusão do frete:', id);
    if (!confirm("Tem certeza que deseja excluir este frete?")) return;

    try {
        const freteRef = doc(db, "fretes", id);
        await deleteDoc(freteRef);
        alert("Frete excluído com sucesso!");
        await renderFretes();
    } catch (error) {
        console.error("Erro ao excluir frete:", error);
        alert(`Erro ao excluir frete: ${error.message}`);
    }
}

function addLoad(id) {
    console.log('Redirecionando para adicionar carregamento ao frete:', id);
    try {
        window.location.href = `form_add_carregamento.html?id=${id}`;
    } catch (error) {
        console.error("Erro ao redirecionar:", error);
        alert("Erro ao redirecionar para o formulário de carregamento");
    }
}

// Adiciona um listener para a barra de pesquisa
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada, inicializando...');
    
    const searchInput = document.getElementById('pesquisar');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Implementar lógica de pesquisa aqui
            console.log('Termo de pesquisa:', e.target.value);
        });
    }

    renderFretes();
});

// Exportar funções necessárias
export { renderFretes, updateFrete, deleteFrete, addLoad };