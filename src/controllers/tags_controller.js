import { connect,Tag } from "../database.js";

connect.database_connect;



//Create a new Card
const createTag = async (req,res) =>{
    const {body} = req
    try {
        const new_tag = new Tag({tag: body.tag ,background_color: body.background_color,border_color: body.border_color,text_color: body.text_color})
        const saveTag = await new_tag.save();
        res.status(201).send(`Creating tag: ${new_tag._id}` )

    } catch (error) {
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
    const tag = await Tag.findOne({_id: req.params.id})
    console.log(tag)
    res.json(tag)
    
    
}


const deleteTag = async (req,res,)=>{
    
    const tag = await Tag.findOne({_id: req.params.id})
    console.log(tag)

    await Tag.deleteOne(tag)
    res.sendStatus(204)
    console.log(`the tag ${tag._id} was deleted`)
    
    
}

const updateTag = async (req,res)=>{
    const tag = await Tag.findOne({_id: req.params.id})
    if (tag) {
        Object.assign(tag,req.body)
        await tag.save()
        res.sendStatus(204)
    }
}




export const tag = {
    GET: getTags,
    POST: createTag,
    DELETE: deleteTag,
    GET_BY_ID: getTagsbyID,
    UPDATE: updateTag
}