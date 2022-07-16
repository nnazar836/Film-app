import { shelves, comentEditor } from './Creater.js'

class Coments {
    constructor(){
        this.coments = []
        this.HTMLBodies = [...document.querySelectorAll(`.coment`)]
    }

    changeComents(array){
        this.coments = array
    }

    changeHTMLBodies(){
        this.HTMLBodies = [...document.querySelectorAll(`.coment`)]
    }

    renderComents(comentsArr){
        if(!comentsArr) return ``

        this.changeComents(comentsArr)
        setTimeout(this.changeHTMLBodies.bind(this, 100))

        setTimeout(this.addEvents.bind(this, 100)) // we use setTimeout because we can't use functions after a return

        return comentsArr.reduce((pv, coment, index) => {
            const HTML = `
            <div data-index="${index}" class="movie-info__coment coment">

                <div class="coment__additional">

                    <div class="coment__section-name">Coment: ${index + 1}</div>

                    <div class="coment__settings settings">
                        <div class="settings__dot"></div>
                        <div class="settings__dot"></div>
                        <div class="settings__dot"></div>

                        <div class="settings__additional-menu additional-menu">
                            <ul class="additional-menu__list">
                                <li data-action="edit" class="additional-menu__item">Редагувати</li>
                                <li data-action="delete" class="additional-menu__item">Видалити</li>
                            </ul>
                        </div>
                        <div class="settings__arrow-container">
                            <div class="settings__arrow"></div>
                        </div>
                        
                    </div>

                </div>
                <div class="coment__text">
                    ${coment}
                </div>
            </div>
            `
            return pv + HTML
        },``)

    }

    addEvents(){
        this.HTMLBodies.forEach(coment => {
            coment.addEventListener(`click`, this.events.bind(this))
        })
    }

    events(event){
        const target = event.target
        const index = target.closest(`.coment`).dataset.index
        const movieIndex = target.closest(`.movie-info`).dataset.index
        const action = target.dataset.action
        if(!action) return false
        
        if(action == `delete` && confirm(`Ви точно хочете видалити цей коментар`)) this.delete(index)
        if(action == `edit`) this.callEditor(movieIndex,index)
    }

    delete(index){
        const body = this.HTMLBodies[index]
        body.remove()
        this.coments.splice(index,1)
        localStorage.setItem(`shelves`,JSON.stringify(shelves.shelves))
    }

    edit(index, coment){
        this.coments.splice(index,1,coment)
        localStorage.setItem(`shelves`,JSON.stringify(shelves.shelves))
    }

    callEditor(movieIndex,index){
        const comentText = this.coments[index]
        comentEditor.render(movieIndex,index,comentText)
    }
}

export default Coments;