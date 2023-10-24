import { connect,Card } from "../database.js";

connect.database_connect;



//Create a new Card
const createCard = async (req,res) =>{
    const {body} = req
    try {
        const new_card = new Card({date: body.date ,text: body.text, tags: body.tags})
        const saveCard = await new_card.save();
        console.log(saveCard)
        res.send('Creating card:' + new_card._id)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
        
    } 
}



//Get an array of all cards from database 
const getCards = async (req,res) =>{
    const cards = await Card.find();
    console.log(cards)
    res.json(cards);
}
//getCards()


//Edit an existing Card
const editCard = async (req,res) =>{
    //const card = await Card.findOneAndUpdate(filter,update,{new: true});
    //console.log(res);
    res.send('Updating card');
}

//example:
//editCard({text:'Hello Karla'},{tags:['UI/UX']});

const deleteCard = async (req,res,filter)=>{
    //const card = await Card.findOneAndDelete(filter);
    //console.log('The card has been deleted : ' + card)
    res.send('Deleting card')
}

//deleteCard({text:'Hello Karla'});

export const card = {
    GET: getCards,
    POST: createCard,
    PUT: editCard,
    DELETE: deleteCard,
}