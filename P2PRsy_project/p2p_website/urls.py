from django.conf.urls import url
from django.contrib import admin

from p2p_website import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^index/$', views.index, name="index"),
    url(r'^user_info/(?P<user_id>[0-9]+)/$', views.user_info, name="user_info"),
    url(r'^loan_info/(?P<loan_id>[0-9]+)/$', views.loan_info, name="loan_info"),
]
