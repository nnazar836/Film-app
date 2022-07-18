import HTMLObject from './HTMLObject.js'
import API from './API.js'
import Films from './Films.js'
import { blurBlock, shelves, films, filmInfo, coments, askShelf, comentEditor } from './Creater.js'


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
                    <img src="${Films.checkPhoto(API.GET_Img__URL + obg.poster_path)}" alt="">
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

            <section class="movie-info__video-section" name="video">
                
            </section>

            <section class="movie-info__coments-section" name="coments">
                ${coments.renderComents(obg.coments)}
            </section>
        `

        this.changeBody(body)
        this.changeFunctionsSection()
        this.addEvents()
        blurBlock.create(this)
        this.renderVideo(obg)
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
        this.functionsSection.addEventListener(`click`, this.events.bind(this))
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

    renderVideo(movie){
        const link = `${API.BASE_url}/movie/${movie.id}/videos?${API.key}`
        const videoSection = this.body.querySelector(`.movie-info__video-section`)

        const videos = fetch(link).then(resp =>  resp.json())
        .then(resp =>{
            let videosArr = resp.results

            return videosArr.reduce((pv, video) => {
                if(video.site === "YouTube" && video.type === `Trailer`){

                    return pv +=`
                    <div class="movie-info__section-name">${video.name}</div>
                    <iframe class="movie-info__video" width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="${video.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`

                }
                else return pv += ``
            } ,``)

        })
        .then(HTML => videoSection.innerHTML = HTML)
    }

}

export default FilmInfo;