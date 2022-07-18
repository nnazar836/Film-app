import HTMLObject from './HTMLObject.js'
import { blurBlock, films, filmInfo, coments } from './Creater.js'

class ComentEditor extends HTMLObject{
    constructor(){
        super(`.coment-editor`)
    }

    render(index, editingComent,comentText){
        filmInfo.remove()

        let body = document.createElement(`div`)
        body.classList.add(`coment-editor`)
        body.dataset.index = index
        body.dataset.editingComent = editingComent || `false`

        body.innerHTML = `
        <form name="comentForm" class="coment-editor__form" action="#">

            <textarea class="coment-editor__textarea" name="coment">${editingComent ? comentText : ``}</textarea>

            <div class="coment-editor__buttons-container">
                <button class="coment-editor__cancel-button" data-action="cancel">Відмінити</button>
                <button class="coment-editor__coments-button" data-action="${editingComent >= 0 ? `edit` : `coments`}">${editingComent >= 0 ? `Редагувати` : `Коментувати`}</button>
            </div>

        </form>
        `

        document.body.append(body)
        this.changeBody()
        this.addEvents()
        blurBlock.create(this)
    }

    changeBody(){
        this.body = document.querySelector(`.coment-editor`)
    }

    addEvents(){
        const buttons = this.body.querySelector(`.coment-editor__buttons-container`)
        buttons.addEventListener(`click`, this.events.bind(this))
    }

    events(event){
        event.preventDefault()
        const target = event.target
        const action = target.dataset.action

        if(action === `cancel`) this.remove()
        if(action === `coments`) this.addComent()
        if(action === `edit`) this.editComent();
    }

    addComent(){
        let coment = document.forms.comentForm.coment.value.trim()
        const comentCheck = coment.replace(/ /gm,``)
        if(!comentCheck){
            alert(`Ви не ввели жодного тексту`)
            return false
        } else {
            const index = this.body.dataset.index
            films.addComent(index, coment)
            this.remove()
        }
        

    }

    editComent(){
        let coment = document.forms.comentForm.coment.value.trim()
        const comentCheck = coment.replace(/ /gm,``)
        if(!comentCheck){
            alert(`Ви не ввели жодного тексту`)
            return false
        } else {
            const comentIndex = this.body.dataset.editingComent
            coments.edit(comentIndex,coment)
            this.remove()
        }
    }

    remove(){
        const index = this.body.dataset.index
        blurBlock.remove()
        filmInfo.render(films.movies[index],index)
        super.remove()
    }
}

export default ComentEditor;