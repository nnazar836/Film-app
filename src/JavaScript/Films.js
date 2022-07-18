import API from "./API.js"
import {  main, shelves, filmInfo } from './Creater.js'

class Films{
    constructor(){
        this.movies = []  
        this.HTMLChildren = [...document.getElementsByClassName(`movie-container`)]
    }

    start(){
        this.addEvents()
    }

    renderMovieList(moviesArray, page){
        
        if(moviesArray.length === 0){

            main.moviesContainer.innerHTML = '<p style="font-weight: bold;  font-size: 25px;">Ця полиця є пустою</p>'
            main.renderSwitcher(false)
            this.changeMovieList([])

        } else{
            let firstItem, lastItem
            let HTMLCode = ``

            if(moviesArray.length <= 20)[firstItem,lastItem] = [0,moviesArray.length]
            else [firstItem,lastItem] = this.calculatePage(page);
            
            for(;firstItem < lastItem;firstItem++){

                const movie = moviesArray[firstItem]
                const index = firstItem

                if(!movie) break

                const HTML =`
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

                HTMLCode += HTML
            }
    
            main.moviesContainer.innerHTML = HTMLCode
            this.changeMovieList(moviesArray)

        }
        


    }

    addEvents(){
        this.HTMLChildren.forEach(child => {
            child.addEventListener(`click`, this.events.bind(this))
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

export default Films;