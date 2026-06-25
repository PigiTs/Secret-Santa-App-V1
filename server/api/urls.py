from django.urls import path
from .views import get_naughty_or_nice_list,create_list_entry,update_list_entry,delete_list_entry

urlpatterns = [
    path('list/', get_naughty_or_nice_list, name='list'),
    path('list/create/', create_list_entry, name='create_list_entry'),
    path('list/edit/<int:pk>/', update_list_entry, name='update_list_entry'),
    path('list/delete/<int:pk>/', delete_list_entry, name='delete_list_entry'),
]