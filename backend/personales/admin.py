from django.contrib import admin
from .models import Personal

@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ('apellidos', 'nombres', 'dni', 'cargo', 'telefono', 'procedencia', 'fecha_registro')
    search_fields = ['nombres', 'apellidos', 'dni']
    list_filter = ('cargo', 'procedencia')
    ordering = ('apellidos', 'nombres')

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)
        if search_term:
            queryset |= self.model.objects.filter(
                nombres__icontains=search_term
            ) | self.model.objects.filter(
                apellidos__icontains=search_term
            )
        return queryset, use_distinct
