import { state } from '../utils';
import * as Boxes from "./htmlBoxes";
import { displayCover, displayLanguage, rateIt, translateGenres } from './templatingUtils';

/* DOM Update */
export const updateDOM = (prop) => {
  switch (prop) {
    case "movies":
      injectTemplates("media", state.movies.data, Boxes.movies);
      paintPagesIndex(prop);
      paintBookmarks(Boxes.movies);
      console.log("DOM UPDATE", { movies: state.movies });
      break;

    case "series":
      injectTemplates("media", state.series.data, Boxes.series);
      paintPagesIndex(prop);
      paintBookmarks(Boxes.series);
      console.log("DOM UPDATE", { series: state.series });
      break;

    case "search":
      injectTemplates("media", state.search.data, Boxes.searchResults);
      paintPagesIndex(prop);
      paintBookmarks(Boxes.searchResults);
      scrollTo("search");
      displayCurrentSearch();
      console.log("DOM UPDATE", { search: state.search });
      break;

    case "favs":
      injectTemplates("media", state.favs.onPage, Boxes.favourites);
      paintPagesIndex(prop);
      paintBookmarks(Boxes.favourites);
      console.log("DOM UPDATE", { favs: state.favs });
      break;

    case "genres":
      injectTemplates("genres", state.genres, Boxes.genresFilter);
      console.log("DOM UPDATE", { genres: state.genres });
      break;
  }
};

const injectTemplates = (kind, data, targetBox) => {
  
  let template;

  switch (kind) {
    case "media":
      template = require("../templates/media.template.handlebars");

      targetBox.html("");

      for (const media of data) {
        const checkDate = media.first_air_date ?? media.release_date;

        const context = {
          id: media.id,
          cover: displayCover(media.poster_path),
          title: media.name ?? media.title,
          originalTitle: media.original_name ?? media.original_title,
          flag: displayLanguage(media.original_language),
          score: rateIt(media.vote_average),
          overview: media.overview,
          genreData: media.genre_ids,
          genres: translateGenres(media.genre_ids),
          year: checkDate ? checkDate.substring(0, 4) : "n.d.",
          category: media.title ? "MOVIE" : "TV", //film hanno sempre una prop title, le serie una name - per evitare di passare altri parametri a inject
        };

        targetBox.append(template(context));
      }
      break;

    case "genres":
      template = require("../templates/genreFilter.template.handlebars");

      for (const genre of data) {
        const context = {
          genreName: genre.name,
          genreCode: genre.id,
        };

        targetBox.append(template(context));
      }
      break;
  }
};

const paintPagesIndex = (box) => {
  const pageIndex = Boxes.page_index.filter(function () {
      return $(this).parent().data("box") === box;
    }),
    dataIsNotMissing = state[box].data.length > 0 ? true : false,
    totalPages = state[box].totalPages || 1,
    currentPage = state[box].currentPage;

  pageIndex.html("");

  if (dataIsNotMissing) {
    pageIndex
      .after()
      .append(
        `<input type="number" name="page" min="1" max="${totalPages}" value="${currentPage}" />`
      );
    pageIndex.after().append(`<span>- ${totalPages}</span>`);
  }
};

const paintBookmarks = (box) => {
  box.children().each(function () {
    for (let media of state.favs.data)
      if (media.id === $(this).data("id"))
        $(this).find(".bookmark").addClass("active");
  });
};

const displayCurrentSearch = () => {
  const placeholder = `Results for: "${state.search.query}"`;
  Boxes.searchInput.attr("placeholder", placeholder);
};

const scrollTo = (hash) => {
  location.hash = null;
  location.hash = hash;
};
