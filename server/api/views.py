from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import NaughtyOrNiceList
from .serializer import NaughtyOrNiceListSerializer

# Create your views here.
@api_view(['GET'])
def get_naughty_or_nice_list(request):
    naughty_or_nice_list = NaughtyOrNiceList.objects.all()
    serializedData = NaughtyOrNiceListSerializer(naughty_or_nice_list, many=True)
    return Response({'data': serializedData.data})

@api_view(['POST'])
def create_list_entry(request):
    serializer = NaughtyOrNiceListSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)