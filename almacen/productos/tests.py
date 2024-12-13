from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class ProductoTests(APITestCase):
    def setUp(self):
        # Crear datos de prueba
        self.user = User.objects.create_user(...)
        self.client.force_authenticate(user=self.user)

    def test_crear_producto(self):
        data = {...}
        response = self.client.post('/api/productos/', data)
        self.assertEqual(response.status_code, 201)
