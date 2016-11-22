/**
 * Created by r3v3nan7 on 18.11.16.
 */

$('#notes').hide();




const appId = "kid_B1l6AL3bg";
const baseService = "https://baas.kinvey.com/appdata/" + appId;
const appUsername = "notesapp";
const appPassword = "notesapp";
const base64 = btoa(appUsername + ":" + appPassword);
const authHeaders = {"Authorization":"Basic " + base64};

$('#send').click(send);
$('#clearForm').click(clearForm);
$('#loadNotes').click(loadAllNotes);


function clearForm() {
    $('#noteTitle').val('');
    $('#noteBody').val('');
}


function send() {

    let title = $('#noteTitle').val();
    let description = $('#noteBody').val();
    let valid = validate();

    if(!valid){
        return;
    }
    

    let data = {title: title, description: description};


    let sendRequest = {
      method: "POST",
      url: baseService + "/posts",
      headers: authHeaders,
      data: data
    };


    $.ajax(sendRequest)
        .then(loadAllNotes)
        .catch(displayError);

    




}

function displayError(str) {
    let div = $('<div class="error">');
    div.text("Error with adding note.");
    let container = $('#notesHeader');
    container.prepend(div);

    $('.error').fadeOut(3000);
}



function loadAllNotes() {
    $('#notes').empty();


    successfullAdded("Note");




    let loadQuery = {
        method: "GET",
        url: baseService + "/posts",
        headers: authHeaders
    };


    $.ajax(loadQuery)
        .then(listAllPosts)
        .catch(displayError);


    function listAllPosts(data) {
        $('#notes').show();

        for(let note of data){
            let divHead = $('<div class="notesHead">');
            let divBodyId = note._id;
            let divBody = $(`<div class="notesBody" id=${divBodyId}>`);
            let descrCont = $('<div class="descrCont">');
            descrCont.text(note.description);
            let delimeter = $("<hr />");
            delimeter.appendTo(descrCont);

            //let commentsCount = note.count;

            let commentField = $('<br /><textarea id="comments" rows="5" cols="65"></textarea><br />');
            let sendComment = $(`<button id="${divBodyId}" onclick="addComment(event,this)">Добави коментар</button>`);
            let showHideComments = $(`<button id="${divBodyId}" onclick="showHideComments(this)">Скрий/Покажи</button>`);
            let divCommentsCount = $("<div class='countComm'>Коментари: 0</div>");


            divHead.text(note.title);
            divBody.append(descrCont,commentField,sendComment, showHideComments, divCommentsCount);


            $('#notes').append(divHead);
            $('#notes').append(divBody);



            let allCommentsQuery = {
                method: "GET",
                url: baseService + `/comments/?query={"post_id":"${divBodyId}"}`,
                headers: authHeaders
            };


            $.ajax(allCommentsQuery)
                .then(listAllComments)
                .catch(displayError);


             function listAllComments(comments) {

                 let container = $('div#' + divBodyId);



                 for(let obj = 0; obj < comments.length; obj++){
                     //console.log(comments[obj]._id);
                     let commentID = comments[obj]._id;
                     let commentsCount = "Коментари: " + comments.length;
                     $(divCommentsCount).text(commentsCount);


                     let commentDiv = $(`<div id="${commentID}" class="commentsCont">`);
                     commentDiv.text(comments[obj].comment);
                     let editBox = $(`<div id="${commentID}" class="commentsEditField"><textarea id="${commentID}" rows="3" cols="50">${comments[obj].comment}</textarea></div>`);

                     let btnShowEdit = $(`<div><button id="${commentID}" onclick="showEditForm(this)">Редакция</button></div>`);

                     let buttonsContainer = $(`<div id="${commentID}" class="editControls">`);
                     //TODO
                     let btnEdit = $(`<button id="${commentID}" onclick="editComment(this, '${divBodyId}', event)">Редактирай</button>`);

                     let btnRejectEdit= $(`<button id="${commentID}" onclick="rejectEdit(this)">Отказ</button>`);
                     buttonsContainer.append(btnEdit,btnRejectEdit);

                     editBox.append(buttonsContainer);

                     commentDiv.append(btnShowEdit,editBox);
                     container.append(commentDiv);

                     $('.commentsEditField, .editControls').hide();
                     $('.commentsCont').hide();
                 }







             }








        }
    }

}



function showHideComments(divBodyId) {
    let commentId = divBodyId.id;
    let commentElem = "#" + commentId + " .commentsCont";
    $(commentElem).toggle(3000);
}











function editComment(commentID, divBodyId,event) {
    event.preventDefault();
    let commentId = commentID.id;
    let currentPost = divBodyId;


    let commentElem = "#" + commentId + ".commentsEditField textarea";
    //console.log(commentElem);
    let newComment = $(commentElem).val();

    let data = {comment: newComment, post_id: currentPost};


    let editRequest = {
        method: "PUT",
        url: baseService + "/comments/" + commentId,
        headers: authHeaders,
        data: data
    };


    $.ajax(editRequest)
        .then(changeCurrentComment)
        .then(displayError);


    //TODO
    function changeCurrentComment(response) {
        //console.log(response.comment);
        //let commentDiv = $(`<div id="${commentID}" class="commentsCont">`);
        let commentElem = $('#' +commentId + '.commentsCont');
        console.log(commentElem);

        $(commentElem).text(response.comment);
    }







}













function showEditForm(commentID) {
    let commentId = commentID.id;
    //console.log(commentId);
    let commentElem = "#" + commentId + ".commentsEditField";
    //console.log(commentElem);
    let editButtons = "#" + commentId + ".editControls";
    $(commentElem).toggle(3000);
    $(editButtons).toggle(3000);
}


function rejectEdit(commentID) {
    let commentId = commentID.id;
    let commentElem = "#" + commentId + ".commentsEditField";
    let editButtons = "#" + commentId + ".editControls";
    $(commentElem).fadeOut(3000);
    $(editButtons).fadeOut(3000);
}




function addComment(e,divBodyId) {
    e.preventDefault();
    let commentId = divBodyId.id;
    let commentElem = "#" + commentId;
    let comment = $(commentElem + ' #comments').val();

    let data = {comment: comment, post_id: commentId}

    let sendCommentQuery = {
        method: "POST",
        url: baseService + "/comments",
        headers: authHeaders,
        data: data
    };


    $.ajax(sendCommentQuery)
        .then(addCommentSuccessfull)
        .catch(displayError);





    function addCommentSuccessfull(data) {

        let containerId = "div#" + data.post_id;
        let div = $('<div class="commentsCont">');
        div.text(data.comment);
        let container = $(containerId);
        container.append(div);



    }




}



function successfullAdded(str) {
    let div = $('<div class="successAdded">');
    div.text(str + " added/loaded successfully");
    let container = $('#notesHeader');
    container.prepend(div);

    $('.successAdded').fadeOut(3000);
}



function validate() {

    let noteHead = $('#noteTitle').val();
    let noteBody = $('#noteBody').val();

    if(noteHead == "" || noteHead == " " || noteHead.trim() == ""){
        $('#noteTitle').css({'border-color' :'red',
                             'background-color' : 'red'});
        alert("Заглавието не може да бъде празно");
        return false;
    }else {
        $('#noteTitle').css({'border-color' :'',
            'background-color' : ''});
    }


    if(noteHead.length == 1 || noteHead.length < 5){
        $('#noteTitle').css({'border-color' :'red',
            'background-color' : 'red'});
        alert("Заглавието е твърде късо. Минимум 5 знака");
        return false;
    }else {
        $('#noteTitle').css({'border-color' :'',
            'background-color' : ''});
    }



    if(noteBody == "" || noteBody == " " || noteBody.trim() == ""){
        $('#noteBody').css({'border-color':'red',
                            'background-color':'red'});
        alert("Описанието не може да бъде празно");
        return false;
    }else {
        $('#noteBody').css({'border-color':'',
            'background-color':''});
    }

    if(noteBody.length == 1 || noteBody.length < 5){
        $('#noteBody').css({'border-color' :'red',
            'background-color' : 'red'});
        alert("Описанието е твърде късо. Минимум 5 знака");
        return false;
    }else {
        $('#noteBody').css({'border-color' :'',
            'background-color' : ''});
    }

    return true;






}


