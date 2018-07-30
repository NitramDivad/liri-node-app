# ** Node.JS Assigning:  liri-node-app
#
###LIRI Node App


LIRI is a _Language_ Interpretation and Recognition Interface. LIRI is a command line node app that accepts parameters and returns data based on that input.

LIRI will accept input to retrieve data from the Twitter, Spotify and OMDB API's.  

Input string format for the LIRI commands are as follows:

    * 'my-tweets'
        * The 20 most recent tweets will be returned for the Twitter handle
        * Following this command should be the Twitter handle
        * Example:  node liri.js 'my-tweets' 'nasa'

    * 'spotify-this-song'
        * The top 5 results will be returned for the song title
        * Following this command should be the title of the song
        * Example:  node liri.js 'spotify-this-song' 'Lyin Eyes'
        * Note:  If a song title is not entered, a default title of 'The Sign' by Ace of Base will be used

    * 'movie-this'
        * Following this command should be the title of the movie
        * Example:  node liri.js 'movie-this' 'Star Wars'
        * Note:  If a movie title is not entered, a default title of 'Mr. Nobody' will be used

    * 'do-what-it-says'
        * This command is a stand-alone command
        * It retrieves the command along with its parameter from the random.txt file
        * Currently it is set to perform a 'spotify-this-song' for 'I Want it That Way'

As well as logging the output to the console, the output is written to a log file named log.txt.


## **Created by:** #

[David Martin](mailto:webdevelopment.du@gmail.com)
[GitHub](https://github.com/nitramdivad)

[Launch Site](https://nitramdivad.github.io/)

