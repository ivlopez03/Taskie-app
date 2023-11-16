import mongoose from "mongoose";
import 'dotenv/config'

let options ={
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export const connect  = {
    database_connect: mongoose.connect(process.env.DATABASE_CONNECTION,options).catch(err => {
        if (err.message.indexOf("ECONNREFUSED") !== -1) {
            console.error("Error: The server was not able to reach MongoDB. Maybe it's not running?");
            process.exit(1);
        } else {
            throw err;
        }
    })
}

//Cards model
export const Card = mongoose.model('Card',{
    date: {type: String,required: true},    
    text: {type: String,required: true},
    tags: {type: Array,required: true},
    active: {type: Boolean},
    isCompleted: {type: Boolean,required: true},
    isPinned:{type: Boolean}
});

//Tags model 
export const Tag = mongoose.model('Tag',{
    tag:{type: String,required: true},
    background_color:{type: String,required: true},
    border_color:{type: String,required: true},
    text_color:{type: String,required:true},

});

export default mongoose;