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

function showSkinToneName(skinTone) {
    let skinToneString;
    switch (skinTone) {
        case 0:
            skinToneString = "fair";
            break;
        case 1:
            skinToneString = "light";
            break;
        case 2:
            skinToneString = "medium";
            break;
        default:
            skinToneString = "dark";
    }
    return skinToneString;
}

function activateUpsellCarousel(skinTone) {
    let sliderDiv;
    if (skinTone == "fair" || skinTone == "light") {
        sliderDiv = ".fair-light--upsell-carousel";
    } else {
        sliderDiv = ".medium-deep--upsell-carousel";
    }
    document.querySelector(sliderDiv).classList.add("active");
}

function showFinalAddToCart(containerDiv, sku) {
    let btn = document.querySelector(containerDiv + " .final-step--add-to-bag .add-to-bag-" + sku);
    btn.classList.add('show');
}

function stepOne() {
    $('#dynamic-title').html(stepsTitle[0]);
    $block = $('<div/>', { class: 'skin-tone' }),
        $shade_container = $('<div/>', { class: 'shade-container' })
    $shade = $('<div/>', { class: 'shade' }),
        $image = $('<img/>'),
        $skintone = $('<h3/>');

    $.each(finder.shades, function(i, val) {
        // Create DOM for skin tone block
        $block.append($shade_container).append($skintone.text(finder.shades[i].skin_tone));
        $copy = $block.clone();
        $copy.addClass('block-' + i).appendTo($('#find-shade #step-1'));
        // Get all the options.
        $.each(finder.shades[i].options, function(j, val) {
            // Create DOM of all options 
            $shade.attr('data-sku', finder.shades[i].options[j].sku).attr('data-skin-tone', i).attr('data-shade', j)
                .append($image.attr('src', finder.shades[i].options[j].image));
            $copy = $shade.clone();
            $copy.appendTo($('#find-shade #step-1 .block-' + i + ' .shade-container'));
        });
    });

    // On click get value of skin tone.
    $('#step-1 .shade').on('click', function() {
        addCheckMark(this);
        addActiveClass(this);
        var skin_tone = $(this).data('skin-tone'),
            shade = $(this).data('shade');

        skinTone = $(this).data('skin-tone');

        var previousScreen = $(this).parents('div:first').attr('id');
        $('.btn-next').removeClass('disabled').attr('data-current-screen', 'step-1').attr('data-next-screen', 'step-2').attr('data-skin-tone', skin_tone).attr('data-shade', shade);
        $('.btn-prev').attr('data-prev-screen', previousScreen).attr('data-current-screen', 'step-1');
    });


    $('#find-shade .btn-next').on('click', function() {
        if ($(this).hasClass('disabled')) {
            // button disabled, no clicky
            return false;
        }

        var nextScreen = $(this).attr('data-next-screen'),
            currentScreen = $(this).attr('data-current-screen'),
            skin_tone = $(this).attr('data-skin-tone'),
            shade = $(this).attr('data-shade');

        $('#find-shade #' + currentScreen).hide();
        $('#find-shade #' + nextScreen).show();
        stepTwo(skin_tone, shade);
    });


}


function stepTwo(skin_tone, shade) {
    $('#dynamic-title').html(stepsTitle[1]);
    $('#find-shade .btn-next').off('click');
    $('#find-shade .btn-next').addClass('disabled')
    var undertoneObj = finder.shades[skin_tone].options[shade].undertone[0];

    if (typeof undertoneObj.cool == 'undefined' || undertoneObj.cool.length <= 0) {
        $('#step-2 div[data-undertone="cool"]').hide();
    }

    if (typeof undertoneObj.neutral == 'undefined' || undertoneObj.neutral.length <= 0) {
        $('#step-2 div[data-undertone="neutral"]').hide();
    }

    if (typeof undertoneObj.warm == 'undefined' || undertoneObj.warm.length <= 0) {
        $('#step-2 div[data-undertone="warm"]').hide();
    }

    var undertone,
        multiProducts,
        idx;

    $('#step-2 .box').on('click', function() {
        addCheckMark(this);
        addActiveClass(this);
        undertone = $(this).attr('data-undertone');
        if (undertoneObj[undertone].length > 1) {
            multiProducts = undertoneObj[undertone];
            $('#find-shade .btn-next').removeClass('disabled').attr('data-current-screen', 'step-2-1').attr('data-next-screen', 'step-2-1');
        } else {
            $.each(undertoneObj[undertone], function(ii, val) {
                idx = ii;
                $('#find-shade .btn-next').removeClass('disabled').attr('data-current-screen', 'step-2').attr('data-next-screen', 'step-3');
            });
        }
        var previousScreen = $(this).parents('div:first').attr('id');

    });

    $('#find-shade .btn-next').on('click', function() {
        if ($(this).hasClass('disabled')) {
            // button disabled, no clicky 
            return false;
        }
        var nextStep = $(this).attr('data-next-screen');
        console.log('nextStep ', nextStep);
        if (nextStep == "step-2-1") {
            $('#find-shade #step-2').hide();
            $('#find-shade #step-2-1').show();
            stepTwoOne(multiProducts);
        } else if (nextStep == "step-3") {
            $('#find-shade #step-2').hide();
            $('#find-shade #step-3').show();
            stepThree(undertoneObj[undertone][idx].sku, undertoneObj[undertone][idx].image, undertoneObj[undertone][idx].tone, undertoneObj[undertone][idx].hex)
        }
    });
}


function stepTwoOne(obj) {
    $('#dynamic-title').html(stepsTitle[2]);
    $('#find-shade .btn-next').off('click');
    $('#find-shade .btn-next').addClass('disabled');

    var $productItem = $('<div/>', { class: 'product-item' }),
        $product = $('<div/>', { class: 'product' }),
        $thumb = $('<img/>');
    $.each(obj, function(i, val) {
        $product.attr('data-sku', obj[i].sku).attr('data-image', obj[i].image).attr('data-tone', obj[i].tone).attr('data-hex', obj[i].hex)
            .append($thumb.attr('src', obj[i].thumb));
        $productItem.append($product);
        $copy = $productItem.clone();
        $copy.appendTo($('#find-shade #step-2-1 .products'));
    });
    var tone, sku, image, hex;
    $('#find-shade #step-2-1 .products .product').on('click', function() {
        addCheckMark(this);
        addActiveClass(this);
        sku = $(this).attr('data-sku'),
            image = $(this).attr('data-image');
        tone = $(this).attr('data-tone');
        hex = $(this).attr('data-hex');
        $('#find-shade .btn-next').removeClass('disabled').attr('data-current-screen', 'step-2-1').attr('data-next-screen', 'step-3');
    });

    $('#find-shade .btn-next').on('click', function() {
        if ($(this).hasClass('disabled')) {
            // button disabled, no clicky
            return false;
        }
        $('#find-shade #step-2-1').hide();
        $('#find-shade #step-3').show();
        finalStep(sku, image, tone, hex);
    });
}

function showFinalProductDetails(sku, hex){
    $.ajax({
        url: "https://www.joahbeauty.com/rest/V1/kiss_landingpage/product/detail?sku=" + sku,
    }).done(function(data) {
        obj = JSON.parse(data);
        $('#final-step .finder-product--title--name').html(obj.name);
        $('#final-step .finder-product--title--subname').html(obj.sub_name);
        $('#final-step .finder-product--price').html('$' + obj.price);
        $('#final-step .finder-product--title--sku').append(sku);
        $('#final-step .finder-product--title--sku span').attr('style', 'background-color: #' + hex);
    });
}

function showFinalProduct(sku){
    sku = sku.toLowerCase();
    $imgURL = "https://www.joahbeauty.com/media/wysiwyg/joah/landing-pages/primedation/img/finished-matched/"+sku+".jpg";
    $('#final-step .large-image img').attr('src',  $imgURL); 
}

function showfinalStep(sku, hex, image){
    $('#dynamic-title').html(stepsTitle[3]);   
    showFinalProduct(sku);
    showFinalProductDetails(sku, hex);
    showFinalAddToCart('#final-step', sku); 
    activateUpsellCarousel(skinTone);
}

function catalogButtonHTML(sku, hex, filter, imgUrl, desc) {
    var html = `<button class="item" 
                   data-sku="${sku}" 
                   data-hex="${hex}" data-filter="${filter}">
                    <div class="check-mark"></div>
                    <img src="${imgUrl}">
                    <div class="desc">${desc}</div>
                </button>`;
    return html;
}

function passDataToNextBtn(s, h, f) {
    $('.btn-next').attr('data-sku', s); 
    $('.btn-next').attr('data-hex', h);
}

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

function hideAllSteps(){

}

function goToFinalStep(sku, hex){ 
    $("#find-shade").show();
    $("#find-shade #final-step").show();
    showfinalStep(sku, hex);
    deactivatNextButton();
    activatePrevButton();
}

function deactivatNextButton(){
    $('.btn-next').removeClass('active'); 
}

function activatePrevButton(step){
    $('.btn-prev').addClass('active'); 
}

function activateNextButton(step){
    $('.btn-next').addClass('active'); 
}

function addClickEventsToItems(ele) {
    $(ele + ' .item').on('click', function(e) {
        var sku = $(this).data('sku'),
            hex = $(this).data('hex'),
            $name = $('#shade-catalog  .product-name h2'),
            $swatch = $('#shade-catalog  .product-name span');
        $name.text(sku);
        $swatch.css('background-color', '#' + hex);
        console.log(sku, hex, $name, $swatch); 
        toggleActiveClassFromItems($(this), $(ele + ' .item')); 
        passDataToNextBtn(sku, hex);
        activateNextButton();
        $('.btn-next').on('click', function(){
            goToFinalStep(sku, hex);
        });
    });
}

function buildCatalog() {
    $("#shade-catalog").show();
    $.each(catalog.product, function(i, val) {
        $item = $('<div/>', { class: 'grid-item' });
        $item.attr("data-filter",val.filter);
        $item.html(catalogButtonHTML(val.sku, val.hex, val.filter, val.image, val.description));
        $item.appendTo($('#shade-catalog .catalog-grid'));
    });
    addClickEventsToItems('#shade-catalog');
}

 
function purchaseProduct(sku, tone, hex) {
    var imageSku = sku.toLowerCase(),
        tone = tone.toLowerCase();

    $.ajax({
        url: "https://www.joahbeauty.com/rest/V1/kiss_landingpage/product/detail?sku=" + sku,
    }).done(function(data) {
        obj = JSON.parse(data);
        $('#perfect-match .finder-product--title--name').html(obj.name);
        $('#perfect-match .finder-product--title--subname').html(obj.sub_name);
        $('#perfect-match .finder-product--price').html('$' + obj.price);
    });
    $('#perfect-match .large-image img').attr('src', 'https://www.joahbeauty.com/media/wysiwyg/joah/landing-pages/primedation/img/finished-matched/' + imageSku + '.jpg');
    $.ajax({
        url: "https://www.joahbeauty.com/rest/V1/kiss_landingpage/product/gallery?sku=" + sku,
    }).done(function(data) {
        $('#perfect-match .product-info .gallery').html(data);
    });

    $('#perfect-match .finder-product--title--sku span.sku').html(sku);
    $('#perfect-match .finder-product--title--sku span.hex').attr('style', 'background-color: #' + hex);
    activateUpsellCarousel(skinTone, "#perfect-match");
    showFinalAddToCart('#perfect-match', sku);
}

 
 

// Previous Screen
$('.btn-prev').on('click', function() {
    var currentScreen = $(this).parents('div:first').attr('id'),
        previousScreen = $(this).data('prev-screen');
    $('#' + currentScreen).hide();
    $('#' + previousScreen).show();

    let activeCartBtn = document.querySelector(".final-step--add-to-bag div.show");
    activeCartBtn.classList.remove("show");
    let activeCarousel = document.querySelector(".final-step--add-to-bag .upsell-carousel--container div.active");
    activeCarousel.classList.remove("active");
})

$('.btn-next').on('click', function() {
    scrollToTop();
});


function findMyShades() {
    //stepOne();
    console.log("find my shades");
}

function viewShades() {
    buildCatalog();
}

//Main Menu
jQuery('document').ready(function() {
    $('.find-my-shade-btn').on('click', function() {
        findMyShades();
    });
    $('.view-shades-btn').on('click', function() {
        viewShades();
    })
});