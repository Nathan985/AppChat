async function connect() {

    if(global.connection && global.connection.state != 'disconnected'){ return global.connection; }

    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection("mysql://root:@localhost:3307/Conversa");
    console.log("Conectou no Mysql");
    global.connection = connection;
    return connection;

}

async function SelectFriends(id_Usuario) {

    const conn = await connect();
    const [rows] = await conn.query('SELECT id_Usuario, nome, foto, bio FROM Tbl_Amigo INNER JOIN Tbl_Usuario ON id_Usuario = fk_id_Amigo WHERE fk_id_Usuario = ?', id_Usuario);
    return rows;

}

async function SelectChat(id_Usuario, id_Amigo){

    const coon = await connect();
    const [rows] = await coon.query('SELECT * FROM Tbl_Chat WHERE (fk_id_Usuario = ' + id_Usuario + ' AND fk_id_Amigo = ' + id_Amigo + ') OR (fk_id_Amigo = ' + id_Usuario + ' AND fk_id_Usuario = ' + id_Amigo + ');');
    return rows;
}

async function SendMessage(mess, id_Usuario, id_Amigo){

    const coon = await connect();
    coon.query('INSERT INTO Tbl_Chat (mensagem, fk_id_Usuario, fk_id_Amigo) VALUES ("'+ mess +'",'+ id_Usuario +',' + id_Amigo +')');

}
module.exports = {SelectFriends, SelectChat, SendMessage}
