from django.db import models

# Create your models here.
class NaughtyOrNiceList(models.Model):
    fullname = models.CharField(max_length=100)
    email= models.EmailField(unique=True)

    def __str__(self):
        return self.fullname