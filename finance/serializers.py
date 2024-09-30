from rest_framework import serializers
from .models import Transaction, Goal

class TransactionSerializer(serializers.ModelSerializer):
	class  Meta:
		model = Transaction
		fields = ['id','user','category','date','type','description','amount']
		read_only_fields = ['id', 'user']

class GoalSerializer(serializers.ModelSerializer):
	class Meta:
		model = Goal
		fields = ['id','target_amount','current_amount','description']
		read_only_fields = ['id']