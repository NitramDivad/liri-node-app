require("dotenv").config();

var request = require('request'),
    fs = require('fs'),
    keys = require('./keys'),
    Twitter = require('twitter'),
    Spotify = require('node-spotify-api'),

    argvs = process.argv,
    doWIS = false,
    results = '',
    whatSearch = '';
    
    spotify = new Spotify(keys.spotify),
    twitter = new Twitter(keys.twitter);


initializeLiri();

//***************************************************************/
function initializeLiri() {
//***************************************************************/

    var whichCommand;

    whichCommand = argvs[2];
    whatSearch = buildSearch(argvs, 3);

    liri(whichCommand, whatSearch);
};

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
            consoleAndLog('\nFunction Not Defined','Command Not Found');
    }
};

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

    return strSearch;
};

//***************************************************************/
function callTwitter(handle) {
//***************************************************************/

    var params = {q: 'from:'+handle, result_type: 'recent', count: 20};

    results = '';
    twitter.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            if ((tweets.statuses).length > 0) {
                (tweets.statuses).forEach(function(tweet) {
                    results += '\n' + tweet.text + '\n' + tweet.created_at + '\n';
                });
                consoleAndLog(results, 'Twitter Call');
            }
            else {
                consoleAndLog('\nNo tweets for Twitter handle or no handle provided for call', 'Twitter Call')
            }
        }
        else
            consoleAndLog(error, 'Twitter Call');
    });
};

//***************************************************************/
function callSpotify(title) {
//***************************************************************/

    var params = {type: 'track',
                  query: title != undefined ? title : 'The+Sign+Ace+Of+Base',
                  limit: 5};

    results = '';
    spotify.search(params, function(error, data) {
        if (!error) {
            if ((data.tracks.items).length > 0) {
                (data.tracks.items).forEach(function(song) {
                    results += '\nAlbum: ' + song.album.name +
                               '\nSong: ' + song.name +
                               '\nArtist: ' + song.artists[0].name +
                               '\nPreview: ' + (song.preview_url !== null ? song.preview_url : 'Not available') + '\n'
                });
                consoleAndLog(results, 'Spotify Call');
            }
            else
                consoleAndLog('\nSong: ' + title + ' was not found.', 'Spotify Call');
        }            
    });
};

//***************************************************************/
function callOMDB(movieName) {
//***************************************************************/

    var title = movieName != undefined ? movieName : 'Mr.+Nobody',

    params = 'http://www.omdbapi.com/?t=' + 
             title +
             '&type=movie' +
             '&tomatoes=true' +
             '&apikey=trilogy'

    results = '';
    request(params, function(error, response, data) {

        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(data);

            if (movie.Error === 'Movie not found!')
                consoleAndLog('\n' + movie.Error, 'OMDB Call');
            else if (movie.Response === 'True') {
                var tomato = movie.tomatoRating;
                
                if ((movie.Ratings).length > 0) {
                    (movie.Ratings).forEach(function(rating) {
                        if (rating.Source === 'Rotten Tomatoes')
                            tomato = rating.Value;
                    });
                }

                results = '\nTitle: ' + movie.Title +
                          '\nYear Released: ' + movie.Year +
                          '\nIMDB Rating: ' + movie.imdbRating +
                          '\nRotten Tomatoes Rating: ' + tomato +
                          '\nProduction Country: ' + movie.Country +
                          '\nMovie Language: ' + movie.Language +
                          '\nMovie Plot: ' + movie.Plot +
                          '\nActors: ' + movie.Actors;
                
                consoleAndLog(results, 'OMDB Call');
            }
            else
                consoleAndLog('\nUnknown Error', 'OMDB Call');
        }
        else
            consoleAndLog(error, 'OMDB Call');
    });
};

//***************************************************************/
function callDWIS() {
//***************************************************************/

    results = '';
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (!error) {
            var dwis = data.split(',');

            doWIS = true;
            whatSearch = buildSearch(dwis[1].split(' '), 0);
            liri(dwis[0], whatSearch);
        }
        else
            consoleAndLog(error, 'Do What It Says Call');
    });
};

//***************************************************************/
function consoleAndLog(results, whichCall) {
//***************************************************************/

    var header = '\n\n\n//******************************************/' +
                 '\n' + whichCall + 
                 (doWIS === true ? '\n  via Do What It Says' : '') +
                 '\n' + Date() +
                 '\n//******************************************/\n'

    fs.appendFile("log.txt", header + results, function(error) {
        if (error) {
            console.log(error);
        };
    });

    console.log(header + results + '\n');
    doWIS = false;
};