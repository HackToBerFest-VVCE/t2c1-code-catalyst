import fs from 'fs';
import path from 'path';
import https from 'https';

const REMAINING = [
  {
    file: 'amber-fort.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Amber_Fort%2C_Jaipur%2C_20191219_1032_9565.jpg/1280px-Amber_Fort%2C_Jaipur%2C_20191219_1032_9565.jpg',
  },
  {
    file: 'fontainhas.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Streets_of_Fontainhas%2C_Panaji_%2803%29.jpg/1280px-Streets_of_Fontainhas%2C_Panaji_%2803%29.jpg',
  },
  {
    file: 'humayuns-tomb.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Humayun%27s_Tomb_Facade.jpg/1280px-Humayun%27s_Tomb_Facade.jpg',
  },
  {
    file: 'hampi-chariot.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Iconic_Stone_Chariot_%40_Vittala_Temple%2C_Hampi%2C_Karnataka.jpg/1280px-Iconic_Stone_Chariot_%40_Vittala_Temple%2C_Hampi%2C_Karnataka.jpg',
  },
  {
    file: 'lotus-mahal.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Hampi%2C_India%2C_Lotus_Mahal.jpg/1280px-Hampi%2C_India%2C_Lotus_Mahal.jpg',
  },
  {
    file: 'khardung-la.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/The_world%27s_highest_motorable_claim-_Khardung_La_Pass.jpg/1280px-The_world%27s_highest_motorable_claim-_Khardung_La_Pass.jpg',
  },
  {
    file: 'nubra-valley.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Shyok_river_at_Hunder%2C_Nubra_valley.jpg/1280px-Shyok_river_at_Hunder%2C_Nubra_valley.jpg',
  },
  {
    file: 'lalbagh-glasshouse.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Glasshouse_and_fountain_at_lalbagh.jpg/1280px-Glasshouse_and_fountain_at_lalbagh.jpg',
  },
  {
    file: 'bangalore-palace.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Bangalore_Mysore_Maharaja_Palace.jpg/1280px-Bangalore_Mysore_Maharaja_Palace.jpg',
  },
  {
    file: 'jagdish-temple.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Jagdish_Temple_Udaipur.jpg/1280px-Jagdish_Temple_Udaipur.jpg',
  },
  {
    file: 'beatles-ashram.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Meditation_chambers_at_the_old_Maharishi_Mahesh_Yogi_Ashram%2C_now_in_ruins%2C_Muni_Ki_Reti_DSCN9891.jpg/1280px-Meditation_chambers_at_the_old_Maharishi_Mahesh_Yogi_Ashram%2C_now_in_ruins%2C_Muni_Ki_Reti_DSCN9891.jpg',
  },
  {
    file: 'sam-sand-dunes.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Jaisalmer_Sam_Sand_Dunes.jpg/1280px-Jaisalmer_Sam_Sand_Dunes.jpg',
  },
  {
    file: 'patwon-ki-haveli.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Patwon_Ki_Haveli_-_26140771308.jpg/1280px-Patwon_Ki_Haveli_-_26140771308.jpg',
  },
  {
    file: 'ross-island.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/The_interesting_ruins_of_an_old_bakery_in_Ross_island.jpg/1280px-The_interesting_ruins_of_an_old_bakery_in_Ross_island.jpg',
  },
  {
    file: 'krang-shuri.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Krang_Suri_Waterfall.jpg/1280px-Krang_Suri_Waterfall.jpg',
  },
];

const destDir = path.resolve('public/images/destinations');

function download(url, filepath) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'TouristMatramBot/1.0 (info@touristmatram.in)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filepath).then(resolve);
      }
      if (res.statusCode === 200) {
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(fs.statSync(filepath).size);
        });
      } else {
        console.log(`HTTP ${res.statusCode} for ${filepath}`);
        resolve(0);
      }
    }).on('error', (e) => {
      console.log(`Error ${e.message} for ${filepath}`);
      resolve(0);
    });
  });
}

(async () => {
  for (const item of REMAINING) {
    const targetPath = path.join(destDir, item.file);
    const size = await download(item.url, targetPath);
    console.log(`Downloaded ${item.file}: ${Math.round(size / 1024)} KB`);
  }
})();
