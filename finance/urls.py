from django.urls import path
from finance.views import fetch_stock_data

urlpatterns = [
	path('api/stock/<str:symbol>/', fetch_stock_data, name='fetch_stock_data'),
]