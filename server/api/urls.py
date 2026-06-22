from django.urls import path
from .views import get_naughty_or_nice_list,create_list_entry

urlpatterns = [
    path('list/', get_naughty_or_nice_list, name='list'),
    path('list/create/', create_list_entry, name='create_list_entry'),
]