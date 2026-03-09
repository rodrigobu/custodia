import factory
from datetime import date
from decimal import Decimal

from apps.veiculos.models import Veiculo


class VeiculoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Veiculo

    placa = factory.Sequence(lambda n: f"ABC{n:04d}")
    veiculo = factory.Faker("sentence", nb_words=3)
    data = factory.LazyFunction(date.today)
    local = factory.Faker("city", locale="pt_BR")
    acessoria = factory.Faker("company", locale="pt_BR")
    status = "apreendido"
    valor = factory.LazyFunction(lambda: Decimal("15000.00"))
    total = Decimal("0.00")
