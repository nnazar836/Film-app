import HTMLObject from './HTMLObject.js'
import { blurBlock, shelves, } from './Creater.js'


class ShelfEditor extends HTMLObject{
    constructor(){
        super(`.shelf-editor`)
        this.photoUrlInput = this.body.querySelector(`.shelf__editor-form`).photoInput
        this.photoSection = this.body.querySelector(`[name="photo"]`) 
        this.nameInput = this.body.querySelector(`.shelf__editor-form`).nameInput
        this.nameSection = this.body.querySelector(`[name="name"]`)
        this.img = this.body.querySelector(`.shelf-editor__photo-container img`)
        this.executeButton = this.body.querySelector(`.shelf-editor__button`)
    }

    start(){
        this.executeButton.addEventListener(`click`,this.execute.bind(this)) // adds functional of execute button

        this.photoUrlInput.addEventListener(`blur`, this.checkPhotoInput.bind(this)) // adds functional of IMG input
        this.photoUrlInput.addEventListener(`focus`, this.deleteWaring.bind(this)) //adds functional of IMG input

        this.nameInput.addEventListener(`blur`, this.checkNameInput.bind(this)) // adds functional of name input
        this.nameInput.addEventListener(`focus`, this.deleteWaring.bind(this)) // adds functional of name input
    }

    show(name, photoUrl, id){ // shows us editor
        // it can do two actions if we edit the shelf, 
        // it shows us an editor with info of the shelf, 
        // and if we add a shelf it offers us a clean editor
        
        this.deleteWaring() // deletes warnings if they exist 
        super.show()

        blurBlock.create(this) // adds blur block on the background 

        this.body.dataset.shelf_id = id ? id : `` // adds an ID of the shelf we'll edit, if there isn't ID, we create a new shelf
        this.photoUrlInput.value = photoUrl ? photoUrl : '' //adds photo URL into the input
        this.img.src = photoUrl ? photoUrl : 'Photo/notfound1.png' //adds photo URL into img the src
        this.nameInput.value = name ? name : '' //adds name of the shelf into the input
    }

    createWaring(text){ // creates waring block
        let waring = document.createElement(`p`)
        waring.classList.add(`shelf-editor__waring`)
        waring.textContent = text
        return waring;
    }

    deleteWaring(event){ // deletes warnings

        if(event){ // deletes warning of the closest section when we click on some input

            let section = event.target.closest(`section`) // gets the closest section
            let waring = section.querySelector(`.shelf-editor__waring`) // gets the waring

            if(section === this.nameSection) this.nameInput.style.cssText = `border: 1px solid grey;` //if it's name section it turns off the red border
            if(waring) waring.remove() // deletes the waring

            let waringTwo = section.querySelector(`.shelf-editor__waring`) // gets the new the waring if is exists
            if(waringTwo) this.deleteWaring()// checks if exist one more waring if yes it deletes it

        } else { //deletes all warnings if we click on the execute button

            let waring = this.body.querySelector(`.shelf-editor__waring`) // gets the waring
            if(waring) waring.remove() // deletes the waring
    
            this.nameInput.style.cssText = `border: 1px solid grey;`  // it turns off the red border of the name section
            
            let waringTwo = this.body.querySelector(`.shelf-editor__waring`) // gets the new waring if is exists
            if(waringTwo) this.deleteWaring() // checks if exist one more waring if yes it deletes it
        }

    }

    checkPhotoInput(){ // checks the photo
        this.img.src = this.photoUrlInput.value || `Photo/notfound1.png`
        let waring = this.createWaring(`Якщо фото не зявилося то URL пошкоджено, спробуйте інше`)
        this.photoSection.append(waring)
    }

    checkNameInput(){ // checks the name
        let name = this.nameInput.value //get the name value

        name = name.replace(/ /gm,``)// makes sure that there are some symbols
        
        let waring = this.createWaring(`Вкажіть ім'я`) // creates waring block
        waring.style.cssText = `color: red;` // waring block it red
        
        if(!name){ //do if something is wrong with the name 
            this.nameSection.append(waring)
            this.nameInput.style.cssText = `border: 1px solid red;`
            return false // something is wrong
        }
        return true // everything is ok
    }

    execute(event){
        event.preventDefault()
        this.deleteWaring() // delete the previous warnings
        this.checkPhotoInput() // checks the photo

        if(this.checkNameInput()){ // checks name and do if everything is ok
            let shelfId = this.body.dataset.shelf_id

            if(shelfId) this.edit(shelfId)
            else this.create()
            this.hide()
            blurBlock.remove()

        } else{ //do if something is wrong with inputs

            alert(`Перевірте полля вводу інформації`)

        }

    }

    edit(id){
        let shelf ={}
        shelf.name = this.nameInput.value
        shelf.photo = this.photoUrlInput.value

        shelves.editShelf(shelf,id)
    }

    create(){
        let newShelf = {}
        newShelf.name = this.nameInput.value
        newShelf.photo = this.photoUrlInput.value
        newShelf.movies = []
        newShelf.id = shelves.getNewId()
        newShelf.async = false

        shelves.addShelf(newShelf)
    }

    remove(){
        super.hide()
        blurBlock.remove()
    }
}

export default ShelfEditor;