const app = require('express')(); 
let fs = require ('fs');
const PORT = 8080;
const endpoint1 = '/engines';

class Engine {
    constructor(id,type,md)
    {
        this.id = id;
        this.type = type;
        this.manufactureDate = md;
    }
}

let e0 = new Engine(0,'Gas',2020);
let e1 = new Engine(1,'Diesel',2021);
let e2 = new Engine(2,'Electric',2022);
let enginesList = [];
enginesList.push(e0,e1,e2);

function saveEngineList()
{
    let filename = 'engines_data.txt';

    var json = JSON.stringify(enginesList);
    fs.writeFile(filename, json, function (err) {
        if (err) throw err;
        console.log('Engine list written successfully!');
        });
}

function appStartup()
{
    console.log(`Listening on http://localhost:${PORT}`);
    saveEngineList();
}

function sendEngineList(request,response)
{
    response.status(200).send({enginesList})   
}

app.listen(
    PORT,
    () => appStartup()
)

app.get( 
    endpoint1, 
    (req,res) => sendEngineList(req,res) 
);