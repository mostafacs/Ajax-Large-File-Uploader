/**
 @Author Mostafa
 **/
var worker;
var scripts = document.getElementsByTagName('script');
var fileUploaderUrl = scripts[(scripts.length-1)].src;

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

var fileUploaderLocation = getLocation(fileUploaderUrl);
var fileUploaderPath = fileUploaderLocation.pathname;
var fileUploadItems = fileUploaderPath.split("/");
var actualFileUploaderPath = "";
for (var i = 0; i < fileUploadItems.length-1; i++) {
    var item = fileUploadItems[i];
    if( i == 0){
        if(item == "") actualFileUploaderPath+="/";
        else actualFileUploaderPath += item+"/";
    }else actualFileUploaderPath += item+"/";
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var AjaxUploader = {
    "createUploader": function (uploadUrl, chunckSize, partUploadedCallBack, fileUploadedCallBack) {

        if (typeof(worker) != "undefined") {
            worker.terminate();
            worker = undefined;
        }

        alert("== FU >"+actualFileUploaderPath);
        worker = new Worker(actualFileUploaderPath+'fileuploader.js');
        worker.postMessage({
            "opt": "construct",
            "uploadUrl": uploadUrl,
            "uploadChunckSize": chunckSize,


        });

        worker.addEventListener('message', function (e) {

            var args = e.data;

            if (args.opt === "partUploaded") {
                partUploadedCallBack(args.percent);
            } else if (args.opt === "fileUploaded") {
                fileUploadedCallBack(args.response);
            }


        });
        return AjaxUploader;
    },

    "upload": function (file) {
        var csrftoken = getCookie('csrftoken');
        alert(csrftoken);
        worker.postMessage({
            "opt": "upload",
            "file": file,
            "csrfToken": csrftoken
        });
    }

}
