import math

units = ['Unit', 'Kgram', 'Gram', 'Piece']

conversionRates = {
    'kgram': 1,       # 1 Kilogram
    'gram': 0.001,    # 1 Gram is 0.001 Kilograms
    'piece': 1,       # 1 Piece (assuming it's the same as 1 Unit for simplicity)
    'unit': "Error"         # 1 Unit (assuming it's the same as 1 Piece for simplicity)
}

def calculateTotalPrice(quantity: int, unit: str, pricePerUnit: int) -> int:
    unit = unit.lower()
    conversionRate = conversionRates[unit]
    quantityInKg = quantity * conversionRate
    totalPrice = quantityInKg * pricePerUnit
    return totalPrice

