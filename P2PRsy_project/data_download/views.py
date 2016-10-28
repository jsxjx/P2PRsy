# coding=utf-8
import os

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, StreamingHttpResponse
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse

from forms import UserForm
from models import File


# Create your views here.
def index(request):
    files = File.objects.filter()
    return render(request, "data_download/index.html", {'files':files})


@login_required
def show_data_details(request, file_hash_code):
    try:
        one_file = File.objects.get(hash_code=file_hash_code)
    except File.DoesNotExist:
        return HttpResponse("Nothing Found")
    else:
        return render(request, 'data_download/show_data_details.html', {'file': one_file})

@login_required
def download_data(request, file_hash_code):
    
    def file_iterator(file_name, chunck_size=512):
        with open(file_name) as f:
            while True:
                c = f.read(chunck_size)
                if c:
                    yield c
                else:
                    break
    f = File.objects.get(hash_code=file_hash_code)
    file_father_path = os.path.join("data_download", os.path.join("files_for_downloading", f.name))
    file_name = os.listdir(file_father_path)[0]
    file_path = os.path.join(file_father_path, file_name)
    response = StreamingHttpResponse(file_iterator(file_path))
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="{0}"'.format(file_name.encode('utf-8'))

    return response
