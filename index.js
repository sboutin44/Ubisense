/*
    * Sebastien Boutin

    Install:
        1. Download node js at https://nodejs.org/en/
        2. $ npm init -y
        3. $ npm install expres
        
    Run:
        $ node index.js
 */

const app = require('express')(); 
let fs = require ('fs');
const PORT = 8080;
const endpoint1 = '/engines';
let enginesListFilename = 'engines_data.txt';
let enginesList;

class Engine {
    constructor(id,type,md)
    {
        this.id = id;
        this.type = type;
        this.manufactureDate = md;
    }
}

function writeListOnDisk(list,filename)
{
    var json = JSON.stringify(list);
    fs.writeFile(filename, json, function (err) {
        if (err) throw err;
        console.log('Engine list written successfully!');
        });
}

function readListFromDisk(filename)
{
    let list = [];

    try {
        rawList = fs.readFileSync(filename,'utf-8');
        list = JSON.parse(rawList);
    } catch (err) {
        throw err;
    }

    return list;
}

function add(a,b)
{
    return a+b;
}

function appStartup()
{
    console.log(`Listening on http://localhost:${PORT}`);

    // Load an engine list file if it exists.
    enginesList = readListFromDisk(enginesListFilename);
    console.log(enginesList);
}

function getEngineList(response)
{
    response.status(200).send(enginesList)   
}

function updateManufactureDate(request, response)
{
    console.log("updateManufactureDate");
    let found = false;

    // Extract request
    // console.log(request);
    id = request.body.key;
    newManufactureDate = request.body.value;


    console.log(`id: ${id}`);
    console.log(`newManufactureDate: ${newManufactureDate}`);

    // Replace the manufacture date if we find the engine id.
    // for (obj in enginesList)
    // {
    //     if (obj.id == id)
    //     {
    //         obj.manufactureDate = newManufactureDate;
    //         found = true;
    //         console.log("Updated manufacture date. ");
    //     }
    // }
    // if (found == false)
    //     console.log("Error: engine id not in database.");
}


app.listen(
    PORT,
    () => appStartup()
)

app.get( 
    endpoint1, 
    (req,res) => getEngineList(res) 
);

app.put(
    endpoint1, 
    (req, res) => updateManufactureDate(req, res)
)
