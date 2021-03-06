$(document).ready(function(){
    var urlTrend = "https://api.themoviedb.org/3/trending/movie/week?";
    var urlTrendSerie = "https://api.themoviedb.org/3/trending/tv/week?";
    var urlFilm = "https://api.themoviedb.org/3/search/movie?";
    var urlTV = "https://api.themoviedb.org/3/search/tv?";


    insertTrend("movie", urlTrend, "Film");
    insertTrend("tv", urlTrendSerie, "Serie");

    $("#searchbutton").click(function(){
        $(".hide").removeClass("hide");
        var ricerca = $("#searchbar").val();
        $(".results-Film").html("");
        $(".results-Serie").html("");
        search(ricerca, urlFilm, "Film");
        search(ricerca, urlTV, "Serie");


    });
    $(document).keydown(function(event){
        if (event.keyCode == 13 || event.which == 13) {
            var ricerca = $("#searchbar").val();
            $(".results-Film").html("");
            $(".results-Serie").html("");
            search(ricerca, urlFilm, "Film");
            search(ricerca, urlTV, "Serie");

        }
        });

    //Tasti scroll film

    $(".leftscroll.Film").click(function(){
        scrollButtonSx($(".leftscroll.Film"), $(".results-Film"))
    });
    $(".rightscroll.Film").click(function(){
        scrollButtonDx($(".rightscroll.Film"), $(".results-Film"))
    })
    $(".leftscroll.Serie").click(function(){
        scrollButtonSx($(".leftscroll.Serie"), $(".results-Serie"))
    });
    $(".rightscroll.Serie").click(function(){
        scrollButtonDx($(".rightscroll.Serie"), $(".results-Serie"))
    })

});

// FUNZIONI

//funzioni scrollButtons
function scrollButtonDx(button, place){
    var buttonRight= $(button);
    var position= $(place).scrollLeft();
    return $(place).scrollLeft(position+=200);
}
function scrollButtonSx(button, place){
    var buttonRight= $(button);
    var position= $(place).scrollLeft();
    return $(place).scrollLeft(position-=200);
}


//funzione chiamata AJAX film e serie in trend

function insertTrend(data, url, type){
    $.ajax(
        {
            url: url,
            method: "GET",
            data: {
                api_key : "9fa935e79bf8d2bc13f91abd5721f117",
                media_type: data,
                time_window: "week",
                language: "it-IT"
            },
            success: function(movie){
                movieProfile(movie, type)
            }, error: function(){
                alert("Si è presentato un errore nella ricerca di"+type)
            }
    })
}
//funzione chiamata AJAX ricerca film e serie
function search(data, url, type){
    $.ajax(
        {
            url: url,
            method: "GET",
            data: {
                api_key : "9fa935e79bf8d2bc13f91abd5721f117",
                query: data,
                language: "it-IT",
            },
            success: function(movie){
                movieProfile(movie, type)
            }, error: function(){
                alert("Si è presentato un errore nella ricerca di "+type)
            }
    })
}

// costruzione profili card film/Serie
function movieProfile(movie, type, urlCast){
        var selectedmovie = movie.results;
        for (var i = 0; i < selectedmovie.length; i++) {
            var poster = selectedmovie[i].poster_path;
            var src = 'https://image.tmdb.org/t/p/w342/' + poster;
            var item = {
                "poster":addPoster(poster, selectedmovie[i].title),
                "title": selectedmovie[i].title || selectedmovie[i].name,
                "original-title": selectedmovie[i].original_title || selectedmovie[i].original_name,
                "language": language(selectedmovie[i].original_language),
                "vote": insertStars(selectedmovie[i].vote_average),
                "type" : type,
                "storyline": storyLine(selectedmovie[i]),

            };
            if (movie.total_results > 0) {
                stampa(item, type);
            }else {
                noResult(type); //ancora da fare
            }

        }
    }


//funzione stampa

function stampa(item, type){
    var source = $("#template").html();
    var template = Handlebars.compile(source);
    var html = template(item);
    $(".results-" + type).append(html);

};

//funzione stelle valutazione
function insertStars(n){
    var resto = n%2;
    var grade = Math.floor(n/2);
    var stars = "";
    for (var i = 0; i < 5; i++) {
        if (i<grade) {
            stars += '<i class="fas fa-star full"></i>';
        }else if (resto != 0) {
            stars += '<i class="fas fa-star-half-alt full"</i>';
            resto = 0;
        } else {
            stars += '<i class="far fa-star"></i>'
        }
    }
    return stars
};
// funzione lingua
function language (lang){
    var languages = ["it", "en"]
    if (languages.includes(lang)) {
        return '<img src="img/'+ lang+ '.png">'
    }else {
        return lang;
    }
};

// funzione aggiunge poster, ricorda null senza ""!
function addPoster(image, title){
    var src = 'https://image.tmdb.org/t/p/w342/' + image;
    if (image != null) {
        return '<img src="' + src + '" alt="' + title + '" class="poster">';
    }else {
        return '<img src="img/no.jpg" class="dikembe poster">';
    }
};

//funzione trama

function storyLine(film){
    if (film.overview.length > 250) {
        var trama = film.overview.substring(0,250) + '...';   
    }else{
        trama= film.overview;
    }
    return trama
};
