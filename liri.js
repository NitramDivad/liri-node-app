require("dotenv").config();

var request = require('request'),
    fs = require('fs'),
    keys = require('./keys'),
    Twitter = require('twitter'),
    Spotify = require('node-spotify-api'),

    argvs = process.argv,
    
    spotify = new Spotify(keys.spotify),
    twitter = new Twitter(keys.twitter);


initialize();

//***************************************************************/
function initialize() {
//***************************************************************/

    var whichCommand = '',
        whatSearch = '';

    whichCommand = argvs[2];
    whatSearch = buildSearch(argvs, 3)
    liri(whichCommand, whatSearch);
}

//***************************************************************/
function liri(command, searchTerm) {
//***************************************************************/

    switch (command) {
        case 'my-tweets':
            callTwitter(searchTerm);
            break;
        case 'spotify-this-song':
            callSpotify(searchTerm);
            break;
        case 'movie-this':
            callOMDB(searchTerm);
            break;
        case 'do-what-it-says':
            callDWIS();
            break;
        default:
            console.log('Function Not Defined');
    }
}

//***************************************************************/
function buildSearch(items, idx) {
//***************************************************************/

    var strSearch;
    for (var i = idx; i < items.length; i++) {
        if (i > idx)
            strSearch += '+' + items[i];
        else
            strSearch = items[i];
    }
    console.log(strSearch)
    return strSearch;
}

//***************************************************************/
function callTwitter(handle) {
//***************************************************************/

    var params = {q: 'from:'+handle, result_type: 'recent', count: 20};
    twitter.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            (tweets.statuses).forEach(function(tweet) {
                console.log('\n' + tweet.text + '\n' + tweet.created_at + '\n')
            });
        }
    });
};

//***************************************************************/
function callSpotify(title) {
//***************************************************************/

    var params = {type: 'track',
                    query: title != undefined ? title : 'The+Sign+Ace+Of+Base',
                    limit: 1}

    spotify.search(params, function(error, data) {
        if (!error) {
            if ((data.tracks.items).length > 0) {
                (data.tracks.items).forEach(function(song) {
                    console.log('\nAlbum: ' + song.album.name +
                                '\nSong: ' + song.name +
                                '\nArtist: ' + song.artists[0].name +
                                '\nPreview: ' + (song.preview_url !== null ? song.preview_url : 'Not available')
                                )
                })
            }
            else
                console.log('\nSong: ' + title + ' was not found.')
        }            
    });
}

//***************************************************************/
function callOMDB(movieName) {
//***************************************************************/

    var title = movieName != undefined ? movieName : 'Mr.+Nobody',
    params = 'http://www.omdbapi.com/?t=' + 
             title +
             '&type=movie' +
             '&tomatoes=true' +
             '&apikey=trilogy'

    request(params, function(error, response, data) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(data);
            var tomato = movie.tomatoRating;

            (movie.Ratings).forEach(function(rating) {
                if (rating.Source === 'Rotten Tomatoes')
                    tomato = rating.Value;
            });

            console.log('\nTitle: ' + movie.Title +
                        '\nYear Released: ' + movie.Year +
                        '\nIMDB Rating: ' + movie.imdbRating +
                        '\nRotten Tomatoes Rating: ' + tomato +
                        '\nProduction Country: ' + movie.Country +
                        '\nMovie Language: ' + movie.Language +
                        '\nMovie Plot: ' + movie.Plot +
                        '\nActors : ' + movie.Actors
                    )
        }
    });
}

//***************************************************************/
function callDWIS() {
//***************************************************************/

    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (!error) {
            var dwis = data.split(',');
            whatSearch = buildSearch(dwis[1].split(' '), 0);
            liri(dwis[0], whatSearch);
        }
        else
            console.log(error);
    });
}