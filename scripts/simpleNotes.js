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
            let divBody = $('<div class="notesBody">');
            let commentField = $('<br /><textarea id="comments" rows="5" cols="65"></textarea><br />');
            let sendComment = $('<button id="sendComment">Add a comment</button>');


            divHead.text(note.title);
            divBody.text(note.description);
            divBody.append(commentField,sendComment);

            $('#notes').append(divHead);
            $('#notes').append(divBody);
        }
    }

}





