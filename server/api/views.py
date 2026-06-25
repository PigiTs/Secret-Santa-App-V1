from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import status

from .models import NaughtyOrNiceList, DrawResult
from .serializer import NaughtyOrNiceListSerializer
import random

from django.core.mail import send_mail
from django.http import HttpResponse

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

@api_view(['PUT'])
def update_list_entry(request, pk):
    try:
        entry = NaughtyOrNiceList.objects.get(pk=pk)
        serializer = NaughtyOrNiceListSerializer(entry, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data})
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except NaughtyOrNiceList.DoesNotExist:
        return Response({'error': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_list_entry(request, pk):
    try:
        entry = NaughtyOrNiceList.objects.get(pk=pk)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except NaughtyOrNiceList.DoesNotExist:
        return Response({'error': 'Entry not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def draw(request):
    if request.method == 'POST':
        participants = list(NaughtyOrNiceList.objects.all())
        if len(participants) < 2:
            return Response({'error': 'Not enough participants to draw.'}, status=status.HTTP_400_BAD_REQUEST)

        random.shuffle(participants)
        DrawResult.objects.all().delete()
        draw_results = []
    
        for i in range(len(participants)):
            santa = participants[i]
            santee = participants[(i + 1) % len(participants)]
            DrawResult.objects.create(
            santa=santa,
            santee=santee
            )
            draw_results.append({
            "santa": santa.fullname,
            "santee": santee.fullname
            })

        return Response({'message': 'Secret Santa draw completed successfully.','data': draw_results}, status=status.HTTP_200_OK)

@csrf_exempt
def send_email(request):
    recipients = DrawResult.objects.select_related('santa', 'santee').all()

    for recipient in recipients:
        send_mail(
            subject="Secret Santa is coming to town!",
            message=
            "You have been chosen as a Secret Santa for " + recipient.santee.fullname + "!!\n\nSpread the holiday spirit.",
            from_email="noreply@example.com",
            recipient_list=[recipient.santa.email],
            fail_silently=False,
        )

    return HttpResponse("Email sent!")