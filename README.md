# Ajax Large File Uploader

I create this project to upload a very large file. by splitting the file on client side and upload every part to the backend service which merge append every part to the file.


# Setup on your project

The Project is not depend on any other library.


# FrontEnd (HTML/JS)
1- Add script in html page
```html
<script src="/fileuploader/fileuploader.js"></script>
```
2- create uploader Object to upload the file
```javascript
 		
	    var file= document.getElementById("fileID").files[0];
	    var backendUrl = "/admin/upload"; // Backend Url that handle uploaded chuncks
	    var filePartSize = 100000; // the size of every chunck

	    var partUploadHandler = function(percent){
		// percent is a value between 0 to 100
                console.log("upload part = "+percent);
		// You can update progress bar if  you have with percent.
            };

	
	    var uploadCompleteHandler = function(result){
               alert("upload done! = "+JSON.stringify(result));
                $("#uploadsUrls").append("<p>url : "+result.url+"</p>")
            };

            var uploader = AjaxUploader.createUploader(backendUrl, filePartSize, partUploadHandler, uploadCompleteHandler);
            uploader.upload(file);
```


# Backend
 
Note, In backend we append the data to the same file in every request.
Please review the implementation in "Backend" folder for Java and Python.



