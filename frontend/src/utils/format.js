// export const formatPrice = (value) => {
//     return value ? +parseFloat(Number(value.replace('R$ ', '').replace(',', '.') * 100).toPrecision(15)) : 0;
// }

export const formatPriceSave = (value) => {
    return value ? +parseFloat(Number(value.replace('R$ ', '').replace(',', '.') * 100).toPrecision(15)) : 0;
    // return value ? parseInt(Number(value.replace('R$ ', '').replace(',', '.')) * 100) : 0;
}

export const formatPriceDisplay = (value) => {
    return value ? `R$ ${Number(value/100).toFixed(2).replace('.', ',')}`  : 'R$ 0,00';
}