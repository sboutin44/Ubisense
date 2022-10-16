/*
    * Sebastien Boutin

    Install:
        1. Download node js at https://nodejs.org/en/
        2. $ npm init -y
        3. $ npm install expres
        4. npm install --save cors // to fix the error: 'fetch: access-control-allow-origin'
        
    Run:
        $ node index.js
 */

const app = require('express')(); 
var cors = require('cors');         // to fix the error: 'fetch: access-control-allow-origin'
let fs = require ('fs');
const { send } = require('process');
const PORT = 8080;
const endpoint1 = '/engines';
const endpoint2 = '/put_req';
let enginesListFilename = 'engines_data.json';
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
    // Extract query from a PUT with parameters in the URL.
    // test: http://localhost:8080/put_req?id=1&manufactureDate=1988

    console.log("updateManufactureDate");
    let found = false;

    // Extract request
    let id = request.query.id;
    let newManufactureDate = request.query.manufactureDate;

    // Replace manufacture date if we find an engine with the same ID in our list.
    for (let i=0; i<enginesList.length; i++)
    {
        if (enginesList[i].id == id)
        {
            enginesList[i].manufactureDate = newManufactureDate;
            found = true;
            writeListOnDisk(enginesList,enginesListFilename);
            console.log("Updated manufacture date. ");
            response.sendStatus(200);
        }
    }
    if (found == false)
    {
        console.log("Error: engine id not in database.");
        response.sendStatus(418);
        // response.status(404).send("Error: engine id not in database.");
    }

    console.log(enginesList);
}

// to fix the error: 'fetch: access-control-allow-origin'
app.use(cors({
    origin: '*'
}));

app.listen(
    PORT,
    () => appStartup()
)

app.get( 
    endpoint1, 
    (req,res) => getEngineList(res) 
);

app.put(
    endpoint2,
    (req, res) => updateManufactureDate(req, res)
)
