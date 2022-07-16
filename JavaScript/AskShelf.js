import HTMLObject from './HTMLObject.js'
import { blurBlock, shelves, films, filmInfo } from './Creater.js'

class AskShelf extends HTMLObject{
    constructor(){
        super(`.ask-shelf`)
    }

    changeBody(){
        this.body = document.querySelector(`.ask-shelf`)
    }

    render(index){
        filmInfo.remove()
        
        const HTML = `
            <div class="ask-shelf" data-index="${index}" >
                <div class="ask-shelf__content">
                    <form name="addShelf" class="ask-shelf__form" action="#">

                        ${this.renderRadio()}

                        <div class="ask-shelf__button">
                            <button data-action="cancel">Відмінити</button>
                            <button data-action="add">Додати</button>
                        </div>
                     </form>
                 </div>
            </div>
            `
    
            document.body.insertAdjacentHTML(`afterbegin`,HTML)
            this.changeBody()
            this.addEvents()
            blurBlock.create(this)
        
    }

    renderRadio(){
        return shelves.shelves.reduce((pv,shelf) =>{
            return pv + `<div class="ask-shelf__input">
                            <input name="shelf" value="${shelf.id}" id="${shelf.id}" type="radio">
                                <label for="${shelf.id}">
                                    <div class="ask-shelf__check"></div>
                                    <span>${shelf.name}</span>
                                </label>
                        </div>`
        },``)
    }
    
    addEvents(){
        const buttons = [...this.body.querySelectorAll(`button`)]

        buttons.forEach(button => {
            button.addEventListener(`click`,this.events.bind(this))
        })
    }

    events(event){
        event.preventDefault()
        const target = event.target
        const action = target.dataset.action

        if(action === 'cancel') this.remove()
        if(action === 'add') this.addToShelf()
    }

    addToShelf(){
        const radioButtons = document.forms.addShelf.shelf
        const shelvesRadio = radioButtons.length ? [...radioButtons] : [radioButtons]

        for(let i = 0; i < shelvesRadio.length; i++){
            if(shelvesRadio[i].checked){
                const shelfId = shelvesRadio[i].value
                const index = this.body.dataset.index
                const movieObj = films.movies[index]
                shelves.addMovie(shelfId, movieObj)
                this.remove()
            }
        }
    }

    remove(){
        const index = this.body.dataset.index
        blurBlock.remove()
        filmInfo.render(films.movies[index],index)
        super.remove()
    }

}

export default AskShelf;