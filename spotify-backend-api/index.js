// Load environment variables from the .env file.
require('dotenv').config();

// Import the necessary modules.
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios'); // Import Axios module
var cors = require('cors');

// Initialize an Express application.
const app = express();
app.use(cors());
// Define the port number on which the server will listen.
const port = 3050;

// Initialize the Spotify API with credentials from environment variables.
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL,
});

// Route handler for the login endpoint.
app.get('/login', (req, res) => {
  // Define the scopes for authorization; these are the permissions we ask from the user.
  const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state', 'user-modify-playback-state', 'user-top-read', 'user-read-recently-played'];
  // Redirect the client to Spotify's authorization page with the defined scopes.
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// Route handler for the callback endpoint after the user has logged in.
app.get('/callback', (req, res) => {
  // Extract the error, code, and state from the query parameters.
  const error = req.query.error;
  const code = req.query.code;

  // If there is an error, log it and send a response to the user.
  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  // Exchange the code for an access token and a refresh token.
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const accessToken = data.body['access_token'];
      const refreshToken = data.body['refresh_token'];
      const expiresIn = data.body['expires_in'];

      // Set the access token and refresh token on the Spotify API object.
      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);

      // Logging tokens can be a security risk; this should be avoided in production.
      console.log('The access token is ' + accessToken);
      console.log('The refresh token is ' + refreshToken);

      // Send a success message to the user.
      res.send('Login successful! You can now use the /search and /play endpoints.');

      // Refresh the access token periodically before it expires.
      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const accessTokenRefreshed = data.body['access_token'];
        spotifyApi.setAccessToken(accessTokenRefreshed);
      }, (expiresIn / 2) * 1000); // Refresh halfway before expiration.
    })
    .catch((error) => {
      console.error('Error getting Tokens:', error);
      res.send('Error getting tokens');
    });
});

// Route handler for the search endpoint.
app.get('/search', (req, res) => {
  // Extract the search query parameter.
  const { q } = req.query;

  // Make a call to Spotify's search API with the provided query.
  spotifyApi
    .searchTracks(q)
    .then((searchData) => {
      // Extract the URI of the first track from the search results.
      const trackUri = searchData.body.tracks.items[0].uri;
      // Send the track URI back to the client.
      res.send({ uri: trackUri });
    })
    .catch((err) => {
      console.error('Search Error:', err);
      res.send('Error occurred during search');
    });
});

// Route handler for the play endpoint.
app.get('/play', (req, res) => {
  // Extract the track URI from the query parameters.
  const { uri } = req.query;

  // Send a request to Spotify to start playback of the track with the given URI.
  spotifyApi
    .play({ uris: [uri] })
    .then(() => {
      res.send('Playback started');
    })
    .catch((err) => {
      console.error('Play Error:', err);
      res.send('Error occurred during playback');
    });
});

app.get('/profile', (req, res) => {
  spotifyApi
    .getMe()
    .then((userData) => {
      const userProfile = {
        display_name: userData.body.display_name,
        email: userData.body.email,
        country: userData.body.country,
        followers: userData.body.followers.total,
        id: userData.body.id,
        uri: userData.body.uri,
        images: userData.body.images,
      };

      res.send(userProfile);
    })
    .catch((err) => {
      console.error('Profile Error:', err);
      res.send('Error occurred while fetching user profile');
    });
});

app.get('/recentlyplayed', (req, res) => {
  const limit = 6;

  spotifyApi
    .getMyRecentlyPlayedTracks()
    .then((recentlyPlayedData) => {
      const recentlyPlayedTracks = recentlyPlayedData.body.items.map((item) => ({
        track_name: item.track.name,
        artist_name: item.track.artists.map((artist) => artist.name).join(', '),
        album_name: item.track.album.name,
        album_images: item.track.album.images,
        played_at: item.played_at,
        track_uri: item.track.uri,
      }));

      // Ambil hanya 6 item pertama
      const limitedRecentlyPlayedTracks = recentlyPlayedTracks.slice(0, limit);

      res.send(limitedRecentlyPlayedTracks);
    })
    .catch((err) => {
      console.error('Recently Played Error:', err);
      res.send('Error occurred while fetching recently played tracks');
    });
});

app.get('/mytopartists', (req, res) => {
  const timeRange = 'medium_term';

  spotifyApi
    .getMyTopArtists({ time_range: timeRange })
    .then((topArtistsData) => {
      const topArtists = topArtistsData.body.items.map((artist) => ({
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
        followers: artist.followers.total,
        uri: artist.uri,
        images: artist.images,
      }));

      res.send(topArtists);
    })
    .catch((err) => {
      console.error('Top Artists Error:', err);
      res.send('Error occurred while fetching top artists');
    });
});
app.get('/topttracks', (req, res) => {
  const timeRange = 'medium_term';

  spotifyApi
    .getMyTopTracks({ time_range: timeRange })
    .then((topTracksData) => {
      const topTracks = topTracksData.body.items.map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(', '),
        album: track.album.name,
        popularity: track.popularity,
        uri: track.uri,
        images: track.album.images,
      }));

      res.send(topTracks);
    })
    .catch((err) => {
      console.error('Top Tracks Error:', err);
      res.send('Error occurred while fetching top tracks');
    });
});

// Route handler for the recommendations endpoint.
app.get('/recommendations', async (req, res) => {
  try {
    // Get the user's top tracks to use as seed tracks for recommendations.
    const topTracksData = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'medium_term' });
    const seedTracks = topTracksData.body.items.map((track) => track.id);

    // Get recommendations based on the seed tracks.
    const recommendationsData = await spotifyApi.getRecommendations({ seed_tracks: seedTracks });
    const recommendedTracks = recommendationsData.body.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      popularity: track.popularity,
      uri: track.uri,
      images: track.album.images,
    }));
    // Send the recommended tracks data back to the client.
    res.send(recommendedTracks);
  } catch (err) {
    console.error('Recommendations Error:', err);
    res.send('Error occurred while fetching recommendations');
  }
});

app.get('/browsecategories', async (req, res) => {
  try {
    const categoryIds = ['party', 'pop', 'hiphop', 'rock'];

    const categoriesData = await spotifyApi.getCategories({ category_ids: categoryIds });
    const categories = categoriesData.body.categories.items.map((category) => ({
      id: category.id,
      name: category.name,
      icons: category.icons,
      href: category.href,
    }));

    res.send(categories);
  } catch (err) {
    console.error('Browse Categories Error:', err);
    res.send('Error occurred while fetching browse categories');
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
