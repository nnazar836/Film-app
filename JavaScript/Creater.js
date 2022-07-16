import AskShelf from './AskShelf.js'
import BlurBlock from './BlurBlock.js'
import ComentEditor from './ComentEditor.js'
import Coments from './Coments.js'
import FilmInfo from './FilmInfo.js'
import Films from './Films.js'
import Header from './Header.js'
import Main from './Main.js'
import Search from './Search.js'
import ShelfEditor from './ShelfEditor.js'
import Shelves from './Shelves.js'
import SideBar from './SideBar.js'
import TopShelve from './TopShelve.js'



// { blurBlock, main, header, sideBar, shelfEditor, shelves, films, filmInfo, coments, askShelf, topShelve, comentEditor, search }
// import { blurBlock, main, header, sideBar, shelfEditor, shelves, films, filmInfo, coments, askShelf, topShelve, comentEditor, search } from './Creater.js'

export const blurBlock = new BlurBlock
export const main = new Main
export const header = new Header
export const sideBar = new SideBar
export const shelfEditor = new ShelfEditor
export const shelves = new Shelves
export const films = new Films
export const filmInfo = new FilmInfo
export const coments = new Coments
export const askShelf = new AskShelf
export const topShelve = new TopShelve
export const comentEditor = new ComentEditor
export const search = new Search