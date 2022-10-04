import express, {json, request, response} from "express"

const app = express()

app.use(json())

let PLATS = [
    {id : 1, name : "Pizza", price : 100, description : "Italian pizza, with cheese and tomato sauce"},
    {id : 2, name : "Burger", price : 50, description : "American burger, with salad and cheese"},
    {id : 3, name : "Pasta", price : 75, description : "Italian pasta, with bolognese sauce"},
    {id : 4, name : "Salad", price : 25, description : "Salad with tomato, cucumber and cheese"},
    {id : 5, name : "Sandwich", price : 50, description : "Sandwich with ham, chicken and onion"},
]

app.get("/", (request, response) => {
    console.log("GET /")
    response.send("Hello, you are connected to the new deliverCROUS website !")
})

app.get("/plats", (request, response) => {
    console.log("GET /plats")
    response.json(PLATS)
})

app.get("/plats/search", (request, response) => {
    console.log("GET /plats/search")
    console.log(request.query)
    console.log(typeof request.query.keyword)

    const keyword = request.query.keyword
    
    let matchingPlats = new Array()

    if (typeof keyword === "string"){
        console.log("keyword is a string")
        for (let i = 0; i < PLATS.length; i++) {
            if (PLATS[i].description.includes(keyword)) {
                matchingPlats.push(PLATS[i])
            }
        }
    } else {
        console.log("keyword is not a string")
        // TODO : return uniquely plats containing all keywords
        for (let i = 0; i < PLATS.length; i++) {
            if (keyword.every(food => PLATS[i].description.includes(food))) {
                matchingPlats.push(PLATS[i])
            }
        }
    }
    
    response.json(matchingPlats)
})

function sortPlats(a,b,property){
    if (a[property] < b[property]) {
        console.log(a[property] + " < " + b[property])
        return -1;
    }
    if (a[property] > b[property]) {
        console.log(a[property] + " > " + b[property])
        return 1;
    }
    return 0;
}

app.get("/plats/orderby", (request, response) => {
    console.log("GET /plats/orderby")
    console.log(request.query.property)
    console.log(request.query.order)

    const orderBy = request.query.property
    const order = request.query.order

    let sortedPlats = new Array()

    if (order === "asc") {
        sortedPlats = PLATS.sort((a,b) => sortPlats(a,b,orderBy))
    } else if (order === "desc") {
        sortedPlats = PLATS.sort((a,b) => sortPlats(b,a,orderBy))
    } else {
        sortedPlats = PLATS
    }

    response.json(sortedPlats)
})

app.get("/plats/:id", (request, response) => {
    console.log("GET /plats/:id")
    const id = request.params.id
    const plat = PLATS.find(plat => plat.id == id)
    response.json(plat)
})

app.post("/plats", (request, response) => {
    console.log("POST /plats")
    const plat = request.body
    PLATS.push(plat)
    response.json(plat)
})

app.put("/plats/:id", (request, response) => {
    console.log("PUT /plats/:id")
    const id = request.params.id
    const plat = request.body
    const index = PLATS.findIndex(plat => plat.id == id)
    if (index == -1) {
        console.log("Plat not found")
        response.status(404).send("Plat not found")
    } else {
        console.log("Plat " + id + " updated")
        PLATS[index].id = parseInt(id)
        PLATS[index].name = plat.name
        PLATS[index].price = plat.price
        PLATS[index].description = plat.description
        response.json(plat)    
    }
})

app.delete("/plats/:id", (request, response) => {
    console.log("DELETE /plats/:id")
    const id = request.params.id
    const index = PLATS.findIndex(plat => plat.id == id)
    if (index == -1) {
        console.log("Plat not found")
        response.status(404).send("Plat not found")
    } else {
        console.log("Plat " + id + " deleted")
        PLATS.splice(index, 1)
        response.status(204).send("Plat " + id + " deleted")
    }
})

app.listen(30000, () => {
    console.log("Server started on port 30000")
})