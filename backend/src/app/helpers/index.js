import url from 'url';
import { format } from 'date-fns'; // startOfHour, parseISO, isBefore, format
import pt from 'date-fns/locale/pt';

const Helper = {};

Helper.buildHost = () => {
  if (process.env.APP_URL) return process.env.APP_URL;
  const formatUrl = () =>
    url.format({
      protocol: process.env.PROTOCOL || 'http',
      hostname: process.env.HOST || '127.0.0.1',
      port: process.env.PORT || 3333,
      pathname: '',
    });

  return formatUrl();
};

Helper.formatDate = date => {
  return format(date, "'dia' dd 'de' MMMM', às' H:mm'h'", { locale: pt });
};

export default Helper;
