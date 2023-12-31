import { connect,Card } from "../database.js";

connect.database_connect;



//Create a new Card
const createCard = async (req,res) =>{
    const {body} = req
    try {
        const new_card = new Card({date: body.date ,text: body.text, tags: body.tags,isCompleted: body.isCompleted})
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

const getCompletedCards = async (req,res) =>{
    //const iscompleted= req.query.isCompleted;
    //console.log(iscompleted)
    const cards = await Card.find({isCompleted: true});
    //console.log(cards)
    res.json(cards);
}
const getOpenCards = async (req,res) =>{
    const cards = await Card.find({isCompleted: false});
    //console.log(cards)
    res.json(cards);
}


const getCardbyID = async (req,res) =>{
    try {
        const card = await Card.findById({_id: req.params.id}, 'tags')
        console.log(card)
        res.json(card)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
    
}


//Edit an existing Card
const editCard = async (req,res) =>{
    const{id} = req.params
    const card = await Card.findOne({_id:id});
    Object.assign(card, req.body)
    card.save()
    console.log(card);
    res.sendStatus(200)
}

//example:
//editCard({text:'Hello Karla'},{tags:['UI/UX']});

const deleteCard = async (req,res)=>{
    const{id} = req.params
    const card = await Card.findOne({_id:id})
    if(card){
        card.remove()
    }
    res.sendStatus(204)
}

//deleteCard({text:'Hello Karla'});

export const card = {
    GET: getCards,
    POST: createCard,
    PUT: editCard,
    DELETE: deleteCard,
    GET_BY_ID: getCardbyID,
    GET_COMPLETED_TASKS: getCompletedCards,
    GET_OPEN_TASKS: getOpenCards,
}