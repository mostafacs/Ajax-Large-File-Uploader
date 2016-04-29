/**
 * Created by mostafa on 1/5/16.
 */



/*
	CSRF Token for Django Backend.
*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

// -------------- End of CSRF Token Getter -------------------------

/** 

We split file in client side so we can upload too large files.
uploadChunckSize is the size in bytes for every chunck.
default is 900000 which equal 0.9 MB

*/

var uploadChunckSize = 900000;
var fileUploaderId = "uploadFile";
// progressbar Jquery Selector
var progressbarSelector = '.progress-bar';
var uploadButtonSelector = '#uploadButton';



var iterationNums = 0;
$(function(){



$(uploadButtonSelector).click(function () {
	 // Call UpdateProgressBar and set it 0
         updateProgressBar(0);    
         upload();
});




});




// Remove it if you don't want use progressbars

function updateProgressBar(value){
    $(progressbarSelector).width(value + '%').text(value + '%');
}



function upload(){

    var file = document.getElementById(fileUploaderId).files[0];
    var fileSize = file.size;
    iterationNums = Math.ceil(fileSize / uploadChunckSize);
    fileSlicer(file,uploadFilePart,uploadChunckSize,"binary");

}

function uploadFilePart(data,fileName,is_end,index){



    var UPLOAD_URL = '/upload/'+is_end+'/'+fileName;
    $.ajax({

    url: UPLOAD_URL,
    type: 'POST',
    data: data,
    async:false,
    success: function(result) {


        var percent = ((index+1)/iterationNums) * 100;
        if(Math.round(percent) !== percent) {
            percent = percent.toFixed(2);
        }

        updateProgressBar(percent);
        if(is_end){

           

	   /*


 		Write Code After file uploaded 


	  */
		

        }



    }
});
}

function fileSlicer(file,callback,chunkSize,mode,looping){



    var doSlice = function(file,callback,chunkSize,startByte,index) {
        var lastByte = file.size;
        var loop = (typeof looping !== 'undefined') ? looping : true;
        var reader = new FileReader();

        var blob = null;
        if ((startByte + chunkSize) > lastByte) {
            blob = file.slice(startByte, lastByte);
            loop = false;
        } else {
            blob = file.slice(startByte, (startByte + chunkSize));
        }

        reader.onload = (function (isProcessing, counter) {
            return function (evt) {
                if (evt.target.readyState == FileReader.DONE) {

                    var sliceContent = evt.target.result;
                    callback(sliceContent, file.name, !isProcessing,index);


                    if (loop) {
                        index++;
                        startByte += chunkSize;
                        doSlice(file, callback, chunkSize, startByte, index)
                    }

                }
            }
        })(loop, index);

        if(mode==="text"){
            reader.readAsBinaryString(blob);
        }else {
            reader.readAsDataURL(blob);
        }
    };

    doSlice(file,callback,chunkSize,0,0);

	
}
