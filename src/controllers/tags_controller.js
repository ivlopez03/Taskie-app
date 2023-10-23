import { connect,Tag } from "../database.js";

connect.database_connect;



//Create a new Card
const createTag = async (req,res) =>{
    const {body} = req
    try {
        const new_tag = new Tag({tag: body.tag ,color: body.color})
        const saveTag = await new_tag.save();
        console.log(saveTag)
        res.send('Creating tag:' + new_tag._id)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
        
    } 
}



//Get an array of all cards from database 
const getTags = async (req,res) =>{
    const tags = await Tag.find();
    console.log(tags)
    res.json(tags);
}


const deleteTag = async (req,res,filter)=>{
    //const tag = await Tag.findOneAndDelete(filter);
    //console.log('The card has been deleted : ' + tag)
    res.send('Deleting tag')
}



export const tag = {
    GET: getTags,
    POST: createTag,
    DELETE: deleteTag,
}