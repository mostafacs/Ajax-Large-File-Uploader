# Ajax Large File Uploader

I create this project to upload a very large file. by splitting the file on client side and upload every part to the backend service which merge append every part to the file.


# Setup on your project

Currently I depend in jquery but we can simply use only native javascript with simple changes.
so,

# FrontEnd (HTML/JS)
1- Add Jquery in your html page scripts
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="fileuploader.js"></script>
```
2- You want to update the following variables on fileuploader.js file.
```javascript
var fileUploaderId = "uploadFile"; // <input type="file" id="uploadFile" >
var progressbarSelector = '.progress-bar'; // <div class=".progress-bar"></div>
var uploadButtonSelector = '#uploadButton'; // <input type="button" id="uploadButton">
```


# Backend

I add implementation to backend service in Python/Django
```python

@login_required
def upload_binary_file(request, is_end, file_name):
    data = request.body
    data = data.split(',')
    # Path to save file.
    file_path = os.getcwd() + "/uploads/"
    fh = open(file_path + file_name, "ab")
    fh.write(data[1].decode('base64'))
    fh.close()
    output = {'success': True}
    output_text = json.dumps(output)
    return HttpResponse(output_text, content_type='application/json')

```

You need to update your urls.py :
```python
url(r'^upload/(?P<is_end>[\w|\W]+)/(?P<file_name>[\w|\W]+)$', upload_binary_file),

```


# Next 

I will Implement backend in Java (Sevlet/Spring MVC) and Node.js(Express)

