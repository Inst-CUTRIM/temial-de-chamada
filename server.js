// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Necessário para caminhos de arquivos

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO para permitir conexões externas
const io = socketIo(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// ALTERAÇÃO PARA REDE: Usa a porta definida pela hospedagem ou 3000 localmente
const PORT = process.env.PORT || 3000;

// NOVO: Faz o servidor servir as imagens e HTML da pasta frontend automaticamente
app.use(express.static(path.join(__dirname, 'frontend')));

// --- ESTRUTURA DE DADOS EM MEMÓRIA ---
let nCounter = 0;    
let pCounter = 0;    
let fila = [];       
let historicoChamadas = []; 

// --- FUNÇÃO AUXILIAR PARA ENVIAR O ESTADO ATUAL ---
function emitirAtualizacao() {
    const ultimasChamadas = historicoChamadas.slice(-5).reverse(); 
    
    io.emit('atualizarPainel', {
        fila,
        ultimaChamada: historicoChamadas[historicoChamadas.length - 1] || null,
        historico: ultimasChamadas 
    });
}

// --- NOVO: ROTA PARA REINICIAR/ZERAR TUDO ---
app.get('/reiniciar', (req, res) => {
    try {
        nCounter = 0;
        pCounter = 0;
        fila = [];
        historicoChamadas = [];
        
        console.log("Sistema resetado com sucesso!");
        emitirAtualizacao(); // Avisa a TV que tudo sumiu e voltou ao zero
        
        res.send({ success: true, message: 'Contadores e filas zerados com sucesso.' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Erro ao reiniciar servidor.' });
    }
});

// --- ROTA DE GERAÇÃO DE SENHAS ---
app.get('/gerar/:tipo', (req, res) => {
    const tipo = req.params.tipo.toUpperCase();
    let numero;
    let prefixo;

    if (tipo === 'N') { 
        prefixo = 'N';
        nCounter++;     
        numero = String(nCounter).padStart(2, '0');
    } else if (tipo === 'P') {
        prefixo = 'P';
        pCounter++;
        numero = String(pCounter).padStart(2, '0');
    } else {
        return res.status(400).send({ success: false, message: 'Tipo inválido.' });
    }

    const novaSenha = {
        id: `${prefixo}-${numero}`,
        tipo: tipo,
        status: 'Aguardando',
        timestamp: Date.now()
    };
    
    fila.push(novaSenha);
    emitirAtualizacao(); 
    res.send({ success: true, senha: novaSenha.id });
});

// --- ROTA DE CHAMADA DE SENHAS ---
app.get('/chamar/:mesa/:tipoChamada', (req, res) => {
    const mesa = req.params.mesa;
    const tipoChamada = req.params.tipoChamada.toUpperCase(); 

    const senhaIndex = fila.findIndex(s => s.status === 'Aguardando' && s.tipo === tipoChamada);
    
    if (senhaIndex === -1) {
        return res.status(404).send({ success: false, message: `Fila ${tipoChamada} vazia.` });
    }

    const senhaChamada = fila[senhaIndex];
    senhaChamada.status = 'Chamado';
    senhaChamada.guiche = mesa; 
    
    fila.splice(senhaIndex, 1); 
    historicoChamadas.push(senhaChamada);
    
    emitirAtualizacao();
    res.send({ success: true, chamada: senhaChamada });
});

// --- CONEXÃO SOCKET ---
io.on('connection', (socket) => {
    console.log('Cliente conectado ao sistema online!');
    emitirAtualizacao(); 
});

// INICIALIZAÇÃO
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});