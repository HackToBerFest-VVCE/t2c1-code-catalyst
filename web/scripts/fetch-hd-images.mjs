import fs from 'fs';
import path from 'path';
import https from 'https';

const TARGETS = [
  // ── 1. Mysuru ──
  { file: 'mysore-palace.jpg', title: 'Mysore Palace' },
  { file: 'chamundi-hill.jpg', title: 'Chamundeshwari Temple' },
  { file: 'devaraja-market.jpg', title: 'Devaraja Market' },
  { file: 'brindavan-gardens.jpg', title: 'Brindavan Gardens' },
  { file: 'st-philomenas.jpg', title: "St. Philomena's Cathedral, Mysore" },

  // ── 2. Jaipur ──
  { file: 'amber-fort.jpg', title: 'Amer Fort' },
  { file: 'hawa-mahal.jpg', title: 'Hawa Mahal' },
  { file: 'city-palace-jaipur.jpg', title: 'City Palace, Jaipur' },
  { file: 'jantar-mantar.jpg', title: 'Jantar Mantar, Jaipur' },

  // ── 3. Goa ──
  { file: 'bom-jesus.jpg', title: 'Basilica of Bom Jesus' },
  { file: 'palolem-beach.jpg', title: 'Palolem Beach' },
  { file: 'fontainhas.jpg', title: 'Fontainhas (suburb)' },
  { file: 'dudhsagar-falls.jpg', title: 'Dudhsagar Falls' },

  // ── 4. Delhi ──
  { file: 'india-gate.jpg', title: 'India Gate' },
  { file: 'humayuns-tomb.jpg', title: "Humayun's Tomb" },
  { file: 'qutub-minar.jpg', title: 'Qutb Minar complex' },
  { file: 'chandni-chowk.jpg', title: 'Chandni Chowk' },
  { file: 'red-fort.jpg', title: 'Red Fort' },

  // ── 5. Agra ──
  { file: 'taj-mahal.jpg', title: 'Taj Mahal' },
  { file: 'agra-fort.jpg', title: 'Agra Fort' },
  { file: 'mehtab-bagh.jpg', title: 'Mehtab Bagh' },
  { file: 'fatehpur-sikri.jpg', title: 'Fatehpur Sikri' },

  // ── 6. Mumbai ──
  { file: 'mumbai-gateway.jpg', title: 'Gateway of India' },
  { file: 'marine-drive.jpg', title: 'Marine Drive, Mumbai' },
  { file: 'elephanta-caves.jpg', title: 'Elephanta Caves' },
  { file: 'cst-mumbai.jpg', title: 'Chhatrapati Shivaji Terminus' },

  // ── 7. Varanasi ──
  { file: 'varanasi-ghats.jpg', title: 'Ghats in Varanasi' },
  { file: 'dashashwamedh-ghat.jpg', title: 'Dashashwamedh Ghat' },
  { file: 'kashi-vishwanath.jpg', title: 'Kashi Vishwanath Temple' },
  { file: 'sarnath.jpg', title: 'Sarnath' },

  // ── 8. Kerala ──
  { file: 'kerala-backwaters.jpg', title: 'Alappuzha' },
  { file: 'munnar-tea.jpg', title: 'Munnar' },
  { file: 'kochi-nets.jpg', title: 'Chinese fishing nets' },
  { file: 'athirappilly.jpg', title: 'Athirappilly Falls' },

  // ── 9. Hampi ──
  { file: 'hampi-chariot.jpg', title: 'Vittala Temple, Hampi' },
  { file: 'virupaksha-temple.jpg', title: 'Virupaksha Temple, Hampi' },
  { file: 'matanga-hill.jpg', title: 'Matanga Hill' },
  { file: 'lotus-mahal.jpg', title: 'Lotus Mahal, Hampi' },

  // ── 10. Ladakh ──
  { file: 'pangong-tso.jpg', title: 'Pangong Tso' },
  { file: 'thiksey-monastery.jpg', title: 'Thikse Monastery' },
  { file: 'khardung-la.jpg', title: 'Khardung La' },
  { file: 'nubra-valley.jpg', title: 'Nubra Valley' },

  // ── 11. Bengaluru ──
  { file: 'vidhana-soudha.jpg', title: 'Vidhana Soudha' },
  { file: 'lalbagh-glasshouse.jpg', title: 'Lalbagh' },
  { file: 'bangalore-palace.jpg', title: 'Bangalore Palace' },
  { file: 'cubbon-park.jpg', title: 'Cubbon Park' },

  // ── 12. Udaipur ──
  { file: 'udaipur-city-palace.jpg', title: 'City Palace, Udaipur' },
  { file: 'lake-pichola.jpg', title: 'Lake Pichola' },
  { file: 'saheliyon-ki-bari.jpg', title: 'Saheliyon-ki-Bari' },
  { file: 'jagdish-temple.jpg', title: 'Jagdish Temple' },

  // ── 13. Amritsar ──
  { file: 'golden-temple.jpg', title: 'Golden Temple' },
  { file: 'jallianwala-bagh.jpg', title: 'Jallianwala Bagh' },
  { file: 'wagah-border.jpg', title: 'Attari–Wagah border ceremony' },

  // ── 14. Rishikesh ──
  { file: 'lakshman-jhula.jpg', title: 'Lakshman Jhula' },
  { file: 'triveni-ghat.jpg', title: 'Triveni Ghat' },
  { file: 'parmarth-niketan.jpg', title: 'Parmarth Niketan' },
  { file: 'beatles-ashram.jpg', title: 'The Beatles Ashram' },

  // ── 15. Jaisalmer ──
  { file: 'jaisalmer-fort.jpg', title: 'Jaisalmer Fort' },
  { file: 'sam-sand-dunes.jpg', title: 'Sam Sand Dunes' },
  { file: 'patwon-ki-haveli.jpg', title: 'Patwon Ki Haveli' },
  { file: 'gadisar-lake.jpg', title: 'Gadisar Lake' },

  // ── 16. Srinagar ──
  { file: 'dal-lake.jpg', title: 'Dal Lake' },
  { file: 'nishat-bagh.jpg', title: 'Nishat Bagh' },
  { file: 'shankaracharya-temple.jpg', title: 'Shankaracharya Temple' },
  { file: 'gulmarg.jpg', title: 'Gulmarg' },

  // ── 17. Andaman ──
  { file: 'radhanagar-beach.jpg', title: 'Radhanagar Beach' },
  { file: 'cellular-jail.jpg', title: 'Cellular Jail' },
  { file: 'elephant-beach.jpg', title: 'Havelock Island' },
  { file: 'ross-island.jpg', title: 'Ross Island, South Andaman' },

  // ── 18. Darjeeling ──
  { file: 'darjeeling-toy-train.jpg', title: 'Darjeeling Himalayan Railway' },
  { file: 'tiger-hill.jpg', title: 'Tiger Hill, Darjeeling' },
  { file: 'happy-valley-tea.jpg', title: 'Happy Valley Tea Estate' },
  { file: 'peace-pagoda.jpg', title: 'Peace Pagoda, Darjeeling' },

  // ── 19. Meghalaya ──
  { file: 'living-root-bridge.jpg', title: 'Living root bridge' },
  { file: 'nohkalikai-falls.jpg', title: 'Nohkalikai Falls' },
  { file: 'dawki-river.jpg', title: 'Umngot River' },
  { file: 'krang-shuri.jpg', title: 'Amlarem' },

  // ── 20. Coorg ──
  { file: 'coorg-hills.jpg', title: 'Madikeri' },
  { file: 'abbey-falls.jpg', title: 'Abbey Falls' },
  { file: 'rajas-seat.jpg', title: "Raja's Seat" },
  { file: 'namdroling-monastery.jpg', title: 'Namdroling Monastery' },
];

const destDir = path.resolve('public/images/destinations');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

async function fetchWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=thumbnail&pithumbsize=1280&titles=${encodeURIComponent(title)}`;
    https.get(url, { headers: { 'User-Agent': 'TouristMatramBot/1.0 (info@touristmatram.in)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            for (const k in pages) {
              if (pages[k]?.thumbnail?.source) {
                return resolve(pages[k].thumbnail.source);
              }
            }
          }
          resolve(null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function downloadFile(url, filepath) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'TouristMatramBot/1.0 (info@touristmatram.in)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, filepath).then(resolve);
      }
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(filepath);
          resolve(stats.size > 1000);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  console.log(`Processing ${TARGETS.length} target landmark images...`);
  const missing = [];
  for (const t of TARGETS) {
    const filePath = path.join(destDir, t.file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
      console.log(`✓ Exists: ${t.file}`);
      continue;
    }
    const imgUrl = await fetchWikiImage(t.title);
    if (!imgUrl) {
      missing.push(t);
      console.log(`✗ No wiki thumb for: ${t.title} (${t.file})`);
      continue;
    }
    const success = await downloadFile(imgUrl, filePath);
    if (success) {
      const sz = Math.round(fs.statSync(filePath).size / 1024);
      console.log(`✓ Downloaded ${t.file} (${sz} KB) for ${t.title}`);
    } else {
      missing.push(t);
      console.log(`✗ Download failed for ${t.file}`);
    }
  }
  console.log(`Done. Missing: ${missing.length}`);
  fs.writeFileSync('scripts/missing.json', JSON.stringify(missing, null, 2));
}

run();
