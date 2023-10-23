







const getTags = async () => {
    const response = await fetch('/tags')
    const tags = await response.json()
    //Create template to print list of tags
    const template = tag => `
        <li style="background-color:${tag.color}">
            <label class="tag-container">${tag.tag}
                <input type="checkbox" id="${tag._id}">
                <span class="checkmark"></span>
            </label>
        </li>
        
        
    `
    const tagList = document.getElementById('tags-list')
    tagList.innerHTML = tags.map(tag => template(tag)).join('')
}

const tagButtonListener = ()=>{
    const tag_Button = document.getElementById('addTags-btn');
    tag_Button.addEventListener('click', async (e)=>{
        e.preventDefault();
        getTags()
    });
}


const addFormListener = ()=>{
    const tagForm = document.getElementById('create-tags-form');
    tagForm.onsubmit = async (e) => {
        e.preventDefault();
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
        getTags()    
    }
}





window.onload = ()=>{
    addFormListener();
    tagButtonListener();

    
}