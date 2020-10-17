export default function getError(key) {
  switch (key) {
    case 'delivery@update/delivery-does-not-exists':
      return 'Status não pode ser alterado!.';
    case 'delivery@destroy/delivery-does-not-exists':
      return 'Não encontrado.';
    case 'delivery@destroy/requires-new-status':
      return 'Altere o status do produto primeiro.';

    default:
      break;
  }
}
