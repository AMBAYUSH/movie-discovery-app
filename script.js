
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsTitle = document.getElementById("resultsTitle");
const movieGrid = document.getElementById("movieGrid");

searchForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const movieName = searchInput.value.trim();

  if (movieName === "") {
    return;
  }

  resultsTitle.textContent = `Searching for: ${movieName}`;
  movieGrid.textContent = "API connection coming soon...";

  console.log("Movie searched:", movieName);
});
