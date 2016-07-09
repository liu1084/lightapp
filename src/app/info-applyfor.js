/**
 * Created by jim.liu on 2016-07-09.
 */
$(function(){
   $('nav div').off('click')
       .on('click', function(){
          $(this).addClass('nav-active').siblings().removeClass('nav-active');
       });
});