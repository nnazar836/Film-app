import HTMLObject from './HTMLObject.js'
import { shelfEditor } from './Creater.js'


class SideBar extends HTMLObject{
    constructor(){
        super(`.aside`)
        this.backArrow = this.body.querySelector(`.aside__arrow-back`)
        this.addShelfButton = this.body.querySelector(`.aside__add-bhelf-button`)
    }

    start(){
        this.backArrow.addEventListener(`click`, this.onOff.bind(this)) //Lets us close aside on the phone
        this.addShelfButton.addEventListener(`click`, this.addShelf.bind(this)) //Lets us add a new shelf
    }

    onOff(event){
        if(event) event.stopPropagation()
        this.body.classList.toggle(`aside_on`)
    }

    addShelf(event){
        event.stopPropagation()
        shelfEditor.show()
    }

    autoOff(){
        const mobilePoint = 1000
        if(window.innerWidth <= mobilePoint) this.onOff()
    }
}


export default SideBar;