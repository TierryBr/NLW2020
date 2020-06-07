const express = require("express")
const server = express()


// pegar o banco de dados
const db = require("./database/db")


// confurar pasta publica/css
server.use(express.static("public"))



// habilitar o uso que request.body na aplicação
server.use(express.urlencoded({ extended: true }))



// utilizando templete engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


// configurar caminhos da aplicação
// pagina inicial
server.get("/", (request, response) => {
    return response.render("index.html")
})







server.get("/create-point", (request, response) => {

    //console.log(request.query)

    return response.render("create-point.html")
})



server.post("/savepoint", (request, response) => {

    //console.log(request.body)

    // inserir dados no banco
    const query = `
        INSERT INTO places (
            image, 
            name, 
            address, 
            address2, 
            state, 
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        request.body.image,
        request.body.name,
        request.body.address,
        request.body.address2,
        request.body.state,
        request.body.city,
        request.body.items,
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return response.send("Erro no cadastro")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return response.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)



})







server.get("/search-result", (request, response) => {

    const search = request.query.search

    if (search == "") {
        //pesquisa for vazia
        return response.render("search-result.html", { total: 0 })
    }

    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length
        // mostrar a pagina html com os dados do banco de dados
        return response.render("search-result.html", { places: rows, total: total })
    })


})


// ligar o servidor
server.listen(5000)