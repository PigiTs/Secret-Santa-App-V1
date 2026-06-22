from rest_framework import serializers
from .models import NaughtyOrNiceList

class NaughtyOrNiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaughtyOrNiceList
        fields = "__all__"