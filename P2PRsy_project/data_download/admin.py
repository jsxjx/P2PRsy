import hashlib

from django.contrib import admin
from data_download.models import File

# Register your models here.

class FileAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    fields = ['name', 'description', 'description_img']

admin.site.register(File, FileAdmin)
