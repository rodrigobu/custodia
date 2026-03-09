from django.contrib import admin
from django.urls import path

from apps.veiculos.api.veiculo_router import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
