/**
 * Created by mostafa on 1/5/16.
 */

/**
Add This Line to urls.py
	url(r'^upload/(?P<index>[0-9]+)/(?P<is_end>[\w|\W]+)/(?P<file_name>[\w|\W]+)$', upload_binary_file),
*/

@login_required
def upload_binary_file(request, index, is_end, file_name):
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
