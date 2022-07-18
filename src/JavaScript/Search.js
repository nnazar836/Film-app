import HTMLObject from './HTMLObject.js'
import API from "./API.js"
import {  main, shelves, films } from './Creater.js'



class Search extends HTMLObject{
    constructor(){
        super(`.header__form`)
        this.input = this.body.querySelector(`.header__input`)
        this.button = this.body.querySelector(`.header__button`)
    }

    start(){
        this.button.addEventListener(`click`, this.search.bind(this))
        this.input.addEventListener(`input`,this.renderRecommendation.bind(this))
        this.input.addEventListener(`blur`, () => setTimeout(this.removeRecList.bind(this),100))
    }

    search(event, request, page){
        if(event) event.preventDefault()
        if(!request) request = this.input.value

        shelves.makeActive(0)
        main.switcher.dataset.searched = true
        this.input.dataset.request = this.input.value

        this.getSearchedMovies(request,page)
        .then(resp =>{
            films.renderMovieList(resp.results)
            main.renderSwitcher(resp.total_pages, resp.page)
        })

        this.removeRecList()
    }

    getSearchedMovies(request,page){
        const link = API.BASE_url + `/search/movie?` + API.key + `&query=${request}`

        if(page) return fetch(link + `&page=${page}`).then(resp => resp.json())
        else return fetch(link).then(resp => resp.json())
    }

    renderRecommendation(){
        this.removeRecList()
        const request = this.input.value
        
        this.getSearchedMovies(request)
        .then((resp) =>{
            const results = resp.results

            if(results && results.length > 0){
                
                results.length = window.innerWidth <= 1000 ? 5 : 10

                let HTML =
                `
                <div class="header__recommendation">
                    <ul class="header__recommendation-list">
                        ${results.map(item => `<li class="header__recommendation-item">${item.original_title}</li>`).join(``)}
                    </ul>
                </div>
                `
                this.body.insertAdjacentHTML(`afterend`,HTML)
                this.recListAddFunctions()
            }

        })

    }

    removeRecList(){
        const recList = document.querySelector(`.header__recommendation`)

        if(recList){
            recList.remove()
            this.removeRecList()
        }
    }

    recListAddFunctions(){
        const recList = document.querySelector(`.header__recommendation`)

        recList.addEventListener(`click`, this.recListFunctions.bind(this))
    }

    recListFunctions(event){
        const item = event.target.closest(`.header__recommendation-item`)

        if(item){
            const request = item.textContent
            this.search(null, request)
            this.input.value = request
        }
    }
}

export default Search;