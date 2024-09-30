from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Category(models.Model):
	name = models.CharField(max_length=100)

	def __str__(self):
		return self.name

class Transaction(models.Model):
	TYPE_CHOICES = (
		('Income', 'Income'),
		('Expense','Expense'),
	)
	user =models.ForeignKey(User, on_delete=models.CASCADE)
	category = models.ForeignKey(Category, on_delete=models.SET_NULL,blank=True, null=True)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	date = models.DateField(blank=True, null=True)
	type = models.CharField(max_length=7, choices=TYPE_CHOICES, blank=True, null=True)
	description = models.TextField()

	def __str__(self):
		return f'{self.type}: {self.amount}'

class Goal(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	target_amount = models.DecimalField(max_digits=10, decimal_places=2)
	current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	description = models.TextField()

	def __str__(self):
		return f'Goal: {self.description} - {self.target_amount}'