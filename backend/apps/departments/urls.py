from django.urls import path

from .views import (
    DepartmentDetailView,
    DepartmentListCreateView,
    PublicDepartmentListView,
)


urlpatterns = [
    path(
        "public/",
        PublicDepartmentListView.as_view(),
        name="department-public-list",
    ),
    path(
        "",
        DepartmentListCreateView.as_view(),
        name="department-list-create",
    ),
    path(
        "<int:pk>/",
        DepartmentDetailView.as_view(),
        name="department-detail",
    ),
]