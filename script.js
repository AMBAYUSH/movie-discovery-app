
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsTitle = document.getElementById("resultsTitle");
const movieGrid = document.getElementById("movieGrid");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const movieName = searchInput.value.trim();

  if (!movieName) return;

  resultsTitle.textContent = `Results for: ${movieName}`;
  movieGrid.textContent = "Searching for movies...";

  try {
    const response = await fetch(
      `/api/movies?query=${encodeURIComponent(movieName)}`
    );

    if (!response.ok) {
      throw new Error("Movie search failed");
    }

    const data = await response.json();

    console.log("API response:", data);

    displayMovies(data.results);
  } catch (error) {
    console.error(error);
    movieGrid.textContent = "Something went wrong. Try again.";
  }
});

function displayMovies(movies) {
  movieGrid.replaceChildren();

  if (!movies || movies.length === 0) {
    movieGrid.textContent = "No movies found.";
    return;
  }

  movies.forEach((movie) => {
    const card = document.createElement("article");
    card.className = "movie-card";

    if (movie.poster_path) {
      const poster = document.createElement("img");

      poster.src =
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      poster.alt = `${movie.title} poster`;
      poster.loading = "lazy";

      card.appendChild(poster);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "poster-placeholder";
      placeholder.textContent = "No poster available";
      card.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "movie-info";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = movie.release_date
      ? movie.release_date.slice(0, 4)
      : "Release date unavailable";

    const rating = document.createElement("p");
    rating.textContent =
      `⭐ ${Number(movie.vote_average || 0).toFixed(1)} / 10`;

    info.append(title, year, rating);
    card.appendChild(info);
    movieGrid.appendChild(card);
  });
}
