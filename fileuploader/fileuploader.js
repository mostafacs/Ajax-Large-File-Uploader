/**
 * Created by mostafa on 1/5/16.
 */



/**

We split file in client side so we can upload too large files.
uploadChunckSize is the size in bytes for every chunck.
default is 900000 which equal 0.9 MB

*/


console.log("HEre........");

var FileUploader = function(uploadUrl, uploadChunckSize){
	if(uploadChunckSize ){ this.uploadChunckSize = uploadChunckSize;}
	else {this.uploadChunckSize = 900000;}
    console.log(uploadUrl);
	this.uploadUrl = uploadUrl;
    console.log(">>>"+this.uploadUrl);
	//this.partUploadCallBack = partUploadCallBack;
	//this.fileUploadedCallBack = fileUploadedCallBack;

}




FileUploader.prototype.upload = function(file){

    //var file = document.getElementById(fileUploaderId).files[0];
    var fileSize = file.size;
    this.iterationNums = Math.ceil(fileSize / this.uploadChunckSize);
    this.fileSlicer(file,this.uploadFilePart,this.uploadChunckSize,"binary");

}

FileUploader.prototype.uploadFilePart = function (obj ,data,fileName,is_end,index){


    var UPLOAD_URL = obj.uploadUrl+"/"+index+"/"+is_end+'/'+fileName;

//    $.ajax({
//
//    url: UPLOAD_URL,
//    type: 'POST',
//    data: data,
//    headers:{
//            "X-CSRFToken": csrfToken
//        },
//    async:false,
//    success: function(result) {
//
//
//        var percent = ((index+1)/obj.iterationNums) * 100;
//        if(Math.round(percent) !== percent) {
//            percent = percent.toFixed(2);
//        }
//
//        //this.partUploadCallBack(percent);
//        self.postMessage({"opt": "partUploaded", "percent": percent});
//
//        //updateProgressBar(percent);
//        if(is_end){
//
//
//          //this.fileUploadedCallBack();
//          self.postMessage({"opt": "fileUploaded", "response": result});
//
//
//        }
//
//
//
//    }
//});


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            var percent = ((index+1)/obj.iterationNums) * 100;
            if(Math.round(percent) !== percent) {
                percent = percent.toFixed(2);
            }

            //this.partUploadCallBack(percent);
            self.postMessage({"opt": "partUploaded", "percent": percent});

            //updateProgressBar(percent);
            if(is_end){


                //this.fileUploadedCallBack();
                self.postMessage({"opt": "fileUploaded", "response": result});


            }


        }
    };
    xhttp.open("POST", UPLOAD_URL, false);
    xhttp.send(data.split(",")[1]);

};

FileUploader.prototype.fileSlicer =  function (file,callback,chunkSize,mode,looping){


    var obj = this;
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

                    var slicedContent = evt.target.result;
                    callback(obj,slicedContent, file.name, !isProcessing,index);


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

var uploader = null;
var csrfToken = "";
self.addEventListener("message", function(e) {

 //console.log("JQuery version: ", $.fn.jquery);
  var args = e.data;

  if(args.opt === "construct"){
      console.log(args.uploadUrl);

  	  uploader = new  FileUploader (args.uploadUrl, args.uploadChunckSize);
  }else if(args.opt === "upload"){
    csrfToken = args.csrfToken;
  	uploader.upload(args.file);
  }



}, false);
