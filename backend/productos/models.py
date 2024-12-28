from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import transaction
from personales.models import Personal

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
        if self.stock < 0:
            raise ValidationError('El stock no puede ser negativo')
        if not self.nombre.strip():
            raise ValidationError('El nombre no puede estar vacío')
        # Validar que no exista otro producto con el mismo nombre
        if Producto.objects.filter(nombre=self.nombre).exclude(id=self.id).exists():
            raise ValidationError('Ya existe un producto con este nombre')

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
    TIPO_MOVIMIENTO = [
        ('Ingreso', 'Ingreso'),
        ('Salida', 'Salida'),
    ]
    
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_movimiento = models.CharField(max_length=10, choices=TIPO_MOVIMIENTO)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    entregado_a = models.CharField(max_length=200, blank=True, null=True)
    motivo = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.tipo_movimiento} de {self.producto.nombre}"

class SalidaProducto(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    fecha_hora = models.DateTimeField(auto_now_add=True)
    entregado_a = models.ForeignKey(
        'personales.Personal',
        on_delete=models.SET_NULL,
        null=True,
        related_name='salidas_recibidas'
    )
    motivo = models.TextField(blank=True)
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad} - {self.fecha_hora}"

    def clean(self):
        if self.cantidad > self.producto.stock:
            raise ValidationError('No hay suficiente stock disponible')

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Obtener el producto con bloqueo
            producto = Producto.objects.select_for_update().get(id=self.producto.id)
            
            self.clean()
            
            # Guardar la salida primero
            super().save(*args, **kwargs)
            
            # Actualizar el stock del producto
            producto.stock -= self.cantidad
            producto.save()
            
            # Crear una entrada en el historial del producto
            HistorialProducto.objects.create(
                producto=self.producto,
                tipo_movimiento='Salida',
                cantidad=self.cantidad,
                entregado_a=self.entregado_a,
                motivo=self.motivo,
                usuario=self.usuario
            )

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

class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    es_admin = models.BooleanField(default=True)
    puede_escribir = models.BooleanField(default=True)
    puede_editar = models.BooleanField(default=True)
    puede_eliminar = models.BooleanField(default=True)
    usar_base_datos_admin = models.BooleanField(default=True)
    base_datos_propia = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.usuario.username}"

    class Meta:
        permissions = [
            ("full_access", "Acceso total al sistema"),
        ]

class IngresoProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='ingresos')
    fecha = models.DateTimeField(default=timezone.now)
    cantidad = models.IntegerField()
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        usuario_nombre = self.usuario.username if self.usuario else 'Usuario Eliminado'
        return f"{self.producto.nombre} - {self.fecha} - {self.cantidad} por {usuario_nombre}"

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # Guardar el ingreso
            super().save(*args, **kwargs)
            
            # Actualizar el stock del producto
            self.producto.stock += self.cantidad
            self.producto.save()
            
            # Crear una entrada en el historial del producto
            HistorialProducto.objects.create(
                producto=self.producto,
                tipo_movimiento='Ingreso',
                cantidad=self.cantidad,
                usuario=self.usuario,
                motivo='Ingreso al inventario',
                fecha=self.fecha
            )

class AuditoriaLog(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    accion = models.CharField(max_length=50)  # CREATE, UPDATE, DELETE
    modelo = models.CharField(max_length=50)
    objeto_id = models.IntegerField()
    detalles = models.JSONField()
    fecha = models.DateTimeField(auto_now_add=True)

class Notificacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    mensaje = models.TextField()
    tipo = models.CharField(max_length=50)  # stock_bajo, error, info
    leido = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)