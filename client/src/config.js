let CLIENT_ID = '';
let CLIENT_SECRET = '';

if (process.env.NODE_ENV === 'production') {

  //
  // Production config
  //

  CLIENT_ID = 'HujaMOS6bKzzr50fkh8zKXN0n2Q6N2cb';
  CLIENT_SECRET = 'D8BW0qXZEMn9rO2jg3uV0lYHUvUs8H2zHjTxYgJmgEaOBP5KcLVNOBWRe0kfPpIC';

} else {

  //
  // Development config
  //

  CLIENT_ID = 'dkDhePo5QrAttSvwvyuwejqnVlr0WHNn';
  CLIENT_SECRET = '7bgSPsbCVVjGdXOJm2XQpdcA9ouU2Z1tK6G8GKkOVaAEAv16TbGjsDyTDf2d38WS';

}

export default { CLIENT_ID, CLIENT_SECRET };