
@@include('preloader.js');
@@include('js_modules/burger.js');
@@include('js_modules/rangeslider.js');
@@include('js_modules/dynamic-adaptiv.js');
@@include('js_modules/smooth-scrollbar.js');
@@include('js_modules/aos.js');
@@include('js_modules/active.js');



function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    
    testWebP(function (support) {
    
    if (support == true) {
    document.querySelector('body').classList.add('webp');
    }else{
    document.querySelector('body').classList.add('no-webp');
    }
});