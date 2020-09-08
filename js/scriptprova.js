$(document).ready(function(){
    var urlTrend = "https://api.themoviedb.org/3/trending/movie/week?";
    var urlTrendSerie = "https://api.themoviedb.org/3/trending/tv/week?";
    var urlFilm = "https://api.themoviedb.org/3/search/movie?";
    var urlTV = "https://api.themoviedb.org/3/search/tv?";
    // var urlCreditsTV="https://api.themoviedb.org/3/tv/{tv_id}/credits?";


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

    //Tasti scroll
    var buttonRight = $('.rightscroll');
    var buttonLeft = $('.leftscroll');

    buttonRight.click(function () {
      $('.results-Film').scrollRight=200;
  });
    buttonLeft.click(function () {
      $('.results-Film').scrollLeft=200;
  });
});



// FUNZIONI


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
                "actors": cast(type, selectedmovie[i].id)

            };
            if (movie.total_results > 0) {
                stampa(item, type);
            }else {
                noResult(type); //ancora da fare
            }

        }
    }

//funzione per Cast

function cast(type, id){
    if (type == "Film") {
        var tipo = "movie";
    }else {
        tipo = "tv"
    }
    $.ajax (
        {
            url:'https://api.themoviedb.org/3/'+tipo+"/"+id+'/credits?api_key=9fa935e79bf8d2bc13f91abd5721f117',
            success:function(response){
                var cast = response.cast;
                var castRidotto = cast.slice(0,4);
                var nomi = [];
                for (var i = 0; i < castRidotto.length; i++) {
                    nomi.push(castRidotto[i].name);
                }
                // console.log(nomi);
                return nomi;
            }, error: function(){
                alert("errore")
            }
    });

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

//funzione trama, cerco di fare in modo che cliccando i puntini di spospensione possa aprire tutta la trama.

function storyLine(film){
    var trama = film.overview.substring(0,250);
    return trama
};
