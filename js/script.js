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
                            "language": selectedmovie[i].original_language,
                            "vote": insertStars(selectedmovie[i].vote_average)
                        };
                        console.log(item);
                        var html = template(item);
                        $(".results").append(html);

                    }
                }, error: function(){
                    alert("ERRORE")
                }
        })
    }
    function insertStars(n){
        var final = "";
        var final2= "";
        var grade = Math.ceil(n / 2);
        for (var i = 0; i < grade; i++) {
            final = final+'<i class="fas fa-star full"></i>';
        };
        for (var i = 0; i < (5-grade); i++) {
            final2 = final2+'<i class="fas fa-star empty"></i>';
        };
        return final+final2;
    }
})
