/**
 * Created by jim.liu on 2016-07-09.
 */
$(function () {
    $('.i-checkbox').off('click').on('click', function () {
        $(this).toggleClass('i-checkbox-checked');
    });
});