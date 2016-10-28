from django.conf.urls import url
from data_download import views

app_name="data_download"
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^show_data_details/(?P<file_hash_code>[\w\-]+)/$', views.show_data_details, name="show_data_details"),
    url(r'^download_data/(?P<file_hash_code>[\w\-]+)/$', views.download_data, name="download_data"),
]
