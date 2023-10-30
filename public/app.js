
let task_cards_array =[];
let tag_cards_array = [];
let tags_array = [];


//CARD SUBMENU OPTIONS----------------------------------------------------------------
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
//------------------------------------------------------------------------------------


// getTasks() Function to get task from database and return html elements in order to display them.
const getTasks = async () => {
    //Create request to the API with fetch
    const response = await fetch('/cards')
    const cards = await response.json() //get response in json format.
    console.log(cards)
    //Create HTML template to print list of taks
    const template = card => `
    <div class="card ${getCardSize(card.text.length)}  draggable-container  card-${card._id}" id="${card._id}">
        <div class="card-header ">
            <div id="date">${card.date}</div>
            <label class="menu-container" >
            <input type="checkbox" id="show-menu-${card._id}" onclick=openMenu('${card._id}') class="menu-open-checkbox" ><img src="menu-puntos.png" style="width:20px"></img></button></input>
            </label>
            
        </div>
        <p>${card.text}</p>
        <div id="tags-card-list-${card._id}" class="tags-card-list"></div>
        <div id="menu-open-${card._id}" class="menu-open" style="display:none">
              <menu class="menu-options" id="menu-options">
                    <li><img src="play (4).png" >Start</li>
                    <li><img src="cross (1).png"></img>Close Task</li>
                    <li><img src="file-edit (3).png"></img>Edit</li>
                    <li><img src="trash (3).png"></img>Delete</li>
                </menu>
        </div>
    </div>
    `


    const cardList = document.getElementById('card-container')
    cardList.innerHTML = cards.map(card => template(card)).join('')

    
    if(cards.length == 0){
        const message = document.getElementById('empty-message');
        message.innerHTML = `<p>Hey there! It's a great time to kickstart your day by creating a new task. 🚀 What's on your to-do list?</p>`
    }

   draggendCardActive()
}

async function getCardTags(){

    const response = await fetch('/cards')
    const cards = await response.json()
    //console.log(cards)

    cards.forEach(async card =>{
        const tagList = document.getElementById(`tags-card-list-${card._id}`)
        tagList.innerHTML = ` `
        //console.log(card._id)
        if(card._id !== null || card._id !== undefined){
            const res = await fetch(`/cards/${card._id}`)
            const tag = await res.json()
            //console.log(tag.tags)
            const tagArray = tag.tags
            tagArray.forEach(async tag => {
                const res_tag = await fetch(`/tags/${tag}`)
                const tags = await res_tag.json()
                //Create template to print list of tags
           
                const tagList = document.getElementById(`tags-card-list-${card._id}`)
                tagList.innerHTML += `
                <li class="tags-card-cont card-id-${card._id}" style="background-color:${tags.background_color};border-color:${tags.border_color};color:${tags.text_color}"  id="${tags._id}" >
                    <label class="tag-container" >${tags.tag}</label>
                </li>
            `
            })
        }

    })

   
}




function draggendCardActive(){
    const container_draggable = document.getElementsByClassName('draggable-container')
    const containersList = Array.from(container_draggable)

    containersList.forEach(container => {
        //console.log(container.id)
        const existingTags = document.getElementsByClassName(`card-id-${container.id}`)
        //console.log(existingTags)

        container.addEventListener('dragover', (e) =>{
            e.preventDefault();
            container.addEventListener('drop', (e) =>{ 
                e.preventDefault();
                const existingTagsList = [...existingTags].map(tag => tag.id)
                //console.log(existingTagsList)
                const draggable = document.querySelector('.dragging')
                draggable.classList.add(`tag-${container.id}`)

                if(existingTagsList.includes(draggable.id) == false && existingTagsList.length  < 5){
                    container.appendChild(draggable)

                    
                }
                
            })
            

        })
        container.addEventListener('dragend', (e) =>{
            e.preventDefault();
            addTagCard(container.id)

        });
        
    })

}



async function addTagCard(cardId){

    const res = await fetch(`/cards/${cardId}`)
    const tag = await res.json()
    const tagArray = tag.tags
   
    const tags = document.getElementsByClassName(`tag-${cardId}`);
    //console.log(tags)
    const newList = tagArray
    let tagList = [...tags].map(tag => tag.id)

    tagList.forEach(tag =>{
        if (newList.includes(tag) == false){
            newList.push(tag)
        }

    })
    
    //console.log(newList)
    //console.log(tagList)
   
   
    const taskForm = {
        "_id": cardId,
        "tags": newList
    }

    //console.log(taskForm)

    await fetch(`/cards/${taskForm._id}`,{
        method: 'PUT',
        body: JSON.stringify(taskForm),
        headers: {
            'Content-Type': 'application/json'
        }

    })
    
    
}




    





//const getTagsList = async ()=>{
//    const tag_checkbox = document.getElementsByTagName('input');
//    const tagList = [];
//        for(let i=0; i<tag_checkbox.length; i++){
//            if (tag_checkbox[i].checked){
//                tagList.push(tag_checkbox[i].value);
//            }
//        }
//    return tagList
//}

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
            "text": getTask
        }

        await fetch('/cards',{
            method: 'POST',
            body: JSON.stringify(taskForm),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        //console.log(taskForm)
        cardForm.reset()
        getTasks();  
        getCardTags(); 
    }

}


const getTags = async () => {
    const response = await fetch('/tags')
    const tags = await response.json()

    


    //Create template to print list of tags
    const template = tag => `
        <li draggable="true"  style="background-color:${tag.background_color};border-color:${tag.border_color};color:${tag.text_color}" class="draggable" id="${tag._id}" >
            <label class="tag-container" >${tag.tag}</label>
        </li>
    `
    const tagList = document.getElementById('tags-list')
    tagList.innerHTML = tags.map(tag => template(tag)).join('')

    
    if(tags.length == 0){
        const message = document.getElementById('tag-message');
        message.innerHTML = `<p>Add custom tags</p>`
    }else{
        const text = document.getElementById('text-drag')
        text.classList.add('show-message')
    }

    draggActive()
}

async function draggActive(){

    const draggables = document.getElementsByClassName('draggable');
    const list = [...draggables]
    

    list.forEach(draggable => {
        draggable.addEventListener('dragstart', async () => {
            draggable.classList.add('dragging')
            draggable.classList.add('tags-card-cont')
            console.log('drag start')
        })

        draggable.addEventListener('dragend', (e) => {
            e.preventDefault();
            draggable.classList.remove('dragging')
            getTags();
        })
    })
    
}



//const tagButtonListener = ()=>{
//    const tag_Button = document.getElementById('addTags-btn');
//    tag_Button.addEventListener('click', async (e)=>{
//        e.preventDefault();
//        getTags()
//    });
//}


const addFormListener = ()=>{
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
        //instance Form Data,Then we extract values in object format from the obtained form data.
        const formData = new FormData(tagForm)
        const tags_data = Object.fromEntries(formData.entries())
        //console.log(tags_data)
        await fetch('/tags',{
            method: 'POST',
            body: JSON.stringify(tags_data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        tagForm.reset()
        getTags()    
    }

}












const card_type = ['card_small', 'card_medium', 'card_large']
//Function for assigning size values to cards. 
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








//Wait until window is loaded and then run the callback.
window.onload = ()=>{

    taskFormListener();
    addFormListener();
    getTasks();
    getTags();
    getCardTags();
  
}