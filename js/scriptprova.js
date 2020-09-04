$(document).ready(function(){
    var urlFilm = "https://api.themoviedb.org/3/search/movie?api_key=9fa935e79bf8d2bc13f91abd5721f117";
    var urlTV = "https://api.themoviedb.org/3/search/tv?api_key=9fa935e79bf8d2bc13f91abd5721f117";

    $("#searchbutton").click(function(){
        var ricerca = $("#searchbar").val();
        $(".results-Film").html("");
        $(".results-Serie").html("");
        search(ricerca, urlFilm, "Film");
        search(ricerca, urlTV, "Serie");


    });



    //funzione ricerca film e serie
    function search(data, url, type){

        $.ajax(
            {
                url: url,
                method: "GET",
                data: {
                    query: data,
                    language: "it-IT",
                },
                success: function(movie){
                    var selectedmovie = movie.results;
                    for (var i = 0; i < selectedmovie.length; i++) {
                        var item = {
                            "title": selectedmovie[i].title || selectedmovie[i].name,
                            "original-title": selectedmovie[i].original_title || selectedmovie[i].original_name,
                            "language": language(selectedmovie[i].original_language),
                            "vote": insertStars(selectedmovie[i].vote_average),
                            "type" : type,
                        };
                        stampa(item, type);
                    }
                }, error: function(){
                    alert("Si è presentato un errore nella ricerca di"+type)
                }
        })
    }

    //funzione stampa

    function stampa(item, type){
        var source = $("#template").html();
        var template = Handlebars.compile(source);
        var html = template(item);
        $(".results-" + type).append(html);
    }

    //funzione stelle CORREGGI CON UN SOLO CICLO FOR
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
                stars += '<i class="fas fa-star empty"></i>'
            }
        }
        return stars
    };
    // funzione lingua
    function language (lang){
        var en = '<img src="img/icons8-great-britain-22.png" alt="">'
        var it = '<img src="img/icons8-italy-22.png" alt="">'
        if (lang == "en") {
            lang = en;
        } else if (lang == "it") {
            lang = it;
        }
        return lang;
    }
});
