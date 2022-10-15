const app = require('express')();
const PORT = 8080;
const endpoint1 = '/engines';

// function sendEngineList()
// {
//     res.status(200).send(
//        {
//         "id":11,
//         "name":"enginename",
//         "manufDate": 1984
//        }
//     )
// }

app.listen(
    PORT,
    () => console.log(`it's alive on localhost:${PORT}`)
)

// app.get(`$endpoint1`, (req,res)=>sendEngineList() )

app.get('/engines', (req,res) => {
    res.status(200).send(
        {
        id:11,
        name:"enginename",
        manufDate: 1984
        }
    )   
});