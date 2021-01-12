import { state } from '../utils';

export const displayLanguage = (language) => {
  return `img/${language}.png`;
};


export const rateIt = (vote) => {
  const starredVote = vote == 0 ? 1 : Math.round(vote / 2);
  let starString = "";

  for (let stars = 0; stars < 5; stars++) {
    if (stars < starredVote) starString += "<i class='fas fa-star'></i>";
    else starString += "<i class='far fa-star'></i>";
  }

  return starString;
};



export const displayCover = (coverPath) => {
  return coverPath
    ? `https://image.tmdb.org/t/p//w500/${coverPath}`
    : `img/no_image.jpeg`;
};



export const translateGenres = (mediaGenreCodes = []) => {
  const genresTable = state.genres;
  let genresList = [];

  for (let e = 0; e < mediaGenreCodes.length; e++) {
    let code = mediaGenreCodes[e];
    for (let i = 0; i < genresTable.length; i++) {
      if (code === genresTable[i].id) {
        genresList.push(genresTable[i].name);
        break;
      }
    }
  }

  return genresList.join(" ") || "n.d.";
};

