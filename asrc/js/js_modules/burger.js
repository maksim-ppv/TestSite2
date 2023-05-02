const menu = document.querySelector('.menu');
const btn = document.querySelector('.menu-button');
const navbar = document.querySelector('.navbar');
const body = document.querySelector('body');



const modal = ()=>{

 
      menu.classList.toggle('show');
   btn.classList.toggle('line_active');
   body.classList.toggle('lock');

}

menu.addEventListener('click', event => {
   const target = event.target
   if(!target.closest('.menu')){
      modal();
   }
});
btn.addEventListener('click', modal);
