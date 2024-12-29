from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/token/', views.CustomTokenObtainPairView.as_view(),name='token_obtain_pair'), 
    path('api/users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/logout/', views.logout, name='auth_logout'),
    path('api/users/register/',views.register),
    path('api/users/reset-password/',views.reset_password),
    path('api/users/<str:username>/setup/',views.setupAccount,name='setup_account'),
    path('api/users/<str:username>/types',views.manage_types),
    path('api/users/<str:username>/types_edit',views.edit_types),
    path('api/users/<str:username>/<str:type>',views.get_type),
    path('api/users/<str:username>/supplies/',views.manage_supplies,name='manage_supplies'),
    path('api/users/<str:username>/buy-supplies/',views.reciepts,name='reciepts'),
    path('api/users/<str:username>/<str:supply>/getUnit/',views.getSupplyUnit,name='getUnit'),
    path('api/users/<str:username>/edit-supplies/', views.edit_supplies, name='edit_supplies'),
    path('api/users/<str:username>/search/<str:query>', views.search_types_and_supplies, name='search_types_and_supplies'),
    path('api/users/<str:username>/search-supplies/<str:type>/<str:query>', views.search_supplies, name='search_supplies'),
    path('api/data/export/export-excel/<str:username>/', views.export_all_data_excel, name='export_all_data_excel'),
    path('api/data/export/export-pdf/<str:username>/', views.export_all_data_pdf, name='export_all_data_pdf'),

]
