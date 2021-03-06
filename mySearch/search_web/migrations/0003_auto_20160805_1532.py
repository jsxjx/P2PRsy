# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-08-05 15:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('search_web', '0002_auto_20160805_1530'),
    ]

    operations = [
        migrations.CreateModel(
            name='PpdShow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=50, null=True)),
                ('platform', models.CharField(blank=True, max_length=50, null=True)),
                ('url', models.CharField(blank=True, max_length=50, null=True)),
                ('sum', models.IntegerField(blank=True, null=True)),
                ('limittime', models.DateTimeField(blank=True, null=True)),
                ('rate', models.DecimalField(blank=True, decimal_places=4, max_digits=18, null=True)),
                ('process', models.CharField(blank=True, max_length=10, null=True)),
                ('peoplenum', models.IntegerField(blank=True, null=True)),
                ('timelong', models.IntegerField(blank=True, null=True)),
                ('heatvalue', models.DecimalField(blank=True, decimal_places=4, max_digits=18, null=True)),
                ('decription', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'ppd_show',
                'managed': False,
            },
        ),
        migrations.AlterModelTable(
            name='listinfo',
            table='search_web_listinfo',
        ),
    ]
