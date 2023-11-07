import mongoose from "mongoose";
import 'dotenv/config'

export const connect  = {
    database_connect: mongoose.connect(process.env.DATABASE_CONNECTION).catch(error => console.log(error))
}

//Cards model
export const Card = mongoose.model('Card',{
    date: {type: String,required: true},    
    text: {type: String,required: true},
    tags: {type: Array,required: true},
    active: {type: Boolean},
});

//Tags model 
export const Tag = mongoose.model('Tag',{
    tag:{type: String,required: true},
    background_color:{type: String,required: true},
    border_color:{type: String,required: true},
    text_color:{type: String,required:true},

});

export default mongoose;