import { saveFavsToStorage } from './modules/favsManagement';
import { updateDOM } from './modules/updateDOM';

//API Key
const keyAPI = "99778220f31eec4fabbbe1461237e9d0";

//Application State
let state = {
  movies: {
    totalPages: 1,
    currentPage: 1,
    data: [],
  },
  series: {
    totalPages: 1,
    currentPage: 1,
    data: [],
  },
  favs: {
    totalPages: 1,
    currentPage: 1,
    data: [],
    onPage: [],
  },
  search: {
    query: null,
    totalPages: 1,
    currentPage: 1,
    data: [],
  },
  genres: [],
};

const handlestate = {
  set: (target, prop, value) => {
    target[prop] = value;
    if (prop === "favs") saveFavsToStorage();
    updateDOM(prop);
    return true;
  },
};

state = new Proxy(state, handlestate); //proxy agisce come event listener sull'oggetto contenente lo stato -- ogni aggiornamento innesca updateDom()

//Ajax Defaults
const ajaxDefaults = {
  url: "https://api.themoviedb.org/3/",
  method: "GET",
  data: {
    api_key: keyAPI,
    sort_by: "popularity.desc",
  },
};

export {
    state,
    ajaxDefaults
};
