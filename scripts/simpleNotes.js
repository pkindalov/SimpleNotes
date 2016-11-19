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
    let data = {title: title, description: description};


    let sendRequest = {
      method: "POST",
      url: baseService + "/posts",
      headers: authHeaders,
      data: data
    };


    $.ajax(sendRequest)
        .then(displayNotes)
        .catch(displayError);
    // $.post(baseService + "/posts")
    //     .then(displayNotes)
    //     .catch(displayError);

    
    function displayNotes(response) {
        console.log(response);
        //$('#notes').empty();
        $('#notes').show();
        console.log(response.title);
        console.log(response.description);
            let divHead = $('<div class="notesHead">');
            let divBody = $('<div class="notesBody">');


            divHead.text(response.title);
            divBody.text(response.description);

            $('#notes').append(divHead);
            $('#notes').append(divBody);

    }



}

function displayError() {
    //TODO
}



function loadAllNotes() {
    $('#notes').empty();

    let loadQuery = {
        method: "GET",
        url: baseService + "/posts",
        headers: authHeaders
    };


    $.ajax(loadQuery)
        .then(listAllPosts)
        .catch(displayError);


    function listAllPosts(data) {
        //console.log(data);
        $('#notes').show();

        for(let note of data){
            //console.log(note._id);
            let divHead = $('<div class="notesHead">');
            let divBodyId = note._id;
            let divBody = $(`<div class="notesBody" id=${divBodyId}>`);

            let commentField = $('<br /><textarea id="comments" rows="5" cols="65"></textarea><br />');
            let sendComment = $(`<button id="${divBodyId}" onclick="addComment(this)">Add a comment</button>`);


            divHead.text(note.title);
            divBody.text(note.description);
            divBody.append(commentField,sendComment);


            $('#notes').append(divHead);
            $('#notes').append(divBody);

            //$('div#'+divBodyId +' #sendComment').click(addComment);

            //console.log(note);

            //Load comments module
            let allCommentsQuery = {
                method: "GET",
                url: baseService + `/comments/?query={"post_id":"${divBodyId}"}`,
                headers: authHeaders
            };


            $.ajax(allCommentsQuery)
                .then(listAllComments)
                .catch(displayError);


             function listAllComments(comments) {
                 console.log(comments);
                 let container = $('div#' + divBodyId);


                 for(let obj = 0; obj < comments.length; obj++){
                     console.log(comments[obj].comment);
                     let commentDiv = $('<div>');
                     commentDiv.text(comments[obj].comment);
                     container.append(commentDiv);
                 }



             };




        }
    }

}



function addComment(divBodyId) {
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
        let container = $(containerId + " #comments" );
        let div = $('<div>');
        div.text(data.comment);
        container.prepend(div);

        //console.log(data.post_id);
    }

    // //console.log(divBodyId.id);
    // alert(commentId);
    //alert(comment);


}







