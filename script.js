
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsTitle = document.getElementById("resultsTitle");
const movieGrid = document.getElementById("movieGrid");

const movieModal = document.getElementById("movieModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => {
  movieModal.close();
});

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

card.tabIndex = 0;
card.setAttribute("role", "button");
card.setAttribute("aria-label", `View details for ${movie.title}`);

card.addEventListener("click", () => {
  showMovieDetails(movie.id);
});

card.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    showMovieDetails(movie.id);
  }
});


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

async function showMovieDetails(movieId) {
  modalContent.textContent = "Loading movie details...";

  movieModal.showModal();

  try {
    const response = await fetch(`/api/movies/${movieId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const movie = await response.json();

    // Stop if the popup was closed while loading
    if (!movieModal.open) return;

    renderMovieDetails(movie);

  } catch (error) {
    console.error(error);

    if (movieModal.open) {
      modalContent.textContent =
        "Unable to load movie details. Please try again.";
    }
  }
}

function renderMovieDetails(movie) {
  modalContent.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "modal-layout";

  if (movie.poster_path) {
    const poster = document.createElement("img");

    poster.className = "modal-poster";
    poster.src =
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    poster.alt = `${movie.title} poster`;

    layout.appendChild(poster);
  }

  const details = document.createElement("div");
  details.className = "modal-details";

  const title = document.createElement("h2");
  title.id = "modalTitle";
  title.textContent = movie.title;

  details.appendChild(title);

  function addDetail(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    paragraph.append(strong, document.createTextNode(value));

    details.appendChild(paragraph);
  }

  addDetail(
    "Release Date",
    movie.release_date || "Unknown"
  );

  addDetail(
    "Rating",
    movie.vote_average
      ? `${movie.vote_average.toFixed(1)} / 10`
      : "Not rated"
  );

  addDetail(
    "Runtime",
    movie.runtime
      ? `${movie.runtime} minutes`
      : "Unknown"
  );

  addDetail(
    "Genres",
    movie.genres?.map(genre => genre.name).join(", ")
      || "Unknown"
  );

  addDetail(
    "Overview",
    movie.overview || "No description available."
  );

  layout.appendChild(details);
  modalContent.appendChild(layout);
}
