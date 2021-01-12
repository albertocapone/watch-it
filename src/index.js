import "core-js/stable";
import "regenerator-runtime/runtime";
import './index.scss';
import CircleType from "circletype";
import * as Boxes from './modules/htmlBoxes';
import { getGenres, getMovies, getTVSeries, search } from "./modules/apiCalls";
import { getFavsFromStorage, add_n_remove_Favs } from "./modules/favsManagement";
import { goToPage, browsePages, filterForGenre, headbarNavigation, scrollbarHeadbarSync } from './modules/navigation';



const App = () => {

  $('body').css("visibility", "visible");

  new CircleType(document.getElementById("logo")).radius(600); //stilizzazione logo

  getGenres().then(() => {
    getFavsFromStorage();
    getMovies();
    getTVSeries();
  });

  Boxes.page_index.submit(goToPage);
  Boxes.page_switchers.click(browsePages);

  Boxes.genresButton.click(() => {
    Boxes.genresButton.toggleClass("active");
    Boxes.genresFilter.toggle();
    Boxes.genresFilter.click(filterForGenre);
  });

  Boxes.media.on("click", ".bookmark", add_n_remove_Favs);

  Boxes.searchButton.click(search);

  Boxes.searchInput.on({
    focusin: () => {
      Boxes.searchInput.val("");
    },
    focusout: () => {
      setTimeout(() => Boxes.searchInput.val(""), 200);
    },
    keydown: (e) => {
      if (e.which == 13) {
        e.preventDefault();
        document.getElementById("searchInput").blur();
        search();
      }
    },
  });

  Boxes.headbarNavigationButtons.click(headbarNavigation);
  Boxes.media.scroll(scrollbarHeadbarSync);
};

App();