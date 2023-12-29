// Load environment variables from the .env file.
require('dotenv').config();

// Import the necessary modules.
const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
var cors = require('cors');

// Initialize an Express application.
const app = express();
app.use(cors());
app.use(bodyParser.json());
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
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-library-modify',
    'playlist-modify-public',
    'playlist-modify-private',
  ];
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
      res.send('Login successful!');

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

app.get('/search', (req, res) => {
  const { q, type } = req.query;

  const searchType = type || 'track';

  const searchTypesArray = searchType.split(',');

  spotifyApi
    .search(q, searchTypesArray, { limit: 20 })
    .then((searchData) => {
      let results = [];
      searchTypesArray.forEach((searchType) => {
        switch (searchType) {
          case 'track':
            results = results.concat(
              searchData.body.tracks.items.map((track) => ({
                name: track.name,
                artists: track.artists.map((artist) => artist.name).join(', '),
                album: track.album.name,
                popularity: track.popularity,
                uri: track.uri,
                images: track.album.images,
                duration: track.duration_ms,
                preview: track.preview_url,
                id: track.id,
              }))
            );
            break;
          case 'album':
            results = results.concat(
              searchData.body.albums.items.map((album) => ({
                name: album.name,
                artists: album.artists.map((artist) => artist.name).join(', '),
                release_date: album.release_date,
                uri: album.uri,
                images: album.images,
              }))
            );
            break;
          case 'artist':
            results = results.concat(
              searchData.body.artists.items.map((artist) => ({
                name: artist.name,
                genres: artist.genres.join(', '),
                popularity: artist.popularity,
                uri: artist.uri,
                images: artist.images,
              }))
            );
            break;
          default:
            break;
        }
      });

      res.send(results);
    })
    .catch((err) => {
      console.error('Search Error:', err);
      res.send('Error occurred during search');
    });
});

app.get('/play', (req, res) => {
  const { uri } = req.query;

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

app.get('/next', async (req, res) => {
  try {
    await spotifyApi.skipToNext();
    res.send('Next song played');
  } catch (err) {
    console.error('Next Song Error:', err);
    res.send('Error occurred during next song playback');
  }
});

app.get('/previous', async (req, res) => {
  try {
    await spotifyApi.skipToPrevious();
    res.send('Previous song played');
  } catch (err) {
    console.error('Previous Song Error:', err);
    res.send('Error occurred during previous song playback');
  }
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
        id: artist.id,
      }));

      res.send(topArtists);
    })
    .catch((err) => {
      console.error('Top Artists Error:', err);
      res.send('Error occurred while fetching top artists');
    });
});

app.get('/artist/:artistUri', async (req, res) => {
  try {
    const { artistUri } = req.params;

    const artistData = await spotifyApi.getArtist(artistUri);

    const artistDetails = {
      name: artistData.body.name,
      genres: artistData.body.genres.join(', '),
      popularity: artistData.body.popularity,
      followers: artistData.body.followers.total,
      uri: artistData.body.uri,
      images: artistData.body.images,
    };

    res.send(artistDetails);
  } catch (err) {
    console.error('Artist Details Error:', err);
    res.send('Error occurred while fetching artist details');
  }
});

// Route handler for getting top songs of an artist.
app.get('/topsongs/:artistId', async (req, res) => {
  try {
    // Extract the artist ID from the request parameters.
    const { artistId } = req.params;

    // Get the top songs of the artist.
    const topSongsData = await spotifyApi.getArtistTopTracks(artistId, 'US'); // 'US' is the country code, adjust as needed

    // Extract relevant information from the top songs data.
    const topSongs = topSongsData.body.tracks.map((track) => ({
      name: track.name,
      uri: track.uri,
      preview: track.preview_url,
      album: track.album.name,
      images: track.album.images,
      id: track.id,
    }));

    // Send the top songs back to the client.
    res.send(topSongs);
  } catch (err) {
    console.error('Top Songs Error:', err);
    res.send('Error occurred while getting top songs of the artist');
  }
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

app.get('/recommendations', async (req, res) => {
  try {
    const topTracksData = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'medium_term' });
    const seedTracks = topTracksData.body.items.map((track) => track.id);

    const recommendationsData = await spotifyApi.getRecommendations({ seed_tracks: seedTracks });
    const recommendedTracks = recommendationsData.body.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      popularity: track.popularity,
      uri: track.uri,
      images: track.album.images,
      preview: track.preview_url,
    }));

    res.send(recommendedTracks);
  } catch (err) {
    console.error('Recommendations Error:', err);
    res.send('Error occurred while fetching recommendations');
  }
});

app.get('/recommendations/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;

    const recommendationsData = await spotifyApi.getRecommendations({
      seed_tracks: [trackId],
      limit: 10,
    });

    const recommendedTracks = recommendationsData.body.tracks.map((track) => track.uri);

    await spotifyApi.play({ uris: recommendedTracks });

    res.send('Recommended tracks added to the queue');
  } catch (err) {
    console.error('Recommendations Error:', err);
    res.send('Error occurred while adding recommended tracks to the queue');
  }
});

app.get('/browsecategories', async (req, res) => {
  try {
    const categoryIds = ['party', 'pop', 'rock'];

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

app.get('/myplaylists', async (req, res) => {
  try {
    const playlistsData = await spotifyApi.getUserPlaylists();
    const playlists = playlistsData.body.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      owner: playlist.owner.display_name,
      total_tracks: playlist.tracks.total,
      uri: playlist.uri,
      images: playlist.images,
    }));

    res.send(playlists);
  } catch (err) {
    console.error('Playlists Error:', err);
    res.send('Error occurred while fetching user playlists');
  }
});

app.get('/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlistData = await spotifyApi.getPlaylist(playlistId);

    const playlistDetails = {
      name: playlistData.body.name,
      description: playlistData.body.description,
      owner: playlistData.body.owner.display_name,
      total_tracks: playlistData.body.tracks.total,
      tracks: playlistData.body.tracks.items.map((item) => ({
        name: item.track.name,
        artists: item.track.artists.map((artist) => artist.name).join(', '),
        album: item.track.album.name,
        popularity: item.track.popularity,
        uri: item.track.uri,
        images: item.track.album.images,
        preview: item.track.preview_url,
        id: item.track.id,
      })),
    };

    res.send(playlistDetails);
  } catch (err) {
    console.error('Playlist Details Error:', err);
    res.send('Error occurred while fetching playlist details');
  }
});

// Route handler for creating a new playlist.
app.post('/createplaylist', async (req, res) => {
  try {
    // Extract the user ID and playlist name from the request body.
    const { playlistName } = req.body;

    // Create a new playlist.
    const newPlaylist = await spotifyApi.createPlaylist(playlistName, {
      description: 'New Playlist',
      public: true,
    });

    // Send the details of the new playlist back to the client.
    res.send(newPlaylist.body);
  } catch (err) {
    console.error('Create Playlist Error:', err);
    res.send('Error occurred while creating a new playlist');
  }
});

// Route handler for renaming a playlist.
app.put('/renameplaylist/:playlistId', async (req, res) => {
  try {
    // Extract the playlist ID and new name from the request body.
    const { playlistId } = req.params;
    const { newName } = req.body;

    // Rename the playlist.
    await spotifyApi.changePlaylistDetails(playlistId, { name: newName });

    res.send('Playlist name updated');
  } catch (err) {
    console.error('Rename Playlist Error:', err);
    res.send('Error occurred while renaming the playlist');
  }
});

// Route handler for deleting a playlist.
app.delete('/deleteplaylist/:playlistId', async (req, res) => {
  try {
    // Extract the playlist ID from the request parameters.
    const { playlistId } = req.params;

    // Unfollow (delete) the playlist.
    const unfollowPlaylistResponse = await spotifyApi.unfollowPlaylist(playlistId);

    if (unfollowPlaylistResponse.statusCode === 200) {
      res.send('Playlist deleted successfully');
    } else {
      console.error('Delete Playlist Error:', unfollowPlaylistResponse.body);
      res.status(unfollowPlaylistResponse.statusCode).send('Error occurred while deleting playlist');
    }
  } catch (err) {
    console.error('Delete Playlist Error:', err);
    res.send('Error occurred while deleting playlist');
  }
});

// Function to check if a track is in a playlist.
async function isTrackInPlaylist(playlistId, trackId) {
  try {
    // Get the tracks in the playlist.
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId);

    // Check if the track ID is in the playlist.
    return playlistTracks.body.items.some((item) => item.track.id === trackId);
  } catch (err) {
    console.error('Check Playlist Error:', err);
    throw err;
  }
}

// Route handler for adding a track to a playlist.
app.post('/addtoplaylist/:playlistId/:trackId', async (req, res) => {
  try {
    // Extract the playlist ID and track ID from the request parameters.
    const { playlistId, trackId } = req.params;

    const trackUri = `spotify:track:${trackId}`;

    // Check if the track is already in the playlist.
    const isTrackInPlaylistResult = await isTrackInPlaylist(playlistId, trackId);

    if (isTrackInPlaylistResult) {
      res.send('Track is already in the playlist');
    } else {
      // Add the track to the playlist.
      await spotifyApi.addTracksToPlaylist(playlistId, [trackUri]);
      res.send('Track added to the playlist');
    }
  } catch (err) {
    console.error('Add to Playlist Error:', err);
    res.send('Error occurred while adding track to the playlist');
  }
});

// Route handler for removing tracks from a playlist.
app.delete('/removefromplaylist/:playlistId', async (req, res) => {
  try {
    // Extract the playlist ID from the request parameters.
    const { playlistId } = req.params;

    // Extract an array of track URIs from the request body.
    const { tracks } = req.body;

    // Remove the tracks from the playlist.
    const response = await spotifyApi.removeTracksFromPlaylist(playlistId, tracks);

    // Send a success response.
    res.send('Tracks removed from playlist successfully');
  } catch (error) {
    console.error('Remove Tracks Error:', error);
    res.status(500).send('Error occurred while removing tracks from playlist');
  }
});

app.get('/likedsongs', async (req, res) => {
  try {
    const likedSongsData = await spotifyApi.getMySavedTracks({ limit: 50 });
    const likedSongs = likedSongsData.body.items.map((track) => ({
      name: track.track.name,
      artists: track.track.artists.map((artist) => artist.name).join(', '),
      album: track.track.album.name,
      popularity: track.track.popularity,
      id: track.track.id,
      uri: track.track.uri,
      images: track.track.album.images,
      preview: track.track.preview_url,
    }));

    const likedSongsLenght = likedSongs.length;

    res.send({ likedSongs, likedSongsLenght });
  } catch (err) {
    console.error('Liked Songs Error:', err);
    res.send('Error occurred while fetching liked songs');
  }
});

// Route handler for checking if a track is in Liked Songs.
app.get('/isliked/:trackId', async (req, res) => {
  try {
    // Extract the track ID from the request parameters.
    const { trackId } = req.params;

    // Check if the track is in Liked Songs.
    const isLiked = await spotifyApi.containsMySavedTracks([trackId]);

    // Send the result (true or false) back to the client.
    res.send({ isLiked });
  } catch (err) {
    console.error('Check Liked Songs Error:', err);
    res.send('Error occurred while checking if track is in Liked Songs');
  }
});

// Route handler for adding a track to Liked Songs.
app.get('/like/:trackId', async (req, res) => {
  try {
    // Extract the track ID from the request parameters.
    const { trackId } = req.params;

    // Add the track to Liked Songs.
    await spotifyApi.addToMySavedTracks([trackId]);

    res.send('Track added to Liked Songs');
  } catch (err) {
    console.error('Add to Liked Songs Error:', err);
    res.send('Error occurred while adding track to Liked Songs');
  }
});

// Route handler for removing a track from Liked Songs.
app.get('/unlike/:trackId', async (req, res) => {
  try {
    // Extract the track ID from the request parameters.
    const { trackId } = req.params;

    // Remove the track from Liked Songs.
    await spotifyApi.removeFromMySavedTracks([trackId]);

    res.send('Track removed from Liked Songs');
  } catch (err) {
    console.error('Remove from Liked Songs Error:', err);
    res.send('Error occurred while removing track from Liked Songs');
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
