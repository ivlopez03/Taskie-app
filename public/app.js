


const getTasks = async () => {
    const response = await fetch('/cards')
    const cards = await response.json()
    //Create template to print list of tags
    const template = card => `
    <div class="card card_medium">
        <div id="date">${card.date}</div>
        <p>${card.text}</p>
    </div>
       
    `
    const cardList = document.getElementById('card-container')
    cardList.innerHTML = cards.map(card => template(card)).join('')
}


const getTagsList = async ()=>{
    const tag_checkbox = document.getElementsByTagName('input');
    const tagList = [];
        for(let i=0; i<tag_checkbox.length; i++){
            if (tag_checkbox[i].checked){
                tagList.push(tag_checkbox[i].value);
            }
        }
    return tagList
}

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
            "tags": await getTagsList()
        }

        await fetch('/cards',{
            method: 'POST',
            body: JSON.stringify(taskForm),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(taskForm)
        cardForm.reset()   
    }

}


const getTags = async () => {
    const response = await fetch('/tags')
    const tags = await response.json()
    //Create template to print list of tags
    const template = tag => `
        <li style="background-color:${tag.background_color};border-color:${tag.border_color};color:${tag.text_color}">
            <label class="tag-container">${tag.tag}
                <input type="checkbox" id="checkbox-input" name="${tag.tag}" value="${tag._id}">
                <span class="checkmark"></span>
            </label>
        </li>
    `
    const tagList = document.getElementById('tags-list')
    tagList.innerHTML = tags.map(tag => template(tag)).join('')
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
        console.log(tags_data)
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








window.onload = ()=>{
    taskFormListener();
    addFormListener();
    getTasks();
    getTags();

    
}