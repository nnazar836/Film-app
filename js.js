const application = {
    start(){
        shelves.start()
        main.start()
        films.start()
        header.start()
        sideBar.start()
        topShelve.start()
        shelfEditor.start()
    }
}

const API ={
    key : `api_key=4218253ea3996b68858664a469ad2ba1`,
    BASE_url : `https://api.themoviedb.org/3`,
    GET_Img__URL : `https://image.tmdb.org/t/p/w500`
}

class HTMLObject{
    constructor(selector){
        this.body = document.querySelector(selector)
    }

    hide(){
        this.body.style.display = `none`
    }

    show(){
        this.body.style.display = `block`
    }

    remove(){
        this.body.remove()
    }
}


//blur block
class BlurBlock extends HTMLObject{
    constructor(){
        super(`.blur-block`)
    }

    create(popUp){
        let blurBlock = document.createElement(`div`)

        blurBlock.classList.add(`blur-block`)

        blurBlock.innerHTML = `
        <div class="blur-block__cross">
            <div class="blur-block__line-1">
                <div class="blur-block__line-2"></div>
            </div>
        </div>
        `

        this.body = blurBlock;

        document.body.prepend(blurBlock)

        if(popUp) this.body.addEventListener('click', popUp.remove.bind(popUp))
    }

    remove(){
        super.remove()
        this.body = null
    }


}
let blurBlock = new BlurBlock
//blur block^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


//main's functional
class Main extends HTMLObject{
    constructor(){
        super('.main')
        this.moviesContainer = document.querySelector( `.main__grid-movies-container`)
        this.switcher = this.body.querySelector(`.main__page-switcher`)
    }

    start(){
        this.switcher.addEventListener('click', Main.switcherFunctional.bind(main)) // add switcher functional
    }

    renderSwitcher(max = 500, curentPage = 1){// Functional for switcher
        if(max === false){
            this.switcher.innerHTML = ''
            return false
        }

        let HTML =``
        let renderPage = curentPage - 2
        
        for(let i = 0; i < 5; i++){

            if(renderPage <= 0 || renderPage > max){
                renderPage++
                continue
            }

            if(renderPage == curentPage){
                HTML += `<li class="page-switcher__page page-switcher__active-page">${renderPage}</li>`
                renderPage++
                continue
            }

            HTML += `<li class="page-switcher__page">${renderPage}</li>`
            renderPage++
        }

        this.switcher.innerHTML = `
            <ul class="page-switcher__pages">
                ${HTML}
            </ul>
        `
        this.switcher.dataset.curentpage = curentPage
    }

    static switcherFunctional(event){// Functional for switcher
        // ability to switch pages
        let nextPage = event.target.closest(`.page-switcher__page`)
        if(nextPage){
            shelves.switchPages(nextPage.textContent)
        }
        // ability to switch pages^^
    }
}
const main = new Main
//main's functional^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


//header's functional
class Header extends HTMLObject{
    constructor(){
        super('header')
        this.menuButton = document.querySelector(`.header__menu `)
    }

    start(){
        this.menuButton.addEventListener(`click`, sideBar.onOff.bind(sideBar)) // Lets us open aside on the phone
    }
}
const header = new Header
//header's functional^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


//sidebar's functional

class SideBar extends HTMLObject{
    constructor(){
        super(`.aside`)
        this.backArrow = this.body.querySelector(`.aside__arrow-back`)
        this.addShelfButton = this.body.querySelector(`.aside__add-bhelf-button`)
    }

    start(){
        this.backArrow.addEventListener(`click`, sideBar.onOff.bind(sideBar)) //Lets us close aside on the phone
        this.addShelfButton.addEventListener(`click`, sideBar.addShelf.bind(sideBar)) //Lets us add a new shelf
    }

    onOff(event){
        event.stopPropagation()
        this.body.classList.toggle(`aside_on`)
    }

    addShelf(event){
        event.stopPropagation()
        shelfEditor.show()
    }
}

const sideBar = new SideBar
//sidebar's functional^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


//shelf editor
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
        this.executeButton.addEventListener(`click`,this.execute.bind(shelfEditor)) // adds functional of execute button

        this.photoUrlInput.addEventListener(`blur`, this.checkPhotoInput.bind(shelfEditor)) // adds functional of IMG input
        this.photoUrlInput.addEventListener(`focus`, this.deleteWaring.bind(shelfEditor)) //adds functional of IMG input

        this.nameInput.addEventListener(`blur`, this.checkNameInput.bind(shelfEditor)) // adds functional of name input
        this.nameInput.addEventListener(`focus`, this.deleteWaring.bind(shelfEditor)) // adds functional of name input
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

const shelfEditor = new ShelfEditor
//shelf editor^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------



// shelfs
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
        this.HTMLBodies.forEach(body => {
            body.addEventListener(`click`, this.events.bind(shelves))
        })
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

        this.HTMLBodies.forEach(body => {
            const container = body.querySelector(`.shelf__container`)

            if(body.dataset.id == id){

                container.classList.add(`shelf__container_active`)
                body.dataset.active = true
                this.showShelf(id)


            } else{

                container.classList.remove(`shelf__container_active`)
                body.dataset.active = false
                
            }
        })

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
        const id = activeShelf.dataset.id
        const shelfObj = this.findShelfById(id)

        if(this.isAsync(activeShelf)){
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

const shelves = new Shelves
// shelfs^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------

// films
class Films{
    constructor(){
        this.movies = []  
        this.HTMLChildren = [...document.getElementsByClassName(`movie-container`)]
    }

    start(){
        this.addEvents()
    }

    addEvents(){
        this.HTMLChildren.forEach(child => {
            child.addEventListener(`click`, this.events.bind(films))
        })
    }

    events(event){
        const target = event.target
        const number = target.closest(`.movie-container`).dataset.number
        const movieObj = this.movies[number]
        filmInfo.render(movieObj,number)
    }

    changeMovieList(array){
        this.movies = array
        this.HTMLChildren = [...document.getElementsByClassName(`movie-container`)]
        this.addEvents()
    }

    isAdded(id){

        for(let i = 0; i < shelves.shelves.length; i++){
            const movies = shelves.shelves[i].movies

            const movie = movies.find(movie => movie.id == id)
            if(movie){
                return shelves.shelves[i].name
            }
        }

    }

    static checkPhoto(photoUrl){
        const failUrl = `https://image.tmdb.org/t/p/w500null`
        const notFound = `Photo/NoImageFound.jpg.png`

        return photoUrl === failUrl ? notFound : photoUrl
    }

    renderRating(rating, className){
        let color
        if(rating >= 8) color =`green`
        else if (rating > 5) color =`yellow`
        else if (rating > 0) color =`red`

        return `
        <div class="${className}__ratingrating-container rating-container">
            <div class="rating-container__color rating-container__color-${color}">
                ${rating}
            </div>
        </div>
        `
    }

    calculatePage(page){
        let firstItem
        let lastItem
        if(page == 1 || page == 2){
            firstItem = (page == 1 ) ? 0 : +`${page}0`
            lastItem =  firstItem + 19
        } 
        else {
            lastItem = (page * 20) - 1
            firstItem = lastItem - 19
        }

         
        return [firstItem,lastItem]
    }

    renderMovieList(moviesArray, page){

        if(moviesArray.length === 0){

            main.moviesContainer.innerHTML = '<p style="font-weight: bold;  font-size: 25px;">Ця полиця є пустою</p>'
            main.renderSwitcher(false)
            this.changeMovieList([])

        } else{

            const HTMLCode = moviesArray.reduce((pv,movie,index) => {

                if(!page){
                    
                    const HTML = `
                    <div data-number="${index}" class="main__movie-container movie-container">
    
                        <div class="movie-container__movie" style="background: url(${Films.checkPhoto(API.GET_Img__URL + movie.poster_path)}) no-repeat center  / cover;">
    
                            ${this.renderRating(movie.vote_average,`movie-container`)}
    
                            <div class="movie-container__blur-block"></div>
    
                            <div class="movie-container__more more">
    
                                <div class="more__container">
                                    <div class="more__point"></div>
                                    <div class="more__point"></div>
                                    <div class="more__point"></div>
                                </div>
    
                            </div>
    
                            <div class="movie-container__title-of-the-movie">
                                ${movie.original_title}
                            </div>
    
                        </div>
    
                    </div>
                    `
                    return pv + HTML

                } else {
                    const [firstItem,lastItem] = this.calculatePage(page)

                    if((index >= firstItem) && (index <= lastItem)){
                        const HTML = `
                        <div data-number="${index}" class="main__movie-container movie-container">
        
                            <div class="movie-container__movie" style="background: url(${Films.checkPhoto(API.GET_Img__URL + movie.poster_path)}) no-repeat center  / cover;">
        
                                ${this.renderRating(movie.vote_average,`movie-container`)}
        
                                <div class="movie-container__blur-block"></div>
        
                                <div class="movie-container__more more">
        
                                    <div class="more__container">
                                        <div class="more__point"></div>
                                        <div class="more__point"></div>
                                        <div class="more__point"></div>
                                    </div>
        
                                </div>
        
                                <div class="movie-container__title-of-the-movie">
                                    ${movie.original_title}
                                </div>
        
                            </div>
        
                        </div>
                        `
                        return pv + HTML

                    }else{
                        return pv + ``
                    }
                }
            

    
            },``)
    
            main.moviesContainer.innerHTML = HTMLCode
            this.changeMovieList(moviesArray)

        }
        


    }

    findHTMLChildByindex(index){
        return this.HTMLChildren[index]
    }

    reduceNumber(index){
        for(let i = index; i < this.HTMLChildren.length; i++){
            const previousNumber = this.HTMLChildren[i].dataset.number
            const newNumber = previousNumber - 1
            this.HTMLChildren[i].dataset.number = newNumber
        }
    }
    
    addComent(index, coment){
        const movie = this.movies[index]
        let movieComents = movie.coments
        movieComents.push(coment)
        localStorage.setItem(`shelves`,JSON.stringify(shelves.shelves))
    }

    deleteHTMLChild(index){

        while(index >= 20){
            index = index - 20
        }
        this.HTMLChildren[index].remove()
    }
}

const films = new Films

// films^^

// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


// film info

class FilmInfo extends HTMLObject{
    constructor(){
        super(`.movie-info`)
        this.functionsSection = null
    }

    render(obg,index){
        let body = document.createElement(`div`)
        body.classList.add(`movie-info`)
        body.dataset.id = obg.id
        body.dataset.index = index


        body.innerHTML = `
            <section class="movie-info__photo-section" name="photo">

                <div class="movie-info__photo-container">   
                    <img src="${API.GET_Img__URL + obg.poster_path}" alt="">
                </div>

            </section>

            <section class="movie-info__info-section" name="info">

                <div class="movie-info__name">
                    ${obg.original_title}
                </div>

                <div class="movie-info__overview">
                    <div class="movie-info__section-name">description:</div>
                    ${obg.overview}
                </div>

                <div class="movie-info__release-date">
                    <div class="movie-info__section-name">release date:</div>
                    ${obg.release_date}
                </div>
            </section>

            <section class="movie-info__rate-section" name="rate">

                ${films.renderRating(obg.vote_average,`movie-info`)}

            </section>

            <section class="movie-info__functions-section" name="functions">
                ${this.renderButtons(obg.coments)}
            </section>

            <section class="movie-info__coments-section" name="coments">
                ${coments.renderComents(obg.coments)}
            </section>
        `

        this.changeBody(body)
        this.changeFunctionsSection()
        this.addEvents()
        blurBlock.create(this)
    }

    renderButtons(coments){
        if(coments){
            return  `
            <button data-action="coment" class="movie-info__add-coment-button">коментувати</button>
            <button data-action="delete" class="movie-info__delete-button">Видалити</button>
            `
        } else {
            return `<button data-action="add" class="movie-info__add-to-shelf-button">додати на полицю</button>`
        }
    }

    addEvents(){
        this.functionsSection.addEventListener(`click`, this.events.bind(filmInfo))
    }

    events(event){
        const target = event.target
        const buttonAction = target.closest(`button`).dataset.action
        const movieId = target.closest(`.movie-info`).dataset.id
        const movieIndex = target.closest(`.movie-info`).dataset.index


        if(buttonAction === 'add') askShelf.render(this.body.dataset.index)
        if(buttonAction === 'delete') this.deleteMovie(movieIndex)
        if(buttonAction === 'coment') comentEditor.render(movieIndex)

    }

    changeBody(newBody){
        document.body.append(newBody)
        this.body = document.querySelector(`.movie-info`)
    }

    changeFunctionsSection(){
        this.functionsSection = this.body.querySelector(`.movie-info__functions-section`)
    }

    remove(){
        super.remove()
        blurBlock.remove()
    }

    deleteMovie(index){
        const text = `Ви впевненні що хочете видалити цей фільм?. При видаленні цього фільму видаляться всі ваші коментарі!!!!`
        if(!confirm(text)) return false

        films.movies.splice(index,1)
        localStorage.setItem(`shelves`,JSON.stringify(shelves.shelves))
        films.deleteHTMLChild(index)
        films.reduceNumber(index)
        filmInfo.remove()

        shelves.renderShelves()
    }

}

const filmInfo = new FilmInfo
// film info^^

// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


// coments

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
        setTimeout(this.changeHTMLBodies.bind(coments, 100))

        setTimeout(this.addEvents.bind(coments, 100)) // we use setTimeout because we can't use functions after a return

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
            coment.addEventListener(`click`, this.events.bind(coments))
        })
    }

    events(event){
        const target = event.target
        const index = target.closest(`.coment`).dataset.index
        const movieIndex = target.closest(`.movie-info`).dataset.index
        const action = target.dataset.action
        if(!action) return false
        
        if(action == `delete`) this.delete(index)
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

const coments = new Coments
// coments^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// ask shelf
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
                            <label for="${shelf.id}">${shelf.name}</label>
                        </div>`
        },``)
    }
    
    addEvents(){
        const buttons = [...this.body.querySelectorAll(`button`)]

        buttons.forEach(button => {
            button.addEventListener(`click`,this.events.bind(askShelf))
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

const askShelf = new AskShelf
// ask shelf^^


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------



// shelf with popular shows
class TopShelve extends Shelves{
    constructor(){
        super()
        this.body = document.querySelector(`.shelf-in-the-top`)
        this.amount = this.body.querySelector(`.shelf__amount-of-movies`)
    }
    
    start(){
        delete this.HTMLBodies // delete unneeded field
        delete this.shelves // delete unneeded field
        delete this.shelvesContainer // delete unneeded field

        this.body.addEventListener(`click`, this.showRecommendation.bind(topShelve)) //shows recommendation when we click on body
        this.showRecommendation() //shows recommendation
    }

    static getUrl(page){
        let url;

        if(page){
            url = `${API.BASE_url}/discover/movie?sort_by=popularity.desc&${API.key}&page=${page}`
        } else {
            url = `${API.BASE_url}/discover/movie?sort_by=popularity.desc&${API.key}`
        }
        return url
    }

    static makeRequest(url){
        return fetch(url)
        .then(response => {
            if(response.ok){
                return response.json()
            } else {
                return response.json().then(error => {
                    alert(error.status_message)
                    throw error
                })
            }
        })
        .catch(error => {
            return false
        })
    }

    showRecommendation(page){
        let url = TopShelve.getUrl(page)
        let response = TopShelve.makeRequest(url)

        response.then(resp =>{
            if(!resp) return false
            
            this.amount.textContent = `${resp.total_results} фільмів`

            main.renderSwitcher(500, resp.page)

            films.renderMovieList(resp.results)

            return true
        })
        .then(resp => {
            if(!resp){
                main.moviesContainer.innerHTML = '<p style="font-weight: bold;  font-size: 25px;">Проблема з сервером</p>'
            }
        })
    }

}
const topShelve = new TopShelve
// shelf with popular shows^^

// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------



// coments

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
        buttons.addEventListener(`click`, this.events.bind(comentEditor))
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

const comentEditor = new ComentEditor

// coments^^

// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
application.start() 