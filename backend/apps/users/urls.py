from django.urls import path

from .views import CurrentUserView, UserDetailView, UserListView


urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
]