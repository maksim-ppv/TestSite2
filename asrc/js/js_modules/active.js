
// scroll 

$(window).scroll(function () {
	if ($(window).scrollTop() > 300) {
		$('.navbar').addClass('fixed');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('fixed');
	};
	if ($(window).scrollTop() > 305) {
		$('.navbar').addClass('transition');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('transition');
	}
	if ($(window).scrollTop() > 600) {
		$('.navbar').addClass('opacity');
	} else if (!menu.classList.contains('show')) {
		$('.navbar').removeClass('opacity');
	}
});

// spoiler 
$('.spoiler').click(function(event){
	$(this).toggleClass('spoiler_active').next().slideToggle(300);
});

// selector
const ItemSelect = document.querySelectorAll('.form__select');

ItemSelect.forEach(item=>{
    const ItemSelectTitle = item.querySelector('.form__select-title');
    const ItemSelectInput = item.querySelector('input');
    const selectItem = item.querySelectorAll('.select-item');
    selectItem.forEach(itemSelect=>{
        itemSelect.addEventListener('click',()=>{
            ItemSelectTitle.textContent = itemSelect.textContent;
            ItemSelectInput.value = itemSelect.textContent;
            $(ItemSelectTitle).toggleClass('spoiler_active').next().slideToggle(300);
        })
    })
});

// Scrollsmooth

var Scrollbar = window.Scrollbar;
	const scrollbar = document.querySelectorAll('.my-scrollbar');
	scrollbar.forEach(item=>{
		Scrollbar.init(item, {
			alwaysShowTracks:true});
	});


//RANGE
$(function() {
    
    var $document = $(document);
    var selector = '[data-rangeslider]';
    var $element = $(selector);

    // For ie8 support
    var textContent = ('textContent' in document) ? 'textContent' : 'innerText';

    // Example functionality to demonstrate a value feedback
    function valueOutput(element) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
        output[textContent] = value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    $document.on('input', 'input[type="range"], ' + selector, function(e) {
        valueOutput(e.target);
    });




    // Example functionality to demonstrate programmatic attribute changes
    $document.on('click', '#js-example-change-attributes button', function(e) {
        var $inputRange = $(selector, e.target.parentNode);
        var attributes = {
                min: $('input[name="min"]', e.target.parentNode)[0].value,
                max: $('input[name="max"]', e.target.parentNode)[0].value,
                step: $('input[name="step"]', e.target.parentNode)[0].value
            };

        $inputRange.attr(attributes);
        $inputRange.rangeslider('update', true);
    });

    // Basic rangeslider initialization
    $element.rangeslider({

        // Deactivate the feature detection
        polyfill: false,

        // Callback function
        onInit: function() {
            valueOutput(this.$element[0]);
        },

 
    });

});
[].forEach.call(document.getElementsByClassName('fixNumber'), e => e.textContent = e.textContent.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));


new Swiper('.slider__advantages',{
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        200:{
            slidesPerView: 1,
        },
        568:{
            slidesPerView: 2,
            effect: 'slide',
        },
        992:{
            slidesPerView: 3,
        }
    },
    slidesPerView: 2,
    watchOverflow: true,
    spaceBetween: 50,
    
}
);

AOS.init();