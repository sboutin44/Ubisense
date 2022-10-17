/**
    @author Sebastien Boutin

    Install:
        1. Download node js at https://nodejs.org/en/
        2. $ npm init -y
        3. $ npm install express
        4. $ npm install --save cors (this fixes the error: 'fetch: access-control-allow-origin')
        
    Run:
        $ node server.js
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

// default list
let e0 = new Engine(0,'Gas',2020);
let e1 = new Engine(1,'Diesel',2021);
let e2 = new Engine(2,'Electric',2022);
let defaultList = [];
defaultList.push(e0,e1,e2);

/**
 * Store the engine list in a file.
 */
function writeListOnDisk(list,filename)
{
    var json = JSON.stringify(list);
    fs.writeFile(filename, json, function (err) {
        if (err) throw err;
        console.log('Engine list written successfully!');
        });
}

/**
 * Read an engine list from a file in the JSON format. 
 * If the file doesn't exist we use the "defaultList".
 */
function readListFromDisk(filename)
{
    let list = [];

    try {
        rawList = fs.readFileSync(filename,'utf-8');
        list = JSON.parse(rawList);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found! Loading default list.');
            list = defaultList;
        } 
        else {
            throw err;
        }
    }

    return list;
}

/**
 * Does various initializations when the server app starts.
 */
function appStartup()
{
    console.log(`Listening on http://localhost:${PORT}`);

    // Load the engine list file if it exists.
    enginesList = readListFromDisk(enginesListFilename);
    console.log(enginesList);
}

function getEngineList(response)
{
    response.status(200).send(enginesList)   
}

/**
 * Update an engine manuf. date using the query parameters from a PUT request.
 */
function updateManufactureDate(request, response)
{
    let found = false;

    // Extract the request data.
    let id = request.query.id;
    let newManufactureDate = request.query.manufactureDate;

    // Replace the manufacture date if we find an engine with the same ID in our list.
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
        response.sendStatus(404);
    }

    console.log(enginesList);
}

// This fix the error: 'fetch: access-control-allow-origin', and allow my client.html to sent GET and PUT requests.
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