from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError

class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Asegúrate de que el ID 1 exista en tu tabla de usuarios
    nombre = models.CharField(max_length=200)
    stock = models.IntegerField()
    unidad_medida = models.CharField(max_length=50, choices=[
        ('Unidad', 'Unidad'),
        ('Kg', 'Kg'),
        ('Par', 'Par'),
    ], default='Unidad')
    estado = models.CharField(max_length=50, default='No disponible', editable=False)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)

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

class Historial(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='historiales')

class HistorialProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='historial_productos')
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

    def clean(self):
        if self.cantidad > self.producto.stock:
            raise ValidationError('No hay suficiente stock disponible')

    def save(self, *args, **kwargs):
        self.clean()  # Validar antes de guardar
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

class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=False)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-fecha_creacion']

    def __str__(self):
        return self.titulo

class ImagenNoticia(models.Model):
    noticia = models.ForeignKey(Noticia, related_name='imagenes', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='noticias/')
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    orden = models.IntegerField(default=0)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"Imagen {self.orden} de {self.noticia.titulo}"