import  express  from "express";
import path from "path";
import indexRoutes from "./routes/index_route.js";
import tagRoutes from "./routes/tags_route.js";



const app = express();
const port = 3000;

//To wokr with json files.
app.use(express.json())

app.use(indexRoutes);
app.use(tagRoutes);

app.listen(port);


//Middleware to handle static files
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/', (req, res) =>{
    //path.resolve() empty return the directory of index.html
    res.sendFile(`${path.resolve()}/index.html`)
})

console.log('Server listening on port 3000');
