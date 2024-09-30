from django.shortcuts import render
from .models import Transaction, Goal
from .serializers import TransactionSerializer, GoalSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
import yfinance as yf
from django.core.cache import cache
import json

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
	if request.method =='POST':
		username = request.data.get('username')
		password = request.data.get('password')

		if User.objects.filter(username=username).exists():
			return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

		user = User.objects.create_user(username=username, password=password)

		refresh = RefreshToken.for_user(user)

		return Response({
			'refresh': str(refresh),
			'access': str(refresh.access_token),
			}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
	user = request.user
	return Response({
		'id': user.id,
		'username' : user.username
		})

class TransactionListCreateView(generics.ListCreateAPIView):
	queryset = Transaction.objects.all()
	serializer_class = TransactionSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return Transaction.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)

class GoalListCreateView(generics.ListCreateAPIView):
	queryset = Goal.objects.all()
	serializer_class = GoalSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		return Goal.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


def fetch_stock_data(request, symbol):
    cache_key = f'stock_data_{symbol}'
    cache_data = cache.get(cache_key)

    if cache_data:
        return JsonResponse(cache_data, safe=False)

    stock = yf.Ticker(symbol)

    try:
        stock_info = stock.info
        hist = stock.history(period="5d")

        if not stock_info or hist.empty:
        	return JsonResponse({'error': 'Invalid stock symbol or no data available'}, status=404)

        history_data = []
        for date, row in hist.iterrows():
            history_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'open': row['Open'],
                'close': row['Close']
            })

        current_price = stock_info.get('currentPrice', 'N/A')
        previous_close = stock_info.get('regularMarketPreviousClose', 'N/A')

        
        if isinstance(current_price, (float, int)) and isinstance(previous_close, (float, int)):
            market_change = current_price - previous_close
            market_change_formatted = f"{market_change:.2f}"
        else:
            market_change = 'N/A'
            market_change_formatted = 'N/A'

        data = {
            'stock_info': {
                'longName': stock_info.get('longName', 'N/A'),
                'symbol': stock_info.get('symbol', symbol),
                'marketPrice': current_price,
                'marketChange': market_change_formatted,
                'previousClose': previous_close  
            },
            'history': history_data
        }

        cache.set(cache_key, data, timeout=3600)
        return JsonResponse(data, safe=False)

    except Exception as e:
        logger.error(f"Error fetching stock data for {symbol}: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
