// mostrador.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { firebaseConfig } from "../src/index.js"; // Certifique-se de que o caminho esteja correto

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const fretesCol = collection(db, "fretes");

// Resto do código para renderização e manipulação dos fretes


// Função para renderizar a lista de fretes
async function renderFretes() {
    const fretesList = document.getElementById("fretes-list");
    if (!fretesList) {
        console.error("Elemento 'fretes-list' não encontrado");
        return;
    }
    
    fretesList.innerHTML = "";

    try {
        const querySnapshot = await getDocs(fretesCol);
        querySnapshot.forEach((docSnapshot) => {
            const frete = docSnapshot.data();
            frete.id = docSnapshot.id;
            fretesList.appendChild(createFreteElement(frete));
        });
    } catch (error) {
        console.error("Erro ao buscar fretes:", error);
        fretesList.innerHTML = `<p class="error">Erro ao carregar fretes: ${error.message}</p>`;
    }
}

function createFreteElement(frete) {
    // Criar o link ao redor de toda a div
    const freteLink = document.createElement("a");
    freteLink.href = `detalhes_frete.html?freteId=${frete.id}`; // Ajuste o caminho do arquivo HTML conforme necessário
    freteLink.className = "frete-link"; // Classe para estilizar o link, se necessário

    const freteItem = document.createElement("div");
    freteItem.className = "frete-item";

    const freteInfo = document.createElement("div");
    freteInfo.className = "frete-info";

    // Organização dos dados em 5 colunas
    const groups = [
        // Coluna 1: Informações do Cliente
        {
            title: "Informações do Cliente",
            items: {
                "Cliente": frete.cliente || 'Não informado',
                "Cliente Destino": frete.cliente_destino || 'Não informado',
                "Recebedor": frete.recebedor || 'Não informado'
            }
        },
        // Coluna 2: Localização
        {
            title: "Localização",
            items: {
                "Origem": frete.origem || 'Não informada',
                "Destino": frete.destino || 'Não informado',
                "Localização Atual": frete.localizacao || 'Não informada'
            }
        },
        // Coluna 3: Produto
        {
            title: "Produto",
            items: {
                "Produto": frete.produto || 'Não informado',
                "Embalagem": frete.embalagem || 'Não informada',
                "Lote": frete.lote || 'Não informado'
            }
        },
        // Coluna 4: Status
        {
            title: "Status",
            items: {
                "Pedido": frete.pedido || 'Não informado',
                "Liberado": frete.liberado || 'Não informado',
                "Operação": frete.operacao || '0%'
            }
        },
        // Coluna 5: Valores
        {
            title: "Valores",
            items: {
                "Data": frete.data || 'Não informada',
                "Valor Empresa": `R$ ${parseFloat(frete.valor_empresa || 0).toFixed(2)}`,
                "Valor Motorista": `R$ ${parseFloat(frete.valor_motorista || 0).toFixed(2)}`
            }
        }
    ];

    // Criar grupos de informações
    groups.forEach(group => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "frete-info-group";
        
        // Adicionar título do grupo
        const titleP = document.createElement("p");
        titleP.className = "group-title";
        titleP.innerHTML = `<strong>${group.title}</strong>`;
        groupDiv.appendChild(titleP);

        // Adicionar items do grupo
        Object.entries(group.items).forEach(([label, value]) => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${label}:</strong> ${value}`;
            groupDiv.appendChild(p);
        });

        freteInfo.appendChild(groupDiv);
    });

    // Botões de ação
    const freteActions = document.createElement("div");
    freteActions.className = "frete-actions";

    const updateButton = document.createElement("button");
    updateButton.className = "button update-btn";
    updateButton.textContent = "Atualizar";
    updateButton.onclick = (e) => {
        e.preventDefault(); // Impedir que o clique no botão siga o link
        updateFrete(frete.id);
    };

    const deleteButton = document.createElement("button");
    deleteButton.className = "button delete-btn";
    deleteButton.textContent = "Excluir";
    deleteButton.onclick = (e) => {
        e.preventDefault();
        deleteFrete(frete.id);
    };

    const addLoadButton = document.createElement("button");
    addLoadButton.className = "button add-load-btn";
    addLoadButton.textContent = "Adicionar Carregamento";
    addLoadButton.onclick = (e) => {
        e.preventDefault();
        addLoad(frete.id);
    };

    freteActions.appendChild(updateButton);
    freteActions.appendChild(deleteButton);
    freteActions.appendChild(addLoadButton);

    freteItem.appendChild(freteInfo);
    freteItem.appendChild(freteActions);

    // Adicionar o item ao link
    freteLink.appendChild(freteItem);

    return freteLink;
}



async function updateFrete(id) {
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
    try {
        const url = new URL('form_add_carregamento.html', window.location.href);
        url.searchParams.set('freteId', id);
        window.location.href = url.toString();
    } catch (error) {
        console.error("Erro ao redirecionar:", error);
        alert("Erro ao redirecionar para o formulário de carregamento");
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', renderFretes);