/**
 * Created by r3v3nan7 on 14.11.16.
 */

$(document).ready(function () {
   let buttonAdd = $('#addHeadButton');

    $(buttonAdd).on('click', function () {
        let post = $('#noteHead').val();
        let description = $('#comment').val();


        if(checkInput(post) && checkInput(description) ){
            let posts = $(`<div class="well well-sm">${htmlEsc(post)}</div>`);
            let container = $('.container-fluid');
            container.append(posts);
            let comment = $(`<div class="well well-lg">${htmlEsc(description)}</div>`);
             container = $('.well.well-sm');
            container.append(comment);
        };






    });



    
    
    function checkInput(word) {
        if(word === '' || word === ' '){
            let warningDiv = $(`<div class="alert alert-danger">Cannot be empty</div>`);
            let whereToAppend = $('#header');

            whereToAppend.append(warningDiv);

            setInterval(function () {
                warningDiv.fadeOut();
            },4000);

            $(warningDiv).on('click', function () {
                $(this).fadeOut();
            });

            return false;

        }else {
            return true;
        }
    }



    function htmlEsc(str) {
        str = str.replace(/</g, '')
                 .replace(/>/g, '')
                 .replace(/&/, '');

        return str;
    }



});