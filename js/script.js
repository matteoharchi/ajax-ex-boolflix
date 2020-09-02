$(document).ready(function(){
    var ricerca = $("#searchbar").val();
    var source = $("#movie-template").html();
    var template = Handlebars.compile(source);
    $("#searchbutton").click(function(){
        $.ajax(
            {
                url: "https://api.themoviedb.org/3/search/movie?api_key=9fa935e79bf8d2bc13f91abd5721f117",
                method: "GET",
                data: {
                    query: ricerca,
                    original_title: ricerca,
                },
                success: function(movie){
                    var selectedmovie = movie.results;

                    for (var i = 0; i < selectedmovie.length; i++) {
                        var item = {
                            "title": selectedmovie[i].title,
                            "original-title": selectedmovie[i].original_title,
                            "language": selectedmovie[i].original_language,
                            "vote": selectedmovie[i].vote_average
                        }
                        console.log(item);
                        var html = template(item);
                        $(".results").append(html);

                    }
                }, error: function(){
                    alert("ERRORE")
                }
        })
    })
})
