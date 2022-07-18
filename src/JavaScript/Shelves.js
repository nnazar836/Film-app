import { main, sideBar, shelfEditor, films, topShelve, search } from './Creater.js'

class Shelves{
    constructor(){
        this.shelves = JSON.parse(localStorage.shelves || '[]') 
        this.HTMLBodies = [...document.getElementsByClassName(`shelf`)]
        this.shelvesContainer = document.querySelector(`.aside__shelves-container`)
    }

    start(){ // makes shelves working
        if(!localStorage.shelves) localStorage.setItem(`shelves`, `[]`) //checks if there exists a place where we'll keep our shelves
        this.renderShelves() // renders the shelves
    }

    renderShelves(){
        const HTMLCode = this.shelves.reduce((pv, shelf) =>{ // in this way we create HTML code we put into the shelves container

            const HTML = `
                    <div class="shelf" data-id="${shelf.id}" data-active="false" >

                        <div class="shelf__container">
                    
                            <div class="shelf__foto-container">
                                <img src="${shelf.photo}" alt="">
                            </div>
                    
                            <div class="shelf__info-container">
                                <div class="shelf__name"> ${shelf.name}</div>
                                <div class="shelf__amount-of-movies">${shelf.movies.length} Фільмів</div>
                            </div>
                    
                            <div class="shelf__settings settings">
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
                    
                    </div>
            `
            return pv + HTML
        },``)

        this.shelvesContainer.innerHTML = HTMLCode; //puts  the shelves code into container
        this.reSetHtmlShelves() // reloads bodies list
    }

    reSetHtmlShelves(){
        this.HTMLBodies = [...document.getElementsByClassName(`shelf`)] //reloads bodies list
        this.addListeners() // add listeners on the bodies
    }

    addListeners(){

        for(let i = 0; i < this.HTMLBodies.length; i++){
            let body = this.HTMLBodies[i]

            if(body.dataset.listener === 'true') continue;
            if(body.dataset.listener) body.dataset.listener = 'true'

            body.addEventListener(`click`, this.events.bind(this))
        }
    }

    events(event){
        // this one function gives full functionality to our shelves

        const target = event.target //gets the target
        const setings = target.closest(`.settings`) // needed to prevent some bags
        const shelfId = target.closest(`.shelf`).dataset.id // gets the id of the shelf where we've made a click
        const shelf = this.findShelfById(shelfId) // gets us a shelf object

        const action = target.dataset.action // if we click on the menu items of the shelf,
        // we'll get the action we need to do, if the action is absent it means we clicked on the shelf and we
        // don't have to do any special action


        if(action){ // if the action is absent it means we clicked on the shelf and we don't have to do any special action

            if(action === `edit`) shelfEditor.show(shelf.name, shelf.photo, shelfId) // runs all functions we need to edit the shelf
            if(action === `delete`) this.deleteShelf(shelfId) // deletes the shelf

        } else if(setings) {
            // here we prevent the bag
        } else { // it means we clicked on the shelf and we don't have to do any special action

            this.makeActive(shelfId) // makes the shelf active

        }
    }

    deleteShelf(id){
        const index = this.findShelfById(id,true)
        const text = index === -1 ? `` : `ви точно хочете видалити полицю ${this.shelves[index].name}`
        
        if(index !== -1 && confirm(text)){

            this.shelves.splice(index,1)

            localStorage.setItem(`shelves`,JSON.stringify(this.shelves))
            this.renderShelves()
            topShelve.showRecommendation()
            this.makeActive(1)
        }

    }

    addShelf(newShelf){
        this.shelves.push(newShelf)
        localStorage.setItem(`shelves`,JSON.stringify(this.shelves))
        this.renderShelves()
    }

    editShelf(newInfo,id){
        const index = this.findShelfById(id,true)
        const shelf = this.shelves[index]
        Object.assign(shelf,newInfo)

        localStorage.setItem(`shelves`,JSON.stringify(this.shelves))
        this.renderShelves()
    }

    makeActive(id){
        main.switcher.dataset.searched = false

        this.HTMLBodies.forEach(body => {
            const container = body.querySelector(`.shelf__container`)

            if(body.dataset.id == id){

                container.classList.add(`shelf__container_active`)
                body.dataset.active = true
                this.showShelf(id)
                sideBar.autoOff()

            } else{

                container.classList.remove(`shelf__container_active`)
                body.dataset.active = false
                
            }
        })

        main.body.scrollTo({top:0,left:0, behavior:"smooth"})

    }

    showShelf(id){
        if(id != 1){
            let shelf = this.findShelfById(id)

            if(shelf.movies){
                const amountOfPages = Math.ceil(shelf.movies.length / 20)
                films.renderMovieList(shelf.movies,1)
                main.renderSwitcher(amountOfPages,1)
            }
        }
        
    }

    findActiveShelf(){
        return this.HTMLBodies.find(item => item.dataset.active == 'true')
    }

    switchPages(page){
        const activeShelf = this.findActiveShelf()
        let id, shelfObj;

        if(activeShelf){
            id = activeShelf.dataset.id
            shelfObj = this.findShelfById(id)
        }

        if( main.switcher.dataset.searched == `true`){
            const request = search.input.dataset.request

            search.search(null,request, page)

        } else if(this.isAsync(activeShelf)) {

            topShelve.showRecommendation(page)

        } else {

            const amountOfPages = Math.ceil(shelfObj.movies.length / 20)
            films.renderMovieList(shelfObj.movies,page)
            main.renderSwitcher(amountOfPages, page)

        }
    }

    isAsync(shelf){
        if(shelf.dataset.async) return true
        
        return false

    }

    getNewId(){
        let id = Math.round(Math.random() * 1000000)

        for(let i = 0; i < this.shelves.length; i++){

            if(this.shelves[i].id === id) return this.getNewId()

        }

        return id
    }

    findShelfById(id,index){
        if(index) return this.shelves.findIndex(shelf => shelf.id == id)
        else return this.shelves.find(shelf => shelf.id == id)
    }

    addMovie(shelfId, movieObj){
        const isAdded = films.isAdded(movieObj.id)
        if(isAdded){
            alert(`Цей фільм вже додано на полицю "${isAdded}"`)
            return false
        }

        movieObj.coments =[]
        let shelf = this.findShelfById(shelfId)
        shelf.movies.push(movieObj)
        localStorage.setItem(`shelves`,JSON.stringify(this.shelves))
        this.renderShelves()

    }
}

export default Shelves;