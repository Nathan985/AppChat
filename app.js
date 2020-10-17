var app = require('http').createServer(resposta);
var fs = require('fs');
var io = require('socket.io')(app);
var db = require('./db');
console.log('começou');
app.listen(3000);
console.log("Aplicação está em excução...");
    // (async () =>{
        
    //     const Amigos = await db.SelectFriends(1);
    //     console.log(Amigos);
    //     socket.emit("Select Amigos", Amigos);
    // })();


function resposta(req, res) {

    var arquivo = "";
    if (req.url == "/") {
        arquivo = __dirname + '/View/index.html';
    } else {
        arquivo = __dirname + req.url;
    }
    fs.readFile(arquivo,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Erro ao carregar o arquivo index.html!');
            }
            res.writeHead(200);
            res.end(data);

        });
}
// function PegarDataAtual() {
//     var dataAtual = new Date();

//     var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
//     var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
//     var ano = dataAtual.getFullYear();
//     var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
//     var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();
//     var segundo = (dataAtual.getSeconds() < 10 ? '0' : '') + dataAtual.getSeconds();

//     var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
//     return dataFormatada;
// }
io.on("connection", (socket) => {
    socket.on("Select Amigos", async (select_amigos) =>{
        const Amigos = await db.SelectFriends(select_amigos);
        io.sockets.emit("Buscar Amigos", Amigos);
    });
});

io.on("connection", socket => {
    socket.on("SelectChat", async (id_Usuario, id_Amigo) => {
        const Chat = await db.SelectChat(id_Usuario, id_Amigo);
        io.sockets.emit("BuscarChat", Chat);
    });
});

io.on("connection", function (socket) {
    socket.on("enviar mensagem", function (mensagem_enviada, id_Usuario, id_Amigo, callback) {
        if(mensagem_enviada){
            db.SendMessage(mensagem_enviada, id_Usuario, id_Amigo)
            mensagem_enviada = mensagem_enviada;
            io.sockets.emit("atualizar mensagens", mensagem_enviada);
            callback();
        }
    });
});

