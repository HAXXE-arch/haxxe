export const defaultModules = [
  {
    id: 'm1',
    judul: 'Pengenalan Dasar Investasi vs Menabung',
    kategori: 'Dasar Investasi',
    level: 'Pemula',
    durasi: '5 Menit',
    deskripsi:
      'Pahami mengapa menabung saja kalah oleh inflasi dan bagaimana bunga berbunga bekerja membangun aset jangka panjang.',
    imageUrl: '/src/assets/images/modul_compounding_1795589923723.jpg',
    materiLengkap: {
      konsepInti:
        'Menabung berfokus menjaga keamanan nominal uang untuk kebutuhan jangka pendek, sedangkan investasi menempatkan dana pada aset produktif agar nilainya bertumbuh melampaui kenaikan harga barang (inflasi).',
      poinKunci: [
        {
          judul: 'Dampak Inflasi',
          isi: 'Jika inflasi rata-rata 4% per tahun sementara bunga tabungan hanya 1%, daya beli uang Anda sebenarnya turun sekitar 3% setiap tahun.',
        },
        {
          judul: 'Compounding Interest (Bunga Berbunga)',
          isi: 'Keuntungan yang dihasilkan di tahun pertama ikut diinvestasikan kembali sehingga imbal hasil tahun berikutnya tumbuh jauh lebih cepat.',
        },
        {
          judul: 'Kapan Menabung vs Investasi',
          isi: 'Gunakan tabungan atau pasar uang untuk dana darurat (kurang dari 1 tahun), dan gunakan instrumen investasi untuk target di atas 2 tahun.',
        },
      ],
      contohNyata:
        'Dana Rp 10.000.000 yang dibiarkan di tabungan biasa (bunga 1%/tahun) selama 10 tahun hanya menjadi sekitar Rp 11,05 juta. Jika ditempatkan pada instrumen bertumbuh 10%/tahun secara konsisten, nilainya berpotensi mencapai sekitar Rp 25,94 juta.',
      langkahPraktis:
        'Pisahkan rekening kebutuhan harian dengan rekening investasi, lalu tetapkan nominal rutin bulanan yang nyaman sebelum mulai memilih instrumen.',
    },
  },
  {
    id: 'm2',
    judul: 'Mengenal Reksadana & Cara Kerja Manajer Investasi',
    kategori: 'Pasar Modal',
    level: 'Pemula',
    durasi: '7 Menit',
    deskripsi:
      'Cara kerja pengelolaan dana kolektif oleh Manajer Investasi berlisensi dan perbedaan tiap jenis reksadana.',
    imageUrl: '/src/assets/images/modul_capital_market_1795589923898.jpg',
    materiLengkap: {
      konsepInti:
        'Reksadana adalah wadah investasi kolektif yang menghimpun dana dari banyak investor lalu dikelola oleh Manajer Investasi (MI) terdaftar dan diawasi OJK ke dalam berbagai aset.',
      poinKunci: [
        {
          judul: 'Reksadana Pasar Uang (RDPU)',
          isi: 'Berisi deposito dan surat utang jatuh tempo di bawah 1 tahun. Pergerakannya sangat stabil dan cocok untuk pemula atau dana darurat.',
        },
        {
          judul: 'Reksadana Pendapatan Tetap (RDPT)',
          isi: 'Minimal 80% dananya ditempatkan pada obligasi. Cocok untuk target menengah 2-4 tahun dengan fluktuasi ringan hingga sedang.',
        },
        {
          judul: 'Reksadana Saham (RDS)',
          isi: 'Minimal 80% ditempatkan pada saham. Potensi imbal hasil paling tinggi, namun harganya bisa naik-turun tajam sehingga ideal untuk jangka panjang di atas 5 tahun.',
        },
        {
          judul: 'NAB/Unit & Diversifikasi',
          isi: 'Dengan modal mulai Rp 10.000-Rp 100.000, dana Anda otomatis tersebar ke puluhan instrumen sekaligus sehingga risiko tunggal berkurang.',
        },
      ],
      contohNyata:
        'Jika Anda membeli RDPU senilai Rp 1.000.000 saat harga NAB/Unit Rp 1.250, Anda memperoleh 800 unit penyertaan. Saat NAB naik menjadi Rp 1.325 setahun kemudian, nilai investasi Anda menjadi Rp 1.060.000 (keuntungan bersih bebas pajak tambahan).',
      langkahPraktis:
        'Periksa dokumen Fund Fact Sheet sebelum membeli untuk melihat rekam jejak kinerja, isi portofolio utama, dan biaya pengelolaan (expense ratio).',
    },
  },
  {
    id: 'm3',
    judul: 'Belajar Obligasi Negara & SBN Ritel Digital',
    kategori: 'Pendapatan Tetap',
    level: 'Menengah',
    durasi: '8 Menit',
    deskripsi:
      'Memahami surat utang negara yang dijamin undang-undang dengan imbal hasil kupon bulanan dan pajak ringan.',
    imageUrl: '/src/assets/images/aset_fixed_income_1795589924769.jpg',
    materiLengkap: {
      konsepInti:
        'Surat Berharga Negara (SBN) Ritel adalah instrumen surat utang yang diterbitkan Pemerintah Indonesia kepada warga negara individu, dengan pembayaran pokok dan kupon dijamin penuh oleh Undang-Undang.',
      poinKunci: [
        {
          judul: 'Seri Tradable (ORI & SR)',
          isi: 'Dapat dijual kembali di pasar sekunder sebelum jatuh tempo. Harga jual mengikuti kondisi suku bunga pasar sehingga ada potensi capital gain atau loss.',
        },
        {
          judul: 'Seri Non-Tradable (SBR & ST)',
          isi: 'Tidak dapat diperjualbelikan di pasar sekunder, tetapi memiliki kupon mengambang dengan batas minimal (floating with floor) dan fasilitas pencairan awal sebagian (early redemption).',
        },
        {
          judul: 'Keunggulan Pajak Kupon',
          isi: 'Pajak imbal hasil SBN hanya 10% (final), lebih rendah dibandingkan pajak bunga deposito perbankan sebesar 20%.',
        },
      ],
      contohNyata:
        'Pembelian SBN sebesar Rp 50.000.000 dengan kupon 6,25% per tahun menghasilkan kupon kotor Rp 3.125.000/tahun. Setelah pajak 10%, Anda menerima pemasukan pasif bersih sekitar Rp 234.375 langsung ke rekening setiap bulan.',
      langkahPraktis:
        'Pilih seri yang tenor dan sifat pencairannya paling sesuai dengan jadwal kebutuhan dana Anda (misal tenor 2-3 tahun untuk rencana renovasi atau pendidikan).',
    },
  },
  {
    id: 'm4',
    judul: 'Analisis Fundamental Saham: PER, PBV, & ROE',
    kategori: 'Pasar Modal',
    level: 'Lanjutan',
    durasi: '10 Menit',
    deskripsi:
      'Cara praktis membaca tiga rasio utama laporan keuangan untuk menilai kewajaran harga saham dan kesehatan bisnis emiten.',
    imageUrl: '/src/assets/images/modul_capital_market_1795589923898.jpg',
    materiLengkap: {
      konsepInti:
        'Analisis fundamental membantu investor membeli saham perusahaan yang sehat dengan harga masuk akal, bukan sekadar mengikuti tren harga harian.',
      poinKunci: [
        {
          judul: 'PER (Price to Earnings Ratio)',
          isi: 'Mengukur berapa kali lipat harga saham dibandingkan laba bersih per lembar. PER 10x berarti secara teori modal Anda setara dengan 10 tahun laba perusahaan saat ini.',
        },
        {
          judul: 'PBV (Price to Book Value)',
          isi: 'Membandingkan harga saham dengan nilai kekayaan bersih (ekuitas) per lembar. PBV di bawah 1x menandakan harga pasar lebih murah dari nilai bukunya, meski tetap perlu dicek kualitas labanya.',
        },
        {
          judul: 'ROE (Return on Equity)',
          isi: 'Mengukur seberapa efisien manajemen menghasilkan laba dari modal pemegang saham. Perusahaan berkualitas umumnya memiliki ROE konsisten di atas 12%-15%.',
        },
      ],
      contohNyata:
        'Dua bank sama-sama memiliki PER 12x, namun Bank A mencetak ROE 18% dengan pertumbuhan laba stabil, sedangkan Bank B hanya memiliki ROE 7%. Dengan valuasi yang mirip, Bank A lebih efisien mengembangkan modal investor.',
      langkahPraktis:
        'Jangan gunakan satu rasio secara terpisah—bandingkan PER, PBV, ROE, serta rasio utang (DER) terhadap perusahaan lain di sektor industri yang sama.',
    },
  },
  {
    id: 'm5',
    judul: 'Strategi Diversifikasi & Manajemen Risiko Portofolio',
    kategori: 'Manajemen Risiko',
    level: 'Menengah',
    durasi: '7 Menit',
    deskripsi:
      'Menjaga keseimbangan imbal hasil dan keamanan dana dengan menyebar modal lintas instrumen serta melakukan rebalancing berkala.',
    imageUrl: '/src/assets/images/aset_gold_reserve_1795589925176.jpg',
    materiLengkap: {
      konsepInti:
        'Diversifikasi berarti membagi modal ke beberapa jenis aset yang pergerakannya tidak selalu searah, sehingga penurunan satu aset dapat diredam oleh stabilitas aset lainnya.',
      poinKunci: [
        {
          judul: 'Jangan Taruh Semua Dana di Satu Aset',
          isi: 'Menempatkan 100% dana di satu saham berisiko membuat seluruh portofolio terpukul saat sektor tersebut melemah.',
        },
        {
          judul: 'Kombinasi Aset Defensif & Pertumbuhan',
          isi: 'Aset defensif (Pasar Uang, SBN, Emas) menjaga stabilitas, sementara aset pertumbuhan (Saham/Indeks) mendorong akumulasi nilai jangka panjang.',
        },
        {
          judul: 'Rebalancing Berkala',
          isi: 'Setiap 6-12 bulan, sesuaikan kembali bobot portofolio jika porsi saham tumbuh terlalu besar dibanding target awal agar tingkat risiko tetap terkendali.',
        },
      ],
      contohNyata:
        'Investor moderat membagi Rp 20.000.000 menjadi 30% Reksadana Pasar Uang (Rp 6 juta), 40% SBN (Rp 8 juta), dan 30% Saham Bluechip/Indeks (Rp 6 juta). Saat IHSG terkoreksi 10%, total portofolio hanya terpengaruh sekitar -3% karena 70% dana berada di aset stabil.',
      langkahPraktis:
        'Gunakan Kuis Profil Risiko di portal ini untuk menentukan persentase pembagian aset awal yang sesuai dengan kenyamanan Anda.',
    },
  },
];

export const defaultAssets = [
  {
    id: 'a1',
    nama: 'Reksadana Pasar Uang (RPU)',
    risiko: 'Rendah',
    risikoTier: 'Rendah',
    potensi: '4.5% - 6.0% / thn',
    likuiditas: 'Tinggi (1-2 hari kerja)',
    horison: '< 1 - 2 Tahun',
    imageUrl: '/src/assets/images/modul_compounding_1795589923723.jpg',
    deskripsi:
      'Instrumen berisiko paling rendah yang menempatkan dana pada deposito bank dan surat utang jangka pendek di bawah 1 tahun.',
    detailLengkap: {
      caraKerja:
        'Manajer Investasi menempatkan dana kolektif ke deposito berjangka dan obligasi jatuh tempo kurang dari setahun, sehingga nilai investasinya cenderung naik stabil nyaris tanpa gejolak harian.',
      poinKunci: [
        {
          judul: 'Tingkat Risiko',
          isi: 'Sangat rendah; penurunan nilai harian sangat jarang terjadi selama penerbit surat utang tidak gagal bayar.',
        },
        {
          judul: 'Keunggulan Utama',
          isi: 'Imbal hasil umumnya lebih tinggi dari tabungan bank biasa, bebas pajak tambahan bagi investor individu, dan dapat dicairkan dalam 1-2 hari bursa tanpa denda.',
        },
        {
          judul: 'Peruntukan Ideal',
          isi: 'Penyimpanan dana darurat, dana nikah, atau biaya pendidikan yang akan dipakai dalam waktu kurang dari 2 tahun.',
        },
      ],
      contohNyata:
        'Dana darurat Rp 24.000.000 di RPU dengan return bersih 5%/tahun menghasilkan tambahan sekitar Rp 1.200.000 per tahun sambil tetap mudah dicairkan kapan saja saat dibutuhkan.',
      halDiperhatikan:
        'Imbal hasilnya tidak dirancang untuk mengejar kekayaan jangka panjang karena kenaikannya sedikit di atas inflasi rata-rata.',
    },
  },
  {
    id: 'a2',
    nama: 'Obligasi Negara / SBN Ritel',
    risiko: 'Rendah - Sedang',
    risikoTier: 'Sedang',
    potensi: '6.0% - 7.5% / thn',
    likuiditas: 'Menengah',
    horison: '2 - 5 Tahun',
    imageUrl: '/src/assets/images/aset_fixed_income_1795589924769.jpg',
    deskripsi:
      'Surat utang resmi diterbitkan pemerintah Republik Indonesia dengan pembayaran kupon rutin bulanan dan pajak ringan 10%.',
    detailLengkap: {
      caraKerja:
        'Anda meminjamkan dana kepada negara selama masa tenor tertentu (umumnya 2-3 tahun) dan menerima imbal hasil berupa kupon tetap atau mengambang setiap bulan hingga pokok dikembalikan penuh saat jatuh tempo.',
      poinKunci: [
        {
          judul: 'Keamanan Pokok',
          isi: 'Pembayaran pokok dan kupon dijamin langsung oleh Undang-Undang APBN Republik Indonesia.',
        },
        {
          judul: 'Arus Kas Bulanan',
          isi: 'Cocok bagi investor yang menginginkan pemasukan pasif rutin setiap bulan dengan pajak kupon hanya 10%.',
        },
        {
          judul: 'Peruntukan Ideal',
          isi: 'Target keuangan jangka menengah (2-5 tahun) seperti uang muka rumah atau dana pendidikan anak.',
        },
      ],
      contohNyata:
        'Menempatkan Rp 30.000.000 di ORI/SBR berkupon 6,4%/tahun memberikan kupon bersih sekitar Rp 144.000 setiap bulan ke rekening tanpa perlu memantau grafik pasar.',
      halDiperhatikan:
        'Untuk seri non-tradable (SBR/ST), dana baru bisa dicairkan penuh saat jatuh tempo (kecuali fasilitas early redemption maksimal 50% setelah periode tertentu).',
    },
  },
  {
    id: 'a3',
    nama: 'Saham Bluechip (IHSG / LQ45)',
    risiko: 'Tinggi',
    risikoTier: 'Tinggi',
    potensi: '10% - 15%+ / thn',
    likuiditas: 'Sangat Tinggi (T+2)',
    horison: '> 5 Tahun',
    imageUrl: '/src/assets/images/modul_capital_market_1795589923898.jpg',
    deskripsi:
      'Bukti kepemilikan atas perusahaan publik mapan berkapitalisasi besar dengan fundamental kuat dan rekam jejak pembagian dividen.',
    detailLengkap: {
      caraKerja:
        'Saat membeli saham, Anda menjadi pemilik sebagian bisnis perusahaan. Keuntungan datang dari dua sumber: kenaikan harga saham (capital gain) seiring pertumbuhan laba bisnis, serta pembagian dividen tunai tahunan.',
      poinKunci: [
        {
          judul: 'Volatilitas Harga',
          isi: 'Harga saham bergerak setiap detik mengikuti kondisi ekonomi, suku bunga, dan laporan kinerja perusahaan, sehingga nilainya bisa turun sementara.',
        },
        {
          judul: 'Likuiditas Tinggi',
          isi: 'Saham bluechip ramai diperdagangkan di bursa dan dana hasil penjualan cair dalam 2 hari bursa (T+2).',
        },
        {
          judul: 'Peruntukan Ideal',
          isi: 'Investasi jangka panjang di atas 5 tahun seperti dana pensiun atau target kebebasan finansial.',
        },
      ],
      contohNyata:
        'Pembelian rutin Rp 1.000.000/bulan pada saham indeks/bluechip dengan rata-rata pertumbuhan 12%/tahun selama 10 tahun berpotensi mengumpulkan sekitar Rp 230 juta dari total setoran Rp 120 juta.',
      halDiperhatikan:
        'Hindari menggunakan uang kebutuhan jangka pendek atau dana pinjaman karena koreksi pasar 15%-25% dalam jangka pendek sangat wajar terjadi pada pasar saham.',
    },
  },
  {
    id: 'a4',
    nama: 'Emas & Logam Mulia',
    risiko: 'Rendah - Sedang',
    risikoTier: 'Sedang',
    potensi: '7.0% - 10% / thn',
    likuiditas: 'Tinggi',
    horison: '> 5 Tahun',
    imageUrl: '/src/assets/images/aset_gold_reserve_1795589925176.jpg',
    deskripsi:
      'Aset lindung nilai (safe haven) tradisional yang terbukti tahan menjaga daya beli kekayaan di tengah inflasi dan gejolak ekonomi.',
    detailLengkap: {
      caraKerja:
        'Emas tidak memberikan bunga atau dividen bulanan; keuntungannya berasal dari kenaikan harga emas terhadap mata uang kertas dalam jangka panjang, terutama saat inflasi tinggi atau kurs melemah.',
      poinKunci: [
        {
          judul: 'Pelindung Nilai (Safe Haven)',
          isi: 'Ketika pasar saham bergejolak atau terjadi ketidakpastian global, harga emas cenderung bertahan atau justru menguat.',
        },
        {
          judul: 'Fleksibilitas Kepemilikan',
          isi: 'Dapat dikoleksi mulai nominal kecil melalui tabungan emas digital maupun batangan fisik bersertifikat resmi.',
        },
        {
          judul: 'Peruntukan Ideal',
          isi: 'Penyimpanan nilai kekayaan jangka panjang di atas 5 tahun dan pelengkap diversifikasi portofolio.',
        },
      ],
      contohNyata:
        'Jika harga beli emas Rp 1.400.000/gram dan harga buyback saat itu Rp 1.280.000/gram, Anda perlu menahan aset hingga harga pasar melampaui selisih sekitar 8-9% sebelum mulai mencatat keuntungan bersih.',
      halDiperhatikan:
        'Terdapat selisih harga beli dan harga jual kembali (spread), sehingga emas kurang optimal jika hanya disimpan dalam hitungan minggu atau beberapa bulan.',
    },
  },
];

export const defaultHistory = [
  {
    era: '1602 — Amsterdam',
    judul: 'Lahirnya Bursa Saham Modern Pertama (VOC)',
    deskripsi:
      'Perusahaan Hindia Timur Belanda (VOC) pertama kali menerbitkan saham dan obligasi publik yang dapat diperjualbelikan bebas di Bursa Amsterdam untuk mendanai ekspedisi dagang lintas benua.',
    pelajaran:
      'Sistem ini melahirkan konsep berbagi kepemilikan dan risiko: masyarakat biasa dapat ikut mendanai usaha berskala besar tanpa harus mengelola operasionalnya sendiri.',
  },
  {
    era: '1929 — Wall Street',
    judul: 'Kejatuhan Pasar 1929 & The Great Depression',
    deskripsi:
      'Spekulasi berlebihan menggunakan dana pinjaman (margin trading) memicu gelembung harga saham yang akhirnya pecah pada Oktober 1929 dan menyeret ekonomi global ke depresi panjang.',
    pelajaran:
      'Berinvestasi dengan uang pinjaman tanpa perhitungan risiko dapat melipatgandakan kerugian secara fatal saat pasar berbalik arah.',
  },
  {
    era: '1977 — Indonesia',
    judul: 'Pengaktifan Kembali Pasar Modal Indonesia (BEI)',
    deskripsi:
      'Pemerintah mengaktifkan kembali pasar modal melalui Bursa Efek Jakarta, yang terus berevolusi dari sertifikat kertas hingga sistem perdagangan elektronik penuh di Bursa Efek Indonesia.',
    pelajaran:
      'Kemajuan regulasi dan teknologi membuat akses kepemilikan perusahaan terbuka kini aman, transparan, dan terjangkau bagi investor ritel.',
  },
  {
    era: '2008 — Global',
    judul: 'Krisis Keuangan Subprime Mortgage',
    deskripsi:
      'Kredit perumahan berisiko tinggi yang dibungkus menjadi produk derivatif kompleks gagal bayar secara massal, meruntuhkan bank investasi besar dan mengguncang bursa saham dunia.',
    pelajaran:
      'Prinsip emas investor: jangan pernah menempatkan dana pada instrumen keuangan yang cara kerja dan risikonya tidak Anda pahami dengan jelas.',
  },
];

export const quizQuestions = [
  {
    id: 'q1',
    q: 'Berapa lama jangka waktu target investasi Anda saat ini?',
    options: [
      { text: 'Kurang dari 1 Tahun (Jangka Pendek)', points: 1 },
      { text: '1 hingga 5 Tahun (Jangka Menengah)', points: 2 },
      { text: 'Lebih dari 5 Tahun (Jangka Panjang)', points: 3 },
    ],
  },
  {
    id: 'q2',
    q: 'Bagaimana respons Anda apabila nilai portofolio turun 15% dalam satu bulan?',
    options: [
      { text: 'Merasa cemas dan segera menjual seluruh sisa aset', points: 1 },
      { text: 'Menahan posisi dan menunggu hingga harga pulih', points: 2 },
      { text: 'Menambah pembelian secara bertahap di harga lebih rendah', points: 3 },
    ],
  },
  {
    id: 'q3',
    q: 'Apa prioritas utama dari alokasi dana yang Anda investasikan?',
    options: [
      { text: 'Menjaga keutuhan modal dan likuiditas dana darurat', points: 1 },
      { text: 'Pertumbuhan stabil untuk target menengah seperti hunian', points: 2 },
      { text: 'Maksimalisasi pertumbuhan dana pensiun jangka panjang', points: 3 },
    ],
  },
];
