/* App Functions */

var skinTone = "";

function scrollToTop() {
    $(".overflow-scroll").animate({ scrollTop: $('#top').offset().top });
}

const stepsTitle = [
    "<h2>Step 1: Find Your Shade.</h2><p>Choose the model that best matches your skin tone.</p>",
    "<h2>Step 2: Select Your Undertone.</h2><p>Choose the group that represents you.</p>",
    "<h2>Step 3: Last Step!</h2><p>Choose the model that best matches your shade.</p>",
    "<h2>Meet Your <span class=\"highlight-text\">Perfect Match</span>.</h2>",
    "<h2>Select your shade number</h2><p>Choose the model that best matches your skin tone.</p>"
];

const nextBtn = document.querySelector('.finder-btn-container .btn-next'); 
const prevBtn = document.querySelector('.finder-btn-container .btn-prev'); 

var $nextBtn = $('.finder-btn-container .btn-next'); 
var $prevBtn = $('.finder-btn-container .btn-prev'); 


/* Adding and Removing Classes */

function loopThroughElementsAndRemoveClass(els, cssClass) {
    for (el of els) {
        el.classList.remove(cssClass);
    }
}

function toggleActiveClassFromItems(btn, prods) {
    if (btn.hasClass('active')) {
        btn.toggleClass('active');
    } else {
        loopThroughElementsAndRemoveClass(prods, 'active');
        btn.addClass('active');
    }
}

function activateNextButton(step) {
    $('.btn-next').addClass('active');
}

function removeCurrentStepFromSteps() {
    let steps = ['#step-1', '#step-2', '#step-3', '#step-4'];
    for (step of steps) {
        $(step).removeClass("current-step");
    }
}

/* Adding and Removing Classes Ends */


/* Getting and Pushing data from one element to another */

function pushDataTo(ele, dataObj){ 
    for(data in dataObj){
        ele.setAttribute(data, dataObj[data]);
        console.log(ele);
    }
}

function getDataFrom(ele){
    atts = ele.attributes; 
    let obj = {   }; 
    for (var i = 0;  i < atts.length;  i++) { 
        if( atts[i].nodeName.includes("data-") ){ 
            obj[atts[i].nodeName] = atts[i].nodeValue; 
        }      
    }   
    return obj;
}

function passDataFromNextBtnToPrevBtn() { 
    let nextBtn = document.querySelector('.shade-finder .btn-next');
    let dataList = getDataFrom(nextBtn);
    pushDataTo(prevBtn, dataList);
}

function passingShadeFinderDataToNextBtn(productItem){ 
    let nextBtn = document.querySelector('.shade-finder .btn-next'); 
    let data = getDataFrom(productItem);
    pushDataTo(nextBtn, data);
}


function getStep(btn) {
    let step = btn.getAttribute('data-app-step');
    return step;
}

/* Pushing data from one element to another */


 
function addClickEventsToItems(containerEle) {    
    $items = $(containerEle + ' .item'); 
    $items.on('click', function(e) {        
        if(this.getAttribute("data-app") == "view-shades"){ 
            passingShadeFinderDataToNextBtn(this);
        }else{
            console.log("Pass Find My Shades Data");  
        }
        toggleActiveClassFromItems($(this), $items); 
        activateNextButton();
    });
}


/* Constructing Product Items HTML */

function catalogButtonHTML(sku, hex, filter, imgUrl, desc) {
    var html = `<button class="item" 
                   data-app="view-shades"
                   data-sku="${sku}" 
                   data-hex="${hex}" data-filter="${filter}">
                    <div class="check-mark"></div>
                    <img src="${imgUrl}">
                    <div class="desc">${desc}</div>
                </button>`;
    return html;
}

function findShadeCatalogButtonHTML(sku, tone, shade, imgUrl){
    var html = `<button class="item" 
                   data-app="shade-finder"
                   data-sku="${sku}" 
                   data-skin-tone="${tone}"
                   data-shade="${shade}"
                >
                    <div class="check-mark"></div>
                    <img src="${imgUrl}"> 
                </button>`;
    return html;
}

/* Constructing Product Items HTML */


/* Building Grids */

function buildFindShadeCatalog() {
    $('#dynamic-title').html(stepsTitle[0]);
    $("#step-1").addClass("current-step");
    var $block = $('<div/>', { class: 'skin-tone' }),

        $shade_container = $('<div/>', { class: 'shade-container' })
        $shade = $('<div/>', { class: 'shade' }),
        $image = $('<img/>'),
        $skintone = $('<h3/>');

    $grid = $(".find-my-shade--grid");

    $.each(finder.shades, function(i, val) {
        // Create DOM for skin tone block
        $block.append($shade_container).append($skintone.text(finder.shades[i].skin_tone));
        $copy = $block.clone();
        $copy.addClass('block-' + i).appendTo($($grid));
        // Get all the options.

        $.each(finder.shades[i].options, function(j, val) {
            // Create DOM of all options 
            $item = $('<div/>', { class: 'grid-item' });
            // $shade.attr('data-sku', finder.shades[i].options[j].sku).attr('data-skin-tone', i).attr('data-shade', j)
            $item.html(findShadeCatalogButtonHTML(
                finder.shades[i].options[j].sku, 
                i, 
                j,
                val.image
            ));
            $item.appendTo($('.find-my-shade--grid .block-' + i + ' .shade-container'));
        });

    });
 
}

function loopThroughObjectAndAddItemsToGrid(obj, gridDiv){
    $.each(obj, function(i, val) {
        $item = $('<div/>', { class: 'grid-item' });
        $item.attr("data-filter", val.filter);
        $item.html(catalogButtonHTML(val.sku, val.hex, val.filter, val.image, val.description));
        $item.appendTo($(gridDiv));
    });
}

function buildViewShadesCatalog() {
    $("#step-1").addClass("current-step");
    $(".filter-bar").addClass("acitve");
    $("#dynamic-title").html(stepsTitle[4]);
    loopThroughObjectAndAddItemsToGrid(catalog.product, '.catalog-grid');
    addClickEventsToItems('.catalog-grid' );
}

/* Building Grids */


/* Showing Final Step Divs */

function activateUpsellCarousel(skinTone) {
    let sliderDiv;
    if (skinTone == "fair" || skinTone == "light") {
        sliderDiv = ".fair-light--upsell-carousel";
    } else {
        sliderDiv = ".medium-deep--upsell-carousel";
    }
    document.querySelector(sliderDiv).classList.add("active");
}

function checkIfToneDataExists() {
    if ($('.finder-btn-container .btn-next').attr("data-tone")) {
        return $('.finder-btn-container .btn-next').attr("data-tone").toLowerCase()
    } else {
        return false;
    }
}

function showFinalAddToCart(sku) {
    let btn = document.querySelector(".final-step--add-to-bag .add-to-bag-" + sku);
    btn.classList.add('show');
}


function buildPurchaseProduct() {
    let $sku = $('.finder-btn-container .btn-next').attr("data-sku").toLowerCase();
    let $tone = checkIfToneDataExists();
    let $hex = $('.finder-btn-container .btn-next').attr("data-hex");
    $("#dynamic-title").html(stepsTitle[3]);
    if ($('.finder-btn-container .btn-next').attr("data-app") == "view-shades") {
        $('.finder-btn-container .btn-prev').addClass("active");
        $('.finder-btn-container .btn-prev').attr("data-app-step", "#step-1");
    }

    $.ajax({
        url: "https://www.joahbeauty.com/rest/V1/kiss_landingpage/product/detail?sku=" + $sku,
    }).done(function(data) {
        obj = JSON.parse(data);
        $('#step-4 .finder-product--title--name').html(obj.name);
        $('#step-4 .finder-product--title--subname').html(obj.sub_name);
        $('#step-4 .finder-product--price').html('$' + obj.price);
    });
    $('#step-4 .large-image img').attr('src', 'https://www.joahbeauty.com/media/wysiwyg/joah/landing-pages/primedation/img/finished-matched/' + $sku + '.jpg');
    $.ajax({
        url: "https://www.joahbeauty.com/rest/V1/kiss_landingpage/product/gallery?sku=" + $sku,
    }).done(function(data) {
        $('#step-4 .product-info .gallery').html(data);
    });

    $('#step-4 .finder-product--title--sku span.sku').html($sku);
    $('#step-4 .finder-product--title--sku span.hex').attr('style', 'background-color: #' + $hex);
    activateUpsellCarousel($tone);
    showFinalAddToCart($sku);
}


function showStep(step) {
    removeCurrentStepFromSteps();
    $(step).addClass("current-step");
    if (step == "#step-1") {

    }
    if (step == "#step-2") {

    }
    if (step == "#step-3") {

    }
    if (step == "#step-4") {
        buildPurchaseProduct();
    }
}

/* Showing Final Step Divs */

function openPopUp() {
    console.log("open Popup");
}


$('.finder-btn-container .btn-prev').on("click", function() {
    showStep(getStep(this));
    this.classList.remove("active");
});


$('.finder-btn-container .btn-next').on("click", function() {
    showStep(getStep(this));
    passDataFromNextBtnToPrevBtn();
    this.classList.remove("active");
});



//Main Menu
jQuery('document').ready(function() {
    $('.find-my-shade-btn').on('click', function() {
        openPopUp();
        $('.finder-btn-container .btn-next').attr('data-app', 'find-my-shades');
        buildFindShadeCatalog();
    });
    $('.view-shades-btn').on('click', function() {
        openPopUp();
        $('.finder-btn-container .btn-next').attr('data-app', 'view-shades').attr('data-app-step', '#step-4');
        buildViewShadesCatalog();
    })
});