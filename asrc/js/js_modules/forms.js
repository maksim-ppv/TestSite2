
// var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };


//FORMS
function forms(){
	//OPTION
	$.each($('.option_one.active'), function(index, val) {
		$(this).find('input').prop('checked', true);
	});
	$('.option_one').click(function(event) {
		if(!$(this).hasClass('disable')){
				var target = $(event.target);
			if (!target.is("a")){
				if($(this).hasClass('active') && $(this).hasClass('order') ){
					$(this).toggleClass('orderactive');
				}
    				$(this).parents('.options').find('.option_one').removeClass('active');
    				$(this).parents('.options').find('input').prop('checked', false);
					$(this).toggleClass('active');
                    $(this).find('input').prop('checked', true);

			}
		}
    });

    $.each($('.option_all'), function(index, val) {
        if($(this).find('input').prop('checked')==true){
            $(this).addClass('active');
        }
    });
    $('body').off('click','.option_all',function(event){});
    $('body').on('click','.option_all',function(event){
        if(!$(this).hasClass('disable')){
                var target = $(event.target);
            if (!target.is("a")){
                    $(this).toggleClass('active');
                if($(this).hasClass('active')){
                    console.log('helloy');
                    $(this).find('input').prop('checked', true);
                    const Hell = $(this).find('input');
                    console.log(Hell);
                }else{
                    $(this).find('input').prop('checked', false);
                }
            }
        }
    });
}
forms();




//VALIDATE FORMS
// $('form button[type=submit]').click(function(){
// 	var er=0;
// 	var form=$(this).parents('form');
// 	var ms=form.data('ms');
// 	var nums=form.data('nums');
// // $.each(form.find('.req'), function(index, val) {
// // 	er+=formValidate($(this));
// // });
// if(er==0){
// 	if(ms!=null && ms!=''){
// 		showMessageByClass(ms, nums);
// 		// return false;
// 	}
// }else{
// 	return false;
// }
// });
// function formValidate(input){
// 	var er=0;
// 	var form=input.parents('form');
// 	if(input.val()=='' || input.val()==input.attr('data-value')){
// 		er++;
// 		// addError(input);
// 	}else{
// 		// removeError(input);
// 	}
// 	return er;
// }

// function showMessageByClass(ms, nums){
//     const msPopup = document.getElementById(ms);
//     popupOpen(msPopup);
//     function popupThanks(ms) {

        
//     };
//     if(nums == '3'){
//         let th = $(".popup__for_mail_3");
// 		$.ajax({
// 			type: "POST",
// 			url: "https://zox.by/wp-content/themes/zox/mail.php",
// 			data: th.serialize()
//         }).done(popupThanks(ms),
//         setTimeout(function() {
//             th.trigger("reset");
//         }, 1000)
//         );
// 	};
// 	if(nums == '1'){
// 		let th = $(".popup__for_mail_1");
// 		console.log('th: ', th.serialize());
// 		const form = document.querySelector('.form');
// 		const ww = document.querySelectorAll('.popup__for_mail_1');
// 		console.log('ww: ', ww);
// 		let formData = new FormData(form);
// 		// ww.forEach((item, index)=>{
// 		// 	formData.append('index', item);
// 		// });
// 		console.log('formData: ', formData);

// 		$.ajax({
// 			type: "POST",
// 			url: "https://zox.by/wp-content/themes/zox/mail.php",
// 			data: th.serialize()
//         }).done(popupThanks(ms),
//         setTimeout(function() {
//             th.trigger("reset");
//         }, 1000)
//         );
// 	};
// 	if(nums == '2'){
//         let th = $(".popup__for_mail_2");
// 		$.ajax({
// 			type: "POST",
// 			url: "https://zox.by/wp-content/themes/zox/mail.php",
// 			data: th.serialize()
//         }).done(popupThanks(ms),
//         setTimeout(function() {
//             th.trigger("reset");
//         }, 1000)
//         );
// 	};
// 	if(nums == '4'){
// 		let th = document.querySelector('.popup__for_mail_4');
// 		let formData = new FormData(th);
// 		// formData.append('image', formImage.files[0]);
// 		$.ajax({
// 			type: "POST",
// 			url: "http://global.minigun.agency/wp-content/themes/GlobalMebel/sendmail.php",
// 			data: formData
//         }).done(popupThanks(ms),
//         setTimeout(function() {
//             th.trigger("reset");
//         }, 1000)
//         );
// 	};	

// }


// function addError(input){
// 	input.addClass('err');
// 	$('.req-phone_message').addClass('err');
// }

// function removeError(input){
// input.removeClass('err');
// $('.req-phone_message').removeClass('err');
// }



function maskclear(n){
    if(n.val()==""){
        n.inputmask('remove');
        if(!n.hasClass('l')){
            n.val(n.attr('data-value'));
        }
        n.removeClass('focus');
        n.parent().removeClass('focus');
    }
    }



