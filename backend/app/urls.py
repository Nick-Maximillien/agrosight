from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ( 
    FarmerView, FarmViewSet,
      SignupView,
        DashboardView, CreateFarmView,
          DeployDroneView,
           DroneStatusView, StopDroneView,
            DroneDataListView, CreateProfileView,
              MyProfileView, WeatherAPIView, WeatherHistoryAPIView, DiagnosisCreateView )
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'farms', FarmViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('create-farm/', CreateFarmView.as_view(), name='create-farm'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('deploy-drone/', DeployDroneView.as_view(), name='deploy-drone'),
    path('drone-status/', DroneStatusView.as_view(), name='drone-status'),
    path('stop-drone/', StopDroneView.as_view(), name='stop-drone'),
    path('drone-data/', DroneDataListView.as_view(), name='drone-data'),
    path('farmer/', MyProfileView.as_view(), name='farmer'),
    path('create-profile/', CreateProfileView.as_view(), name='create-profile'),
    path('weather/', WeatherAPIView.as_view(), name='weather'),
    path('weather/history/', WeatherHistoryAPIView.as_view(), name='weather-history'),
    path('diagnosis/', DiagnosisCreateView.as_view(), name='create-diagnosis'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
