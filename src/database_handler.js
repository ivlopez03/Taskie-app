import mongoose from "mongoose";
import 'dotenv/config'

mongoose.connect(process.env.DATABASE_CONNECTION).catch(error => console.loga(error));



//Database Model
const Card = mongoose.model('Card',{
    date: String,    
    text: String,
    tags: Array,
})


//Create a new Card
const createCard = async () =>{
    const card = new Card({date:'10/21/22',text:'Hello Karla',tags:['UI/UX design','Bootcamp']})//create an instance 
    const saveCard = await card.save() //save returns a promise so we use await for this statement.
    console.log(saveCard)
}

//createCard()


//Get an array of all cards from database 
const getCards = async () =>{
    const cards = await Card.find();
    console.log(cards)
}
//getCards()

