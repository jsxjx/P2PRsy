# coding=utf-8
from __future__ import unicode_literals

import os
import hashlib

from django.db import models
from django.template.defaultfilters import slugify

class File(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField()
    description_img = models.ImageField(upload_to='static/description_images', blank=True)
    hash_code = models.CharField(max_length=128, unique=True, null=True)

    def save(self, *args, **kwargs):
        self.hash_code = hashlib.md5(self.name.encode("utf-8")).hexdigest()
        try: 
            os.mkdir(os.path.join("data_download", os.path.join("files_for_downloading", self.name))) #!!bad code style!!
        except:
            pass
        super(File, self).save(*args, **kwargs)

    def __str__(self):
        return self.name.encode('utf-8')
