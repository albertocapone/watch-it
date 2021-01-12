import { state, ajaxDefaults} from '../utils';

/* Favourites */
export const getFavsFromStorage = (page = 1) => {
  const favourites = window.localStorage.getItem("favourites")
      ? JSON.parse(window.localStorage.getItem("favourites"))
      : [],
    filter = Number(ajaxDefaults.data.with_genres),
    eventuallyFilteredFavourites = filter
      ? favourites.filter((fav) => fav.genre_ids.includes(filter))
      : favourites,
    resultsPerPage = 20,
    totalPages = Math.ceil(
      eventuallyFilteredFavourites.length / resultsPerPage
    ),
    first = (page - 1) * resultsPerPage,
    last = first + resultsPerPage;

  state.favs = {
    totalPages: totalPages,
    currentPage: page,
    data: favourites,
    onPage: eventuallyFilteredFavourites.slice(first, last),
  };
};

export function add_n_remove_Favs() {
  const thisBookmark = $(this),
    thisMedia = $(this).parents(".media"),
    thisMediaID = thisMedia.data("id"),
    thisMediaIsBookmarked = thisBookmark.hasClass("active"),
    thisMediaBox = thisMedia.parent().siblings(".pagination").data("box");

  let updatedFavs;

  if (thisMediaIsBookmarked) {
    $(".media").each(function () {
      if ($(this).data("id") === thisMediaID)
        $(this).find(".bookmark").removeClass("active");
    });
    updatedFavs = state.favs.data.filter((fav) => fav.id !== thisMediaID);
    recalculateFavs(updatedFavs);
  } else {
    thisBookmark.addClass("active");
    updatedFavs = state[thisMediaBox].data.find(
      (elm) => elm.id === thisMediaID
    );
    recalculateFavs(state.favs.data.concat(updatedFavs));
  }
}

const recalculateFavs = (favs) => {
  const resultsPerPage = 20,
    filter = ajaxDefaults.data.with_genres,
    eventuallyFilteredFavourites = filter
      ? favs.filter((fav) => fav.genre_ids.includes(filter))
      : favs,
    totalPages =
      Math.ceil(eventuallyFilteredFavourites.length / resultsPerPage) || 1,
    page =
      state.favs.currentPage <= totalPages
        ? state.favs.currentPage
        : totalPages,
    first = (page - 1) * resultsPerPage,
    last = first + resultsPerPage;

  state.favs = {
    totalPages: totalPages,
    currentPage: page,
    data: favs,
    onPage: eventuallyFilteredFavourites.slice(first, last),
  };
};

export const saveFavsToStorage = () => {
  window.localStorage.setItem("favourites", JSON.stringify(state.favs.data));
};

