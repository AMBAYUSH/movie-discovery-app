
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get("/api/movies", async (req, res) => {
  const query = String(req.query.query || "").trim();

  if (!query) {
    return res.status(400).json({
      error: "Please enter a movie title."
    });
  }

  if (!process.env.TMDB_TOKEN) {
    return res.status(500).json({
      error: "TMDB token is not configured."
    });
  }

  try {
    const url = new URL(
      "https://api.themoviedb.org/3/search/movie"
    );

    url.searchParams.set("query", query);
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", "1");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`TMDB returned ${response.status}`);
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Movie search failed:", error.message);

    res.status(502).json({
      error: "Could not retrieve movies. Try again."
    });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const movieId = req.params.id;

  // Only allow numeric movie IDs
  if (!/^\d+$/.test(movieId)) {
    return res.status(400).json({
      error: "Invalid movie ID"
    });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Unable to retrieve movie details"
      });
    }

    const movie = await response.json();

    res.json(movie);
  } catch (error) {
    console.error("Movie details error:", error.message);

    res.status(502).json({
      error: "Movie details are temporarily unavailable"
    });
  }
});

app.listen(PORT, () => {
  console.log(`CineVault running at http://localhost:${PORT}`);
});
