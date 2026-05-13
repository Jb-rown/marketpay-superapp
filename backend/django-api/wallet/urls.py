from django.urls import path
from .views import WalletView, TransactionListView

urlpatterns = [
    path('', WalletView.as_view()),
    path('transactions/', TransactionListView.as_view()),
]