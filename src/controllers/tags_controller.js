import { connect,Tag } from "../database.js";

connect.database_connect;



//Create a new Card
const createTag = async (req,res) =>{
    const {body} = req
    try {
        const new_tag = new Tag({tag: body.tag ,background_color: body.background_color,border_color: body.border_color,text_color: body.text_color})
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
const getTagsbyID = async (req,res) =>{
    const tag = await Tag.findById({_id: req.params.id})
    console.log(tag)
    res.json(tag)
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
    GET_BY_ID: getTagsbyID
}