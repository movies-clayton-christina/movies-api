import {OMDB_API_KEY} from "./keys.js";

$(function () {

    const MOVIES_URL = "https://fantastic-fortune-syrup.glitch.me/movies/";
    const OMDB_URL = "http://www.omdbapi.com/";

    const movieContent = $("#movie-content");

    let genres = new Set();
    let fields = new Set();
    let titles = new Set();
    let omdbMovieResult;

    function getMovies() {
        return $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    return data;
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    function getMovie(id) {
        return $.ajax(
            {
                url: MOVIES_URL + id,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    return data;
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }

    getMovie(3).then ((movie) =>
    console.log(movie));

    $("#select").change(function () {
        if ($(this).val() == 1) {
            sortByGenre();
        } else if ($(this).val() == 2) {
            sortByTitle();
        } if ($(this).val() == 3) {
            sortByRating();
        }
    });

 /*   $("#genre-sort").click(sortByGenre);
    $("#title-sort").click(sortByTitle);
    $("#rating-sort").click(sortByRating);*/
    $("#rebuild").click(rebuildMovieDatabase);

    function sortBy(selector) {
        let lis = movieContent.children();
        console.log("movieContent Length: " + lis.length);
        lis.sort(function (a, b) {
            return $(a).find(selector).text().localeCompare($(b).find(selector).text());
        });
        $.each(movieContent.children(), function (idx, itm) {
            itm.remove();
        });
        $.each(lis, function(idx, itm) { movieContent.append(itm); });
    }

    function sortByGenre() {
        sortBy(".card-text");
    }

    function sortByTitle() {
        sortBy(".card-title");
    }

    function sortByRating() {
        sortBy(".rating");
    }

    function popCards(movies) {
        let card = '';

        movies.forEach(function (movie) {
            titles.add(movie.Title);
            movie.Genre.split(', ').forEach(function (genre) {
                genres.add(genre)
            });
            Object.keys(movie).forEach(function (field) {
                fields.add(field)
            });

            card += `<li>
                        <div class="card" id="${movie.id}">
                            <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
                            <div class="card-body w-100">
                                <h6 class="card-title fw-bold d-none">${movie.Title}</h6>
                                <p class="card-text mb-0 fs-6">${movie.Genre}</p>
                                <div class="d-flex flex-row justify-content-around w-80">
                                    <p class="rating align-middle d-flex flex-row">${movie.imdbRating}</p>
                                    <button type="button" class="edit-btn btn fs-5" data-bs-toggle="modal" data-bs-target="#editModal">
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                    <button class="delete-btn btn fs-5" type="submit">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>`;

        });

        $('#movie-content').html(card);

    }

    //delete movies
    movieContent.on("click", "button.delete-btn", function () {
        let id = $(this).parent().parent().parent().attr('id');
        console.log(MOVIES_URL + "/" + id);
        $.ajax({
            url: MOVIES_URL + "/" + id,
            type: 'DELETE',
            success: function () {
                // Do something with the result
                console.log("Movie deleted")
                $('#' + id).parent().remove();
            }
        });
    });

    /*//date conversion from dd mmm yyyy to yyyy-mm-dd
    function dateConversionFromStringToNums(string) {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let date = string.split(" ");
        console.log(date);
        for (let j = 0; j < months.length; j++) {
            if (date[1] === months[j]) {
                date[1] = (j + 1).toString().padStart(2, "0");
            }
        }
        return `${date[2]}-${date[1]}-${date[0]}`;
    }
        console.log(dateConversionFromStringToNums("11 Jan 2008"));*/

    //edit movies
    //open modal and prefill
    movieContent.on("click", "button.edit-btn", function (e) {
        /*let card = $(e.currentTarget).parent().parent().parent();
        //link
        let postLink = card.children('img').attr('src');
        $("#editPoster").val(postLink);
        //title
        let title = card.children().first().next().children().first().text();
        $("#editTitle").val(title);
        //genres
        let genres = card.children().first().next().children().first().next().text();
        $("#editGenre").val(genres);
        //rating
        let rating = card.children().first().next().children().first().next().next().children().first().text();
        $("#editImdbRating").val(rating);*/
        let id = $(this).parent().parent().parent().attr('id');
        $("#editId").val(id);
        getMovie(id)
            .then ((movie) => {
                $("#editTitle").val(movie.Title);
                $("#editYear").val(movie.Year);
                $("#editRated").val(movie.Rated);
                $("#editReleased").val(convertMojoDatetoDate(movie.Released));
                console.log(convertMojoDatetoDate(movie.Released));
                $("#editRuntime").val(movie.Runtime);
                $("#editGenre").val(movie.Genre);
                $("#editDirector").val(movie.Director);
                $("#editWriter").val(movie.Writer);
                $("#editActors").val(movie.Actors);
                $("#editPlot").val(movie.Plot);
                $("#editLanguage").val(movie.Language);
                $("#editCountry").val(movie.Country);
                $("#editAwards").val(movie.Awards);
                $("#editPoster").val(movie.Poster);
                //$("#editReleased").val(movie.Ratings);
                $("#editMetascore").val(movie.Metascore);
                $("#editImdbRating").val(movie.imdbRating);
                $("#editImdbVotes").val(movie.imdbVotes);
                $("#editImdbId").val(movie.imdbID);
                $("#editType").val(movie.Type);
                $("#editDvdReleased").val(convertMojoDatetoDate(movie.DVD));
                $("#editBoxOffice").val(movie.BoxOffice);
                $("#editProduction").val(movie.Production);
                $("#editResponse").val(movie.Response);
                $("#editWebsite").val(movie.Website);
                $("#editId").val(id);
        });

    });

    //disable edit submit button while ajax is running
    $(document).ajaxStart(function () {
        $("#submitEdit").attr("disabled", true);
    });
    $(document).ajaxComplete(function () {
        $("#submitEdit").attr("disabled", false);
    });


    $('#submitEdit').click(function () {
        let title = document.getElementById("editTitle").value;
        let year = document.getElementById("editYear").value;
        let rated = document.getElementById("editRated").value;
        let released = convertDateToMojoDate(document.getElementById("editReleased").value);
        let runtime = document.getElementById("editRuntime").value;
        let genre = document.getElementById("editGenre").value;
        let director = document.getElementById("editDirector").value;
        let writer = document.getElementById("editWriter").value;
        let actors = document.getElementById("editActors").value;
        let plot = document.getElementById("editPlot").value;
        let language = document.getElementById("editLanguage").value;
        let country = document.getElementById("editCountry").value;
        let awards = document.getElementById("editAwards").value;
        let poster = document.getElementById("editPoster").value;
        //Ratings
        let metascore = document.getElementById("editMetascore").value;
        let rating = document.getElementById("editImdbRating").value;
        let imdbVotes = document.getElementById("editImdbVotes").value;
        let imdbID = document.getElementById("editImdbId").value;
        let type = document.getElementById("editType").value;
        let dvd = convertDateToMojoDate(document.getElementById("editDvdReleased").value);
        let boxOffice = document.getElementById("editBoxOffice").value;
        let production = document.getElementById("editProduction").value;
        let response = document.getElementById("editResponse").value;
        let website = document.getElementById("editWebsite").value;
        let id = document.getElementById("editId").value;

        const editMovie = {
            Title: title,
            Year: year,
            Rated: rated,
            Released: released,
            Runtime: runtime,
            Genre: genre,
            Director: director,
            Writer: writer,
            Actors: actors,
            Plot: plot,
            Language: language,
            Country: country,
            Awards: awards,
            Poster: poster,
            //Ratings: rating
            Metascore: metascore,
            imdbRating: rating,
            imdbVotes: imdbVotes,
            imdbID: imdbID,
            Type: type,
            DVD: dvd,
            BoxOffice: boxOffice,
            Production: production,
            Response: response,
            Website: website,
            id: id
        };
        console.log(editMovie);

        //under submit for edit
        console.log(MOVIES_URL + "/" + id);
        $.ajax({
            url: MOVIES_URL + "/" + id,
            type: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(editMovie)
        }).done(function () {
            console.log("Movie edited")
            getMovies()
            .then ((movies) => {buildCarousel(movies)});
            /*let element = $("#editLabel");
            element.text(element.text().replace("Edit A Movie", "Movie Has Been Edited"));*/
        });

    });

    //disable add button while ajax is running
    $(document).ajaxStart(function () {
        $("#submitAdd").attr("disabled", true);
    });
    $(document).ajaxComplete(function () {
        $("#submitAdd").attr("disabled", false);
    });


    //add a movie
    $('#submitAdd').click(function () {
        let newMovie = {
            Title: $("#addTitle").val(),
            Year: $("#addYear").val(),
            Rated: $("#addRated").val(),
            Released:  convertDateToMojoDate($("#addReleased").val()),
            Runtime: $("#addRuntime").val(),
            Genre: $("#addGenre").val(),
            Director: $("#addDirector").val(),
            Writer: $("#addWriter").val(),
            Actors: $("#addActors").val(),
            Plot: $("#addPlot").val(),
            Language: $("#addLanguage").val(),
            Country: $("#addCountry").val(),
            Awards: $("#addAwards").val(),
            Poster: $("#addPoster").val(),
            Ratings: [{Source: "Internet Movie Database", Value: $("#addImdbRating").val() + "/10"},
                {Source: "Rotten Tomatoes", Value: ""},
                {Source: "Metacritic", Value: $("#addMetascore").val() + "/100" }],
            Metascore: $("#addMetascore").val(),
            imdbRating: $("#addImdbRating").val(),
            imdbVotes: $("#addImdbVotes").val(),
            imdbID: $("#addImdbId").val(),
            Type: $("#addType").val(),
            DVD: convertDateToMojoDate($("#addDvdReleased").val()),
            BoxOffice: $("#addBoxOffice").val(),
            Production: $("#addProduction").val(),
            Response: $("#addResponse").val(),
            Website: $("#addWebsite").val(),
        };

        $.ajax({
            url: MOVIES_URL,
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(newMovie)
        }).done(function () {
            refreshAutoComplete();
            console.log(`${newMovie.Title} ADDED to database`)
            getMovies()
                .then((movies) => { buildCarousel(movies) });
        });

    });

    //search database
    function searchDb() {
        return $.ajax(
            {
                url: MOVIES_URL,
                type: "GET",
                dataType: "json",
                success: (data) => {
                    return data;
                },
                error: function (error) {
                    console.log(error);
                }
            })
    }

    function convertAbbrToMonth(abbr) {
        let abbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return abbrs.indexOf(abbr) + 1;
    }

    function convertMonthToAbbr(m) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
    }

    function convertDateToMojoDate(date) {
        if(date === "" || date === null || date === undefined) {
            return "";
        }
        let dateArray = date.split("-");
        let month =  convertMonthToAbbr(dateArray[1]);
        let day = dateArray[2].toString().padStart(2, "0");
        let year = dateArray[0];
        return day + " " + month + " " + year;
    }

    function convertMojoDatetoDate(input) {
        if(input === "" || input === null || input === undefined) {
            return "";
        }
        let dateArray = input.split(" ");
        return dateArray[2] + "-" + convertAbbrToMonth(dateArray[1]).toString().padStart(2, "0") + "-" + dateArray[0];
    }

    $("#close-add").click(function () {
        let selector = "#addModal > div > div > div.modal-body.bg-black > div > div > div.mojo-notification.me-5";
        $(selector).addClass("d-none");
    });

    // $("input").on("keyup", function (e) {   e.preventDefault(); });
    // $("input").on("change", function (e) {   e.preventDefault(); });

    $("#searchOMDB").click(function () {
        omdbMovieResult = searchMovie($("#OMDB-input").val())
            .then(movie => {
                $("#addTitle").val(movie.Title)
                $("#addYear").val(movie.Year);
                $("#addRated").val(movie.Rated);
                $("#addReleased").val(convertMojoDatetoDate(movie.Released));
                $("#addRuntime").val(movie.Runtime);
                $("#addGenre").val(movie.Genre);
                $("#addDirector").val(movie.Director);
                $("#addWriter").val(movie.Writer);
                $("#addActors").val(movie.Actors);
                $("#addPlot").val(movie.Plot);
                $("#addLanguage").val(movie.Language);
                $("#addCountry").val(movie.Country);
                $("#addAwards").val(movie.Awards);
                $("#addPoster").val(movie.Poster);
                $("#addRatings").val(movie.Ratings);
                $("#addMetascore").val(movie.Metascore);
                $("#addImdbId").val(movie.imdbID);
                $("#addImdbRating").val(movie.imdbRating);
                $("#addImdbVotes").val(movie.imdbVotes);
                $("#addimdbID").val(movie.imdbID);
                $("#addType").val(movie.Type);
                $("#addDvdReleased").val(convertMojoDatetoDate(movie.DVD));
                $("#addBoxOffice").val(movie.BoxOffice);
                $("#addProduction").val(movie.Production);
                $("#addResponse").val(movie.Response);
                $("#addWebsite").val(movie.Website);

                $(".mojo-notification").removeClass("d-none");
            })
    });

    $("#db-search-btn").click(function () {
        let movieTitle = $("#search-input").val();
        console.log(movieTitle);
        searchDb()
            .then((data) => {
                return data.filter((movie) => movie.Title.toLowerCase().includes(movieTitle.toLowerCase()))
            })
            .then((movie) => {
                let target = $(`#${movie[0].id}`);
                $(".hot-card").removeClass("hot-card");
                $(target).addClass("hot-card");
                $(target).parent().remove();
                $("#movie-content").prepend($(target).parent());
                $(target).parent().parent().scrollLeft(0);
            });
    });



    //search omdb
    let data = {
        "i": "tt3896198",
        "apikey": OMDB_API_KEY
    }

    function searchMovie(movieTitle) {
        data.t = movieTitle;
        return $.ajax(
            {
                url: OMDB_URL,
                type: "GET",
                data: data,
                dataType: "json",
                success: (movie) => {
                    return movie;
                },
                error: function (error) {
                    console.log(error);
                }
            }
        )
    }


    // This will add 257 movies to the database
    // { "movies": [] }
    function rebuildMovieDatabase() {
        fetch("/data/movie.json")
            .then(response => response.json())
            .then(response => {
                    //response.movies.forEach(movie => { postMovie(movie)})
                    for (let i = 10; i < response.movies.length; i++) {
                        //if(movieNotInDatabase) {
                            postMovie(response.movies[i]);
                        //}
                    }
                }
            );
    }

    function postMovie(movie) {
        const url = 'https://fantastic-fortune-syrup.glitch.me/movies';

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie),
        };

        fetch(url, options)
            .then(response => response.json())
            .then(movie => console.log(`${movie.Title} successfully posted`))
            .catch(error => console.error(error));

    }

    function buildCarousel(movies) {
        popCards(movies);
        setTimeout(() => {
            $(".navbar").removeClass("d-none");
            $(".ticker").removeClass("d-none");
            $("#movie-content").removeClass("d-none");
            $("#loading-image").remove();
        }, 1200)
        // console.log(genres);
        // console.log(fields);
        refreshAutoComplete();
    }

    function refreshAutoComplete() {
        $("#search-input").autocomplete({source: Array.from(titles)});
    }

    getMovies()
        .then((movies) => { buildCarousel(movies) });

});
