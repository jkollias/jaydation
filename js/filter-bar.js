 
// Filter Bar

function filterProdcutsBy(filter){
    if(filter == "All"){ 
        $(`.catalog-grid .grid-item`).show(); 

    }else{
        $(`.catalog-grid .grid-item`).hide();
        $(`.catalog-grid .grid-item[data-filter="${filter}"]`).show();
    }
}

$('.filter-bar  button').on('click', function() {
    $(".filter-bar button ").removeClass("selected-filter-tab");
    $(this).addClass("selected-filter-tab");
    $filter = $(this).attr("data-filter");
    console.log($filter); 
    filterProdcutsBy($filter);
});

 