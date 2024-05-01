export const getHeat = (heat: number, amount: number) => {
  let total;
  switch (amount) {
    case 1:
      total = heat / 3;
      break;
    case 2:
      total = (heat / 3) * 2;
      break;
    case 3:
      total = heat;
      break;
    case 4:
      total = (heat / 3) * 4;
      break;
    case 5:
      total = (heat / 3) * 5;
      break;
    default:
      total = heat;
      break;
  }
  return Math.round(total * 100) / 100;
};
