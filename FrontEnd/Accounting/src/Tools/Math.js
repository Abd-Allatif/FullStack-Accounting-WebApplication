const units = ['Unit', 'Kgram', 'Gram', 'Piece'];

// Conversion rates (base unit is 1 kilogram)
const conversionRates = {
    'Kgram': 1,       // 1 Kilogram
    'gram': 0.001,    // 1 Gram is 0.001 Kilograms
    'Piece': 1,       // 1 Piece (assuming it's the same as 1 Unit for simplicity)
    'Unit': "Error"         // 1 Unit (assuming it's the same as 1 Piece for simplicity)
};

function calculateTotalPrice(quantity, unit, pricePerUnit) {
    const conversionRate = conversionRates[unit];
    const quantityInKg = quantity * conversionRate;
    const totalPrice = quantityInKg * pricePerUnit;
    return totalPrice;
}

export{
    units,
    calculateTotalPrice,
}
