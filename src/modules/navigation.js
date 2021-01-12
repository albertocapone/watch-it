import { state, ajaxDefaults } from "../utils";
import * as Boxes from './htmlBoxes';
import { getMovies, getTVSeries, search} from './apiCalls';
import { getFavsFromStorage } from './favsManagement';

/* Pagination */
export function browsePages() {
  const box = $(this).parent().data("box"),
    direction = $(this).attr("class"),
    currentPage = state[box].currentPage,
    total_pages = state[box].totalPages,
    nextPage = direction === "page-up" ? currentPage + 1 : currentPage - 1;

  if (
    (direction === "page-up" && currentPage < total_pages) ||
    (direction === "page-down" && currentPage > 1)
  ) {
    switch (box) {
      case "movies":
        getMovies(nextPage);
        break;

      case "series":
        getTVSeries(nextPage);
        break;

      case "favs":
        getFavsFromStorage(nextPage);
        break;

      case "search":
        search("page-change", nextPage);
        break;
    }
  }
}

export function goToPage(e) {
  e.preventDefault();

  const box = $(this).parent().data("box"),
    nextPage = Number($(this).find("input[name='page']").val());

  switch (box) {
    case "movies":
      getMovies(nextPage);
      break;

    case "series":
      getTVSeries(nextPage);
      break;

    case "favs":
      getFavsFromStorage(nextPage);
      break;

    case "search":
      search("page-change", nextPage);
      break;
  }

  return false;
}
/* ----------- */



/* Filters */
export function filterForGenre() {

const filter = $(this).val();
if(filter === "all")  delete ajaxDefaults.data.with_genres;
else  ajaxDefaults.data.with_genres = filter;

getMovies();
getTVSeries();
getFavsFromStorage();
}
/* -------- */



/* Headbar Navigation Effects */
export function headbarNavigation() {

Boxes.headbarNavigationButtons.each(function () {
  $(this).removeClass('active');
});

$(this).addClass('active');
}

export function scrollbarHeadbarSync() {      

const at = Boxes.media.scrollTop();

Boxes.headbarNavigationButtons.each(function () {
  $(this).removeClass('active');
});

if (at <= 697) Boxes.headbarNavigationButtons.eq(0).addClass('active');
else if (at >= 698 && at <= 1305) Boxes.headbarNavigationButtons.eq(1).addClass('active');
else if (at >= 1306 && at <= 1747) Boxes.headbarNavigationButtons.eq(2).addClass('active');
else  Boxes.headbarNavigationButtons.eq(3).addClass('active');
}

/* ---------- */
