//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Country } = require('./src/db.js');
const axios = require('axios');

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(3001, async () => {
    const allCountries = Country.findAll();
    if(!allCountries.length) 
    {
      try {
      const dataCountries = await axios.get('https://restcountries.com/v3.1/all');
      var parseData = dataCountries.data.map( (resp) => { 
        return {
        id: resp.cca3,
        name: resp.name.common,
        flag: resp.flags.png,
        continent: resp.continents[0],
        capital: resp.capital? resp.capital[0] : 'Not found',
        subregion: resp.subregion,
        area: resp.area,
        population: resp.population,
        }
      }
      ) 
      await Country.bulkCreate(parseData);
    } catch(error) { console.log('Error to insert API data to DB local') }
  }
    console.log('Server listening at 3001'); // eslint-disable-line no-console
  });
});

