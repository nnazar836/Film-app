import Shelves from './Shelves.js'
import API from "./API.js"
import {  main, films } from './Creater.js'


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

        main.switcher.dataset.searched = false

        this.body.addEventListener(`click`, this.showRecommendation.bind(this)) //shows recommendation when we click on body
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

export default TopShelve;