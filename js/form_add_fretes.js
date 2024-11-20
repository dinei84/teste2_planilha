import { collection, addDoc } from "../src/index.js"; 
import { db } from '../src/index.js';

const fretesCol = collection(db, "fretes");

const form = {
    cliente: () => document.getElementById('cliente'),
    clienteDestino: () => document.getElementById('cliente_destino'),
    recebedor: () => document.getElementById('recebedor'),
    localizacao: () => document.getElementById('localizacao'),
    origem: () => document.getElementById('origem'),
    destino: () => document.getElementById('destino'),
    produto: () => document.getElementById('produto'),
    liberado: () => document.getElementById('liberado'),
    embalagem: () => document.getElementById('embalagem'),
    valorEmpresa: () => document.getElementById('valor_empresa'),
    valorMotorista: () => document.getElementById('valor_motorista'),
    pedido: () => document.getElementById('pedido'),
    operacao: () => document.getElementById('operacao'),
    lote: () => document.getElementById('lote'),
    data: () => document.getElementById('data')
};

async function createFrete(data) {
    try {
        const docRef = await addDoc(fretesCol, data);
        console.log("Frete criado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao criar frete:", error);
        return null;
    }
}

function getFormData() {
    return {
        cliente: form.cliente().value,
        cliente_destino: form.clienteDestino().value,
        recebedor: form.recebedor().value,
        localizacao: form.localizacao().value,
        origem: form.origem().value,
        destino: form.destino().value,
        produto: form.produto().value,
        liberado: Number(form.liberado().value),
        embalagem: form.embalagem().value,
        valor_empresa: Number(form.valorEmpresa().value),
        valor_motorista: Number(form.valorMotorista().value),
        pedido: form.pedido().value,
        operacao: form.operacao().value,
        lote: form.lote().value,
        data: form.data().value,
        created_at: new Date().toISOString()
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const freteForm = document.getElementById('freteForm');
    const btnAdicionar = document.querySelector('#freteForm button[type="button"]:not(#voltar)');
    
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', async (e) => {
            e.preventDefault();
            const freteData = getFormData();
            
            const id = await createFrete(freteData);
            if (id) {
                alert('Frete criado com sucesso!');
                // Corrigindo o caminho do redirecionamento para apontar para o index.html na raiz
                window.location.href = '../../index.html';   
                // Alternativa usando caminho relativo caso o anterior não funcione:
                // window.location.href = '../../index.html';
            } else {
                alert('Erro ao criar frete. Tente novamente.');
            }
        });
    } else {
        console.error('Botão Adicionar não encontrado');
    }
});