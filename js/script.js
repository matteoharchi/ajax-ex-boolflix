$(document).ready(function(){


    $("#searchbutton").click(function(){
        var ricerca = $("#searchbar").val();
        $(".results").html("");
        movieSearch(ricerca);

    });



    //funzione ricerca film
    function movieSearch(data){
        $.ajax(
            {
                url: "https://api.themoviedb.org/3/search/movie?api_key=9fa935e79bf8d2bc13f91abd5721f117",
                method: "GET",
                data: {
                    query: data,
                    language: "it-IT",
                },
                success: function(movie){
                    var selectedmovie = movie.results;
                    var source = $("#movie-template").html();
                    var template = Handlebars.compile(source);
                    for (var i = 0; i < selectedmovie.length; i++) {
                        var item = {
                            "title": selectedmovie[i].title,
                            "original-title": selectedmovie[i].original_title,
                            "language": language(selectedmovie[i].original_language),
                            "vote": insertStars(selectedmovie[i].vote_average)
                        };
                        console.log(item.language);
                        var html = template(item);
                        $(".results").append(html);

                    }
                }, error: function(){
                    alert("ERRORE")
                }
        })
    }
    function insertStars(n){
        var stellePiene = "";
        var stelleVuote= "";
        var grade = Math.ceil(n / 2);
        for (var i = 0; i < grade; i++) {
            stellePiene = stellePiene+'<i class="fas fa-star full"></i>';
        };
        for (var i = 0; i < (5-grade); i++) {
            stelleVuote = stelleVuote+'<i class="fas fa-star empty"></i>';
        };
        return stellePiene+stelleVuote;
    };
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
