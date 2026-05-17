from django_filters import rest_framework as filters
from .models import Laptop

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass

class LaptopFilter(filters.FilterSet):
    price_min = filters.NumberFilter(field_name="base_price", lookup_expr='gte')
    price_max = filters.NumberFilter(field_name="base_price", lookup_expr='lte')
    
    # Use 'ram' as the query parameter, mapping to 'ram_gb'
    ram = NumberInFilter(field_name="ram_gb", lookup_expr='in')
    
    # Use 'processor' as query param, mapping to 'processor_type'
    processor = filters.CharFilter(field_name="processor_type", lookup_expr='icontains')
    gpu = filters.CharFilter(field_name="gpu_type", lookup_expr='icontains')
    
    display_min = filters.NumberFilter(field_name="display_size", lookup_expr='gte')
    display_max = filters.NumberFilter(field_name="display_size", lookup_expr='lte')
    
    # Brand and Category
    brand = filters.CharFilter(field_name="brand__slug", lookup_expr='exact')
    category = filters.CharFilter(field_name="categories__slug", lookup_expr='exact')

    class Meta:
        model = Laptop
        # Explicitly exclude fields that are already defined as custom filters
        fields = [] 
