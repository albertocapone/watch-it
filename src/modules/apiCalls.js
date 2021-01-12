import { state, ajaxDefaults } from '../utils';
import * as Boxes from './htmlBoxes';
const { cloneDeep } = require('lodash');

/* API Calls */
export async function getMovies(page = 1) {

    const ajaxObject = cloneDeep(ajaxDefaults);
    ajaxObject.url += 'discover/movie';
    ajaxObject.data.page = page;

    const movies = await $.ajax(ajaxObject);

    state.movies = {
    totalPages: movies.total_pages,
    currentPage: page,
    data: movies.results
    }
}

export async function getTVSeries(page = 1) {

    const ajaxObject = cloneDeep(ajaxDefaults);
    ajaxObject.url += "discover/tv";
    ajaxObject.data.page = page;

    const TVseries = await $.ajax(ajaxObject);

    state.series = {
    totalPages: TVseries.total_pages,
    currentPage: page,
    data: TVseries.results
    };
}

export async function search(event, page = 1) {

    if (!Boxes.searchInput.val().trim().length && event !== "page-change") return;
    
    const ajaxObject = cloneDeep(ajaxDefaults);

    ajaxObject.url += "search/multi";
    ajaxObject.data.page = page;
    ajaxObject.data.query = (event === "page-change") ? state.search.query : Boxes.searchInput.val().toLowerCase();

    const multi = await $.ajax(ajaxObject);

    state.search = {
    query: ajaxObject.data.query,
    totalPages: multi.total_pages,
    currentPage: page,
    data: multi.results,
    };
}

export async function getGenres() {
    
    const ajaxObject = cloneDeep(ajaxDefaults);
   
    const url = ajaxObject.url;

    ajaxObject.url = url + 'genre/movie/list?';
    const movie = (await $.ajax(ajaxObject));

    ajaxObject.url = url + "genre/tv/list?";
    const tv = (await $.ajax(ajaxObject));

    const genres = movie.genres.concat(tv.genres);

    const sortedGenres = [
    ...new Map(                                               // 0. genres [ {id: 35, name: 'Western'}, {id: 35, name: 'Western'} ] -- contiene duplicati
        genres.map( genreObj => [ genreObj['id'], genreObj ] )  // 1. .map => [ [id, {}], [id, {}], ..] -- riorganizza esponendo id
        )                                                       // 2. new Map => { id => {}, id => {}, ..} -- elimina duplicati | 3. .values() => { {}, {}, ..} -- espone valori
    .values()                                                 // 4. [...<values>] => [ {}, {}, ..] -- copia i valori in nuovo array
    ];

    state.genres = sortedGenres;
}

