
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

app.listen(PORT, () => {
  console.log(`CineVault running at http://localhost:${PORT}`);
});
