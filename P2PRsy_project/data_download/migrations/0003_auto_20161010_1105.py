# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-10-10 03:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_download', '0002_auto_20160927_2338'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='file',
            name='slug',
        ),
        migrations.AddField(
            model_name='file',
            name='hash_code',
            field=models.CharField(max_length=128, null=True, unique=True),
        ),
    ]
