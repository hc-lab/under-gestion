from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

class Producto(models.Model):
    CATEGORIAS = [
        ('Cocina', 'Cocina'),
        ('Almacen', 'Almacén'),
        ('EPPS', 'EPPS'),
        ('Mina', 'Mina'),
        ('Medicamento', 'Medicamento'),
    ]

    UNIDADES_MEDIDA = [
        ('Unidad', 'Unidad'),
        ('Kg', 'Kg'),
        ('Par', 'Par'),
    ]

    nombre = models.CharField(max_length=100)
    stock = models.IntegerField()
    unidad_medida = models.CharField(max_length=50, choices=UNIDADES_MEDIDA, default='Unidad')
    estado = models.CharField(max_length=50, default='No disponible', editable=False)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default='Cocina')

    def clean(self):
        if self.stock == 0 and self.estado == 'disponible':
            raise ValidationError('No se puede tener un stock de 0 con el estado "disponible".')

    def save(self, *args, **kwargs):
        if self.stock == 0:
            self.estado = 'No disponible'
        else:
            self.estado = 'Disponible'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

class HistorialProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='historial')
    fecha_hora = models.DateTimeField(default=timezone.now)
    cantidad = models.IntegerField()
    entregado_a = models.CharField(max_length=100)
    motivo = models.TextField()

    def __str__(self):
        return f"{self.producto.nombre} - {self.fecha_hora}"

class SalidaProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='salidas')
    fecha_hora = models.DateTimeField(default=timezone.now)
    cantidad = models.IntegerField()
    entregado_a = models.CharField(max_length=100)
    motivo = models.TextField()

    def __str__(self):
        return f"{self.producto.nombre} - {self.fecha_hora} - {self.cantidad}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Crear una entrada en el historial del producto
        HistorialProducto.objects.create(
            producto=self.producto,
            fecha_hora=self.fecha_hora,
            cantidad=self.cantidad,
            entregado_a=self.entregado_a,
            motivo=self.motivo
        )
        
        # Actualizar el stock del producto
        self.producto.stock -= self.cantidad
        self.producto.save()