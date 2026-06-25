from django.db import models

# Create your models here.
class NaughtyOrNiceList(models.Model):
    fullname = models.CharField(max_length=100)
    email= models.EmailField(unique=True)

    def __str__(self):
        return self.fullname

class DrawResult(models.Model):
    santa = models.ForeignKey(
        NaughtyOrNiceList,
        on_delete=models.CASCADE,
        related_name='santa_assignments'
    )

    santee = models.ForeignKey(
        NaughtyOrNiceList,
        on_delete=models.CASCADE,
        related_name='santee_assignments'
    )

    def __str__(self):
        return f"{self.santa.fullname} → {self.santee.fullname}"