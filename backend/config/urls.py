from django.contrib import admin
from django.urls import include, path

from apps.accounts.api.auth_router import auth_api
from apps.veiculos.api.veiculo_router import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
    path("api/auth/", auth_api.urls),
    path("", include("admin_coreui.urls")),
]
