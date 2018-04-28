let CLIENT_ID = '';
let CLIENT_SECRET = '';

if (process.env.NODE_ENV === 'production') {

  //
  // Production config
  //

  CLIENT_ID = 'TXBRjIOtlsvszEAt4LMNjK5kLk1yYJvp';
  CLIENT_SECRET = 'tG51cT3uxFOzfjUadXkcmh9rLCskuaGm0QNW3pYDQc1FAAprXmkSNDs7cYSGSG75';

} else {

  //
  // Development config
  //

  CLIENT_ID = 'dkDhePo5QrAttSvwvyuwejqnVlr0WHNn';
  CLIENT_SECRET = '7bgSPsbCVVjGdXOJm2XQpdcA9ouU2Z1tK6G8GKkOVaAEAv16TbGjsDyTDf2d38WS';

}

export default { CLIENT_ID, CLIENT_SECRET };