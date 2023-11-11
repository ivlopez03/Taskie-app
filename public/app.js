

let tags_array = [] ;

async function renderTags(tags_array){
    const tagList = document.getElementById('tags-list')
    tagList.innerHTML = ` `
    tags_array.forEach(tag =>{
        tagList.innerHTML += tag
    })   
    if(tags_array.length == 0){
        const message = document.getElementById('tag-message');
        message.innerHTML = `<p id="message">Add custom tags</p>`
        const text = document.getElementById('text-drag')
        text.classList.remove('show-message')
    }
    draggActive()
}





async function renderTagsCard(card){
    const tags_dropped = document.querySelector(`.tag-${card}`)
    tags_dropped.parentNode.removeChild(tags_dropped)
    const response = await fetch(`/cards/${card}`)
    //fetch to get card by its id 
    const cards = await response.json()
    const tag_array = cards.tags //Get tags array from card json
    const tagList = document.getElementById(`tags-card-list-${card}`)
    tagList.innerHTML = ` `
    
    // foreach to go through tags and return them into the html card.    
    tag_array.forEach(async tag => {
        const response = await fetch(`/tags/${tag}`)
        const tags = await response.json()
        tagList.innerHTML += `
            <li class="tags-card-cont card-id-${card}" style="background-color:${tags.background_color};border-color:${tags.border_color};color:${tags.text_color};cursor:none;"  id="${tags._id}" >
                <label class="tag-container  tag " >${tags.tag}</label>
            </li>
        `
    })
    
}



//_______________________________________________________________________________________CARD SUBMENU OPTIONS______.
//Function to display submenu options for each card.
const openMenu = async (cardID)=>{
    const card_format = `show-menu-${cardID}`
    const card_menu_format = `menu-open-${cardID}`
    const menuCard = document.getElementById(card_format)
    const menuOptions = document.getElementById(card_menu_format);

    if(menuCard.checked == true ){
        menuOptions.style.display = "block";
    }else{
        menuOptions.style.display = "none";
    }
}

async function startTask(cardID){
    const started_task = document.getElementById(`card-header-${cardID}`);
    const card_menu_format = `menu-open-${cardID}`
    const menuOptions = document.getElementById(card_menu_format);
    started_task.innerHTML += `<div id="${cardID}"  class="started-task">
                                    <p>IN PROGRESS</p>
                                </div>`

    menuOptions.style.display = "none";

    const card = {
        "active": true
    }

    //fetch to edit database with the new tags added by dragging and dropping;
    await fetch(`/cards/${cardID}`,{
        method: 'PUT',
        body: JSON.stringify(card),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const start_button = document.getElementById(`start-task-${cardID}`)
    start_button.parentNode.removeChild(start_button)
}

async function deleteCard(cardID) {
    const card_menu_format = `menu-open-${cardID}`
    const menuOptions = document.getElementById(card_menu_format);
    menuOptions.style.display = "none";
    const confirm_button = document.getElementById('confirm-deletion-btn')
    const cancel_button = document.getElementById('cancel-deletion-btn')
    const delete_box = document.getElementById('confirm-container')
    const deleted_message = document.getElementById('card-deleted-message')
    delete_box.classList.add('show');

    confirm_button.addEventListener('click',async function(e){
        e.preventDefault();
        const card = document.getElementById(`${cardID}`)
        await fetch(`/cards/${cardID}`,{
            method: 'DELETE',
        })
        card.parentNode.removeChild(card)
        delete_box.classList.remove('show');

        deleted_message.innerHTML += `<p> The Task has been deleted successfully ! </p>`;
        setTimeout(function(){
            deleted_message.innerHTML = ' ';
        }, 3000);
        
    })

    cancel_button.addEventListener('click', function(e) {
        e.preventDefault();
        delete_box.classList.remove('show');
    })

}

//_______________________________________________________________________________________GET CARDS FROM DATABASE____.
// getTasks() async Function to get task from database and return html elements in order to display them.
const getTasks = async () => {
    //Create fetch to API
    const response = await fetch('/cards')
    const cards = await response.json() //get response in json format.
    

    //Create HTML template to print list of taks
    const template = card => `
    <div class="card ${getCardSize(card.text.length)}  draggable-container  card-${card._id}" id="${card._id}">
        <div class="card-header" id="card-header-${card._id}">
            <div id="date">${card.date}</div>
            <label class="menu-container" >
            <input type="checkbox" id="show-menu-${card._id}" onclick=openMenu('${card._id}') class="menu-open-checkbox" ><img src="menu-puntos.png" style="width:20px"></img></button></input>
            </label>
            
        </div>
        <p>${card.text}</p>
        <div id="tags-card-list-${card._id}" class="tags-card-list"></div>
        <div id="menu-open-${card._id}" class="menu-open" style="display:none">
              <menu class="menu-options" id="menu-options">
                    <li id="start-task-${card._id}" onclick=startTask('${card._id}') ><img src="play (5).png" >Start</li>
                    <li id="close-task-${card._id}" onclick=deleteCard('${card._id}') ><img src="cross (1).png"></img>Close Task</li>
                    <li id="edit-task-${card._id}"><img src="file-edit (3).png"></img>Edit</li>
                </menu>
        </div>
    </div>
    `

    //Iterate through the cards.map to add each card to the html class
    const cardList = document.getElementById('card-container')
    cardList.innerHTML = cards.map(card => template(card)).join('')


    //Conditional to display message when there are no cards in database.
    if(cards.length == 0){
        const message = document.getElementById('empty-message');
        message.innerHTML = `<p>Hey there! It's a great time to kickstart your day by creating a new task. ☄️ What's on your to-do list?</p>`
    }else{
        const message = document.getElementById('empty-message');
        message.innerHTML = ``;

    }
    //callback getCardTags() to display tags linked to the card
    getCardTags(cards)

    //callback to allow draggable actions on the cards.
    draggableCardActive()

    cards.forEach(async card => {
        if (card.active == true){
            const started_task = document.getElementById(`card-header-${card._id}`);
            const start_button = document.getElementById(`start-task-${card._id}`)
            const card_menu_format = `menu-open-${card._id}`
            const menuOptions = document.getElementById(card_menu_format);
            started_task.innerHTML += `<div id="${card._id}"  class="started-task">
                                    <p>IN PROGRESS</p>
                                </div>`
            start_button.parentNode.removeChild(start_button)
            
        }
    })

    
}

//_________________________________________________________________________________________GET TAGS FROM DATABASE___.
const getTags = async () => {
    const response = await fetch('/tags')
    const tags = await response.json()

    //Conditional to display a message when there are no tags
    if(tags.length == 0){
        const message = document.getElementById('tag-message');
        message.innerHTML = `<p id="message">Add custom tags</p>`
    }else{
        const message = document.getElementById('tag-message');
        message.innerHTML = `<p id="text-drag" class="text-drag show-message" ><span><img src="curved-arrow (1).png" alt="curve-arrow" width="30px"></span>Assign tags to cards by dragging and dropping them onto the cards.(max. 5 tags per card)</p>`
    }
    
    
    //Create template to print list of tags
    const template = tag => `<li draggable="true"  style="background-color:${tag.background_color};border-color:${tag.border_color};color:${tag.text_color}" class="draggable" id="${tag._id}" ><label class="tag-container  tag" id="tag-label" >${tag.tag}</label></li>`
    const tagList = document.getElementById('tags-list')
    tagList.innerHTML = tags.map(tag => template(tag)).join('')

    tags_array = []
    tags.forEach(tag =>{
       tags_array.push(template(tag))
    })
    //console.log(tags_array)

    
    //Callback to add draggable effect to tags
    draggActive()
    

    
}


//_____________________________________________________________________________________GET CARD-TAGS FROM DATABASE__.
//async funtion to get cards linked to cards from database and display them.
const getCardTags = async  (cards) => { 
    cards.forEach(async card =>{
        const res = await fetch(`/cards/${card._id}`)
        //fetch to get card by its id 
        const cards = await res.json()
        const tag_array = cards.tags //Get tags array from card json
        if(tag_array.length > 0){
            // foreach to go through tags and return them into the html card.    
            tag_array.forEach(async tag => {
            
                const response = await fetch(`/tags/${tag}`)
                const tags = await response.json()
                if(tags != null){
                    const tagList = document.getElementById(`tags-card-list-${card._id}`)
                    tagList.innerHTML += `
                        <li class="tags-card-cont card-id-${card._id}" style="background-color:${tags.background_color};border-color:${tags.border_color};color:${tags.text_color};"  id="${tags._id}" >
                            <label class="tag-container tag " style="cursor:auto;" >${tags.tag}</label>
                        </li>
                    `   
                }
              
                
            })

        }

    })
}


//___________________________________________________________SAVE CARD TAGS IN DATABASE AFTER DRAG & DROP ACTION ___.
async function addTagCard(cardId){
    const response = await fetch(`/cards/${cardId}`)
    const tag = await response.json()
    const tags_array = tag.tags
   
    const card_tags = document.getElementsByClassName(`tag-${cardId}`);
    //create array to get existing tags
    const tagList = [...card_tags].map(tag => tag.id)
    //compare if tag is not repeated ,then proceed to add to the main tags array
    tagList.forEach(tag =>{
        if (tags_array.includes(tag) == false){
            tags_array.push(tag)
        }
    })
   
    const cardTags = {
        "_id": cardId,
        "tags": tags_array
    }
    //fetch to edit database with the new tags added by dragging and dropping;
    await fetch(`/cards/${cardTags._id}`,{
        method: 'PUT',
        body: JSON.stringify(cardTags),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    renderTagsCard(cardId)
    

}


//___________________________________________________________________________________________________DELETE TAGS FROM NAVIGATION__.
const deleteTagsCard = async (tagID)=>{
    const message_container =document.getElementById('delete-message'); 
    await fetch(`/tags/${tagID}`,{
        method: 'DELETE'
    }).then(() => {
        message_container.innerHTML = `<p>The tag has been deleted successfully !</p>`
        setTimeout(function(){
            message_container.innerHTML = '';
        }, 3000);

        getTags()

    }).then(async () => {
        const tag_deleted = tagID
        const response = await fetch('/cards')
        const cards = await response.json()
        cards.forEach(async card =>{
            const res = await fetch(`/cards/${card._id}`)
            //fetch to get card by its id 
            const cards = await res.json()
            let tagList = cards.tags
            //console.log(tag_deleted)
            //console.log(tagList)
            if(tagList.includes(tag_deleted) == true){
                const new_tagList = tagList.filter(tag => tag != tag_deleted)
                //console.log(new_tagList)
                const tagUpdate = {
                    "tags": new_tagList
                }

                await fetch(`/cards/${card._id}`,{
                    method: 'PUT',
                    body: JSON.stringify(tagUpdate),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }
        })

    })
    
}



//______________________________________________________________________________________________________TASK FORM___.
const taskFormListener = ()=>{
    const cardForm = document.getElementById('card-form'); 
    cardForm.onsubmit = async (e) => {
        e.preventDefault();
        //instance Form Data,Then we extract values in object format from the obtained form data.
        const formData = new FormData(cardForm)
        const card_data = Object.fromEntries(formData.entries())
        const getTask =  card_data.task
        const date = new Date(Date.now());//get instance of Date
        const date_format = date.toLocaleDateString(); // format date response

        const taskForm = {
            "date": date_format,
            "text": getTask,
            "tags": [],
            "active": false
        }

        await fetch('/cards',{
            method: 'POST',
            body: JSON.stringify(taskForm),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        cardForm.reset()
        getTasks();   
    }
}


//______________________________________________________________________________________________________TAGS FORM___.
const addTagsFormListener = ()=>{
    const tagForm = document.getElementById('create-tags-form');
    const tagname = document.getElementById('tagname');
    const tag_demo = document.getElementById('pre-tag');
    const backg_color = document.getElementById('backg-color');
    const bor_color = document.getElementById('bor-color');
    const text_color = document.getElementById('text-color');
     

    tagname.addEventListener('keyup', () => {
        tag_demo.innerHTML = `<p id='taggie' style="background-color:${backg_color.value};border-color:${bor_color.value};color:${text_color.value};">${tagname.value}</p>`
    })
    backg_color.addEventListener('change', () => {
        const taggie = document.getElementById('taggie');
        taggie.style.backgroundColor = `${backg_color.value}`;
    })
    bor_color.addEventListener('change', () => {
        const taggie = document.getElementById('taggie');
        taggie.style.borderColor = `${bor_color.value}`;
        
    })
    text_color.addEventListener('change', () => {
        const taggie = document.getElementById('taggie');
        taggie.style.color = `${text_color.value}`;
        
    })
   

    tagForm.onsubmit = async (e) => {
        e.preventDefault();
        const tag_demo = document.getElementById('pre-tag');
        //instance Form Data,Then we extract values in object format from the obtained form data.
        const formData = new FormData(tagForm)
        const tags_data = Object.fromEntries(formData.entries())

        await fetch('/tags',{
            method: 'POST',
            body: JSON.stringify(tags_data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        tagForm.reset()
        tag_demo.innerHTML = `<span>Tag preview</span>`
        getTags()  
    }

}




//__________________________________________________________________________________ADD DRAGGABLE EFFECT TO CARDS___.
//async function to active draggable effect to the card container.
async function draggableCardActive(){
    const container_draggable = document.getElementsByClassName('draggable-container')
    const containersList = Array.from(container_draggable) //convert HTML COLLECTION to Array
    
    containersList.forEach(container => {
        const existingTags = document.getElementsByClassName(`card-id-${container.id}`)

        container.addEventListener('dragover', (e) =>{
            e.preventDefault();
            container.addEventListener('drop', (e) =>{ 
                e.preventDefault();
                //Create an array of existing tags
                const existingTagsList = [...existingTags].map(tag => tag.id)
                // add aditional class to cards that contains the .dragging class in order to assign unique tag id
                const draggable = document.querySelector('.dragging')
                draggable.classList.add(`tag-${container.id}`)


                //Conditional to verify the tags dropped are not repeated and there are less than 5 tags.
                if(existingTagsList.includes(draggable.id) == false && existingTagsList.length  < 5){
                    container.appendChild(draggable)

                    
                }
            })  
        })
        //event listener for call a function to save card tag in the database 
        container.addEventListener('dragend', (e) =>{
            e.preventDefault();
            addTagCard(container.id)

            const text = document.getElementById('tag-message')
            text.innerHTML = ``
            
        });
    })
}

//___________________________________________________________________________________ADD DRAGGABLE EFFECT TO TAGS___.
async function draggActive(){
    const draggables = document.getElementsByClassName('draggable');
    const list = [...draggables]
    
    list.forEach(draggable => {
        draggable.addEventListener('dragstart', async () => {
            draggable.classList.add('dragging')
            draggable.classList.add('tags-card-cont')
            const tag = document.getElementById('tag-label')
            tag.style.cursor = 'grabbing'
            //console.log('drag start')
        })

        draggable.addEventListener('dragend', (e) => {
            e.preventDefault();
            draggable.classList.remove('dragging')
            renderTags(tags_array)
        })
    })


}

//_______________________________________________________________________FUNCTION FOR ADDING SIZE VALUE TO CARDS___. 
const card_type = ['card_small', 'card_medium', 'card_large']
function getCardSize (value_size){
    if (value_size >= 0 && value_size < 63){
        return  card_type[0]
    }
    else if (value_size >= 63 && value_size < 102) {
        return card_type[1]
    }
    else if (value_size >= 102 && value_size < 230) {
        return card_type[2]
    }
    else { return card_type[0]}

}


//const getTagsList = async ()=>{
//    const tag_checkbox = document.getElementsByTagName('input');
//    const tagList = [];
//        for(let i=0; i<tag_checkbox.length; i++){
//            if (tag_checkbox[i].checked){
//                tagList.push(tag_checkbox[i].value);
//            }
//        }
//    return console(tagList)
//}







//Wait until window is loaded and then run the callback.
window.onload = ()=>{
    taskFormListener();
    addTagsFormListener();
    getTasks();
    getTags();

  
}