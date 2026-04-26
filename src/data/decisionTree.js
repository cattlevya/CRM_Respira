// WARNING / CATATAN PENTING:
// - Pohon keputusan ini bersifat EDUKATIF/TAMBAHAN, bukan pengganti diagnosis dokter.
// - Diagnosis definitif memerlukan anamnesis lengkap, pemeriksaan fisik, dan penunjang.
// - Jangan gunakan ini untuk mengambil keputusan klinis sendiri tanpa tenaga kesehatan.

export const decisionTree = [
  // =================================================================================================
  // ROOT & TRIASE (EMERGENCY CHECK)
  // =================================================================================================
  {
    id: 'start',
    question: "Pemeriksaan Tanda Bahaya (Triase Gawat Darurat)",
    description: "Perhatikan kondisi fisik pasien secara menyeluruh. Apakah terdapat tanda-tanda berikut?",
    type: 'danger_check',
    image: "https://placehold.co/800x400/0f172a/06b6d4?text=Pemeriksaan+Fisik+Visual&font=roboto",
    options: [
      { label: "Bibir/Kuku Biru (Sianosis)", value: 'cyanosis', next: 'emergency_cyanosis' },
      { label: "Kesadaran Menurun / Pingsan", value: 'unconscious', next: 'emergency_unconscious' },
      { label: "Napas Sangat Cepat & Berat (>30x/menit pada dewasa)", value: 'tachypnea', next: 'emergency_tachypnea' },
      { label: "Tidak Mampu Bicara Kalimat Penuh karena Sesak", value: 'cant_speak', next: 'emergency_tachypnea' },
      { label: "Saturasi Oksigen < 90% (jika ada oksimeter)", value: 'low_spo2', next: 'emergency_tachypnea' },
      { label: "Nyeri Dada Kiri Menjalar Hebat", value: 'chest_pain_severe', next: 'emergency_acs' },
      { label: "Tidak Ada Tanda Bahaya", value: 'safe', next: 'main_complaint' }
    ]
  },

  // --- EMERGENCY RESULTS ---
  {
    id: 'emergency_cyanosis',
    type: 'result',
    diagnosis: "GAWAT DARURAT: Hipoksia Berat / Gagal Napas",
    recommendation:
      "SEGERA AKTIFKAN LAYANAN GAWAT DARURAT / BAWA KE IGD. " +
      "Jika ada tenaga kesehatan, oksigen dapat diberikan sesuai protokol. Jangan menunda.",
    severity: 'critical',
    confidence: 99
  },
  {
    id: 'emergency_unconscious',
    type: 'result',
    diagnosis: "GAWAT DARURAT: Penurunan Kesadaran (Syok / Gagal Napas)",
    recommendation:
      "SEGERA AKTIFKAN LAYANAN GAWAT DARURAT. " +
      "Prioritas: Airway, Breathing, Circulation (ABC). Jangan ditinggal sendirian.",
    severity: 'critical',
    confidence: 99
  },
  {
    id: 'emergency_tachypnea',
    type: 'result',
    diagnosis: "GAWAT DARURAT: Distres Pernapasan Berat",
    recommendation:
      "SEGERA KE IGD / PANGGIL AMBULANS. " +
      "Curiga pneumonia berat, edema paru, asma berat, emboli paru, atau sebab lain yang mengancam jiwa.",
    severity: 'critical',
    confidence: 98
  },
  {
    id: 'emergency_acs',
    type: 'result',
    diagnosis: "GAWAT DARURAT: Suspek Sindrom Koroner Akut (Serangan Jantung)",
    recommendation:
      "SEGERA KE IGD / PANGGIL AMBULANS. Jangan menyetir sendiri, istirahat total. " +
      "Pemberian obat (misalnya aspirin) hanya boleh atas anjuran tenaga kesehatan.",
    severity: 'critical',
    confidence: 98
  },

  // =================================================================================================
  // LEVEL 1: KELUHAN UTAMA
  // =================================================================================================
  {
    id: 'main_complaint',
    question: "Apa Keluhan Utama yang Paling Dirasakan?",
    description: "Pilih satu keluhan yang menjadi alasan utama pasien berobat hari ini.",
    type: 'choice',
    options: [
      { label: "Batuk (Cough)", value: 'batuk', next: 'cough_duration' },
      { label: "Sesak Napas (Dyspnea)", value: 'sesak', next: 'dyspnea_onset' },
      { label: "Nyeri Dada (Chest Pain)", value: 'nyeri', next: 'chest_pain_nature' }
    ]
  },

  // =================================================================================================
  // BRANCH 1: BATUK (COUGH) - DEEP CHAINING
  // =================================================================================================
  {
    id: 'cough_duration',
    question: "Sudah berapa lama batuk berlangsung?",
    type: 'choice',
    options: [
      { label: "< 3 Minggu (Akut)", value: 'acute', next: 'cough_sputum_check' },
      { label: "3–8 Minggu (Subakut)", value: 'subacute', next: 'cough_sputum_check' },
      { label: "> 8 Minggu (Kronis)", value: 'chronic', next: 'cough_chronic_sputum_check' } // guideline-based
    ]
  },

  // --- ACUTE / SUBACUTE COUGH PATH ---
  {
    id: 'cough_sputum_check',
    question: "Apakah batuk berdahak? Jika ya, apa warnanya?",
    type: 'image_selection',
    options: [
      {
        label: "Kering / Tidak Berdahak",
        value: 'dry',
        image: "https://placehold.co/300x200/f1f5f9/475569?text=Batuk+Kering",
        next: 'cough_dry_trigger'
      },
      {
        label: "Bening / Putih Encer",
        value: 'white',
        image: "https://placehold.co/300x200/e2e8f0/1e293b?text=Dahak+Bening",
        next: 'cough_productive_symptoms'
      },
      {
        label: "Kuning / Hijau Kental",
        value: 'purulent',
        image: "https://placehold.co/300x200/fef08a/854d0e?text=Kuning/Hijau",
        next: 'cough_productive_symptoms'
      },
      {
        label: "Berdarah",
        value: 'blood',
        image: "https://placehold.co/300x200/fecaca/991b1b?text=Berdarah",
        next: 'cough_blood_check'
      }
    ]
  },

  // --- CHRONIC COUGH PATH ---
  {
    id: 'cough_chronic_sputum_check',
    question: "Karakteristik dahak pada batuk kronis?",
    type: 'image_selection',
    options: [
      {
        label: "Kering / Jarang Berdahak",
        value: 'dry',
        image: "https://placehold.co/300x200/f1f5f9/475569?text=Batuk+Kering",
        next: 'cough_chronic_dry_check'
      },
      {
        label: "Berdahak Banyak (Terutama Pagi Hari)",
        value: 'productive',
        image: "https://placehold.co/300x200/fef08a/854d0e?text=Dahak+Banyak",
        next: 'cough_copd_risk'
      },
      {
        label: "Berdarah / Bercak Darah",
        value: 'blood',
        image: "https://placehold.co/300x200/fecaca/991b1b?text=Berdarah",
        next: 'cough_blood_check'
      }
    ]
  },

  // --- BATUK KERING (ACUTE/SUBACUTE) ---
  {
    id: 'cough_dry_trigger',
    question: "Apakah ada pemicu tertentu batuk kering?",
    type: 'choice',
    options: [
      { label: "Debu, Dingin, atau Malam Hari", value: 'allergy', next: 'cough_dry_wheeze_check' },
      { label: "Saat Berbaring / Setelah Makan", value: 'gerd', next: 'result_gerd_cough' },
      { label: "Minum Obat Darah Tinggi Gol. ACE (mis. Captopril)", value: 'ace', next: 'result_ace_cough' },
      { label: "Tidak Ada Pemicu Jelas", value: 'none', next: 'cough_dry_associated' }
    ]
  },
  {
    id: 'cough_dry_wheeze_check',
    question: "Apakah disertai bunyi 'ngik' (mengi)?",
    type: 'audio_selection',
    options: [
      {
        label: "Ya, Ada Mengi",
        value: 'yes',
        audio: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Wheezing_lung_sound.ogg",
        next: 'result_asthma_cough_variant'
      },
      {
        label: "Tidak Ada",
        value: 'no',
        audio: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Normal_lung_sound.ogg",
        next: 'result_allergy_cough'
      }
    ]
  },
  {
    id: 'cough_dry_associated',
    question: "Gejala penyerta lain?",
    type: 'multi_choice',
    options: [
      { label: "Demam + Pilek + Nyeri Tenggorokan", value: 'uri', next: 'result_ispa' },
      { label: "Sesak Napas Berat", value: 'dyspnea', next: 'dyspnea_onset' }, // CROSS LINK
      { label: "Hanya Batuk Saja", value: 'none', next: 'result_cough_unspecified' }
    ]
  },

  // --- BATUK BERDAHAK (ACUTE/SUBACUTE) ---
  {
    id: 'cough_productive_symptoms',
    question: "Gejala penyerta apa yang dirasakan?",
    type: 'multi_choice',
    options: [
      { label: "Demam Tinggi (>38°C) & Menggigil", value: 'fever', next: 'cough_pneumonia_check' },
      { label: "Sesak Napas saat Aktivitas", value: 'dyspnea', next: 'cough_copd_check' },
      { label: "Hidung Tersumbat / Nyeri Wajah", value: 'sinus', next: 'result_sinusitis' },
      { label: "Tidak Ada Gejala Lain", value: 'none', next: 'result_bronchitis' }
    ]
  },
  {
    id: 'cough_pneumonia_check',
    question: "Dengarkan suara napas ini. Apakah terdengar mirip?",
    type: 'audio_selection',
    options: [
      {
        label: "Ya, Bunyi Kretek-kretek (Ronkhi / Crackles)",
        value: 'crackles',
        audio: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Crackles_lung_sound.ogg",
        next: 'result_pneumonia'
      },
      {
        label: "Tidak, Suara Napas Relatif Normal",
        value: 'normal',
        audio: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Normal_lung_sound.ogg",
        next: 'result_bronchitis_bacterial'
      }
    ]
  },

  // --- BATUK KRONIS & COPD ---
  {
    id: 'cough_copd_check',
    question: "Apakah pasien perokok aktif/pasif dengan riwayat panjang?",
    type: 'choice',
    options: [
      { label: "Ya, Perokok Berat / Usia > 40 Tahun", value: 'smoker', next: 'result_copd' },
      { label: "Tidak Merokok", value: 'non_smoker', next: 'result_bronchitis_chronic' }
    ]
  },
  {
    id: 'cough_copd_risk',
    question: "Riwayat merokok & usia?",
    type: 'choice',
    options: [
      { label: "Perokok > 10 Tahun, Usia > 40", value: 'high_risk', next: 'cough_copd_symptoms' },
      { label: "Bukan Perokok / Perokok Ringan", value: 'low_risk', next: 'cough_chronic_other' }
    ]
  },
  {
    id: 'cough_copd_symptoms',
    question: "Apakah sering sesak napas saat jalan cepat/naik tangga?",
    type: 'choice',
    options: [
      { label: "Ya, Sering Sesak", value: 'yes', next: 'copd_severity_check' },
      { label: "Tidak, Hanya Batuk", value: 'no', next: 'result_bronchitis_chronic_smoker' }
    ]
  },
  {
    id: 'copd_severity_check',
    question: "Seberapa jauh bisa berjalan sebelum harus berhenti karena sesak?",
    type: 'choice',
    options: [
      {
        label: "Kurang dari 100 meter / Hanya mampu di dalam rumah",
        value: 'severe',
        next: 'copd_history_check'
      },
      {
        label: "Masih bisa jalan jauh tapi lebih lambat dari orang seusia",
        value: 'moderate',
        next: 'result_copd'
      }
    ]
  },
  {
    id: 'copd_history_check',
    question: "Dalam 1 tahun terakhir, pernah dirawat di RS karena sesak?",
    type: 'choice',
    options: [
      { label: "Ya, Pernah Dirawat / Masuk IGD", value: 'hospitalized', next: 'copd_overlap_check' },
      { label: "Tidak Pernah", value: 'no', next: 'result_copd_severe' }
    ]
  },
  {
    id: 'copd_overlap_check',
    question: "Apakah kedua kaki terlihat bengkak?",
    description: "Periksa pergelangan kaki. Tekan dengan jari, apakah meninggalkan bekas cekungan?",
    type: 'choice',
    options: [
      { label: "Ya, Bengkak (Edema)", value: 'edema', next: 'copd_heart_check' },
      { label: "Tidak Bengkak", value: 'no', next: 'result_copd_exacerbation' }
    ]
  },
  {
    id: 'copd_heart_check',
    question: "Apakah sering terbangun malam hari karena sesak?",
    type: 'choice',
    options: [
      {
        label: "Ya, Harus duduk agar lega (Orthopnea)",
        value: 'orthopnea',
        next: 'result_copd_heart_failure'
      },
      { label: "Tidak, Tidur relatif nyenyak", value: 'no', next: 'result_copd_cor_pulmonale' }
    ]
  },
  {
    id: 'cough_chronic_dry_check',
    question: "Apakah ada riwayat kanker paru di keluarga atau penurunan berat badan?",
    type: 'choice',
    options: [
      { label: "Ya, Ada riwayat / BB turun tanpa sebab jelas", value: 'risk', next: 'result_lung_ca_suspect' },
      { label: "Tidak Ada", value: 'no', next: 'result_cough_chronic_idiopathic' }
    ]
  },
  {
    id: 'cough_chronic_other',
    question: "Apakah pernah riwayat TB paru sebelumnya?",
    type: 'choice',
    options: [
      { label: "Ya, Pernah TB dan Selesai OAT", value: 'tb_history', next: 'result_post_tb' },
      { label: "Tidak Pernah", value: 'no', next: 'result_bronchitis_chronic' }
    ]
  },

  // --- BATUK BERDARAH (TB / LAIN-LAIN) ---
  {
    id: 'cough_blood_check',
    question: "Analisa risiko Tuberkulosis (TB) dan penyebab batuk darah lain",
    description: "Jawab dengan jujur untuk deteksi dini TB dan kondisi serius lain.",
    type: 'multi_choice',
    options: [
      { label: "Berat badan turun drastis tanpa sebab jelas", value: 'weight_loss', next: 'result_tb_suspect' },
      { label: "Keringat malam hari tanpa aktivitas", value: 'night_sweats', next: 'result_tb_suspect' },
      { label: "Ada kontak dengan penderita TB paru", value: 'contact', next: 'result_tb_suspect' },
      {
        label: "Riwayat TB sebelumnya dan kini batuk darah lagi",
        value: 'post_tb',
        next: 'result_post_tb'
      },
      { label: "Tidak ada gejala di atas (hanya batuk darah)", value: 'none', next: 'result_hemoptysis_observation' }
    ]
  },

  // =================================================================================================
  // BRANCH 2: SESAK NAPAS (DYSPNEA) - DEEP CHAINING
  // =================================================================================================
  {
    id: 'dyspnea_onset',
    question: "Bagaimana awal mula sesak muncul?",
    type: 'choice',
    options: [
      { label: "Tiba-tiba (akut) dalam hitungan menit/jam", value: 'acute', next: 'dyspnea_acute_check' },
      { label: "Perlahan memberat dalam hitungan bulan/tahun", value: 'chronic', next: 'dyspnea_chronic_check' }
    ]
  },

  // --- SESAK AKUT ---
  {
    id: 'dyspnea_acute_check',
    question: "Apakah disertai suara mengi (ngik)?",
    type: 'audio_selection',
    options: [
      {
        label: "Ya, ada mengi",
        value: 'wheeze',
        audio: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Wheezing_lung_sound.ogg",
        next: 'dyspnea_asthma_trigger'
      },
      {
        label: "Tidak, napas cepat/berat saja",
        value: 'none',
        audio: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Normal_lung_sound.ogg",
        next: 'dyspnea_heart_check'
      }
    ]
  },
  {
    id: 'dyspnea_asthma_trigger',
    question: "Apakah ada riwayat alergi atau asma sebelumnya?",
    type: 'choice',
    options: [
      { label: "Ya, punya riwayat asma/alergi", value: 'yes', next: 'result_asthma_exacerbation' },
      { label: "Tidak punya riwayat", value: 'no', next: 'result_asthma_new' }
    ]
  },
  {
    id: 'dyspnea_heart_check',
    question: "Apakah sesak dipengaruhi posisi tidur?",
    type: 'choice',
    options: [
      {
        label: "Ya, sesak jika tidur telentang (orthopnea) atau sering terbangun malam karena sesak",
        value: 'orthopnea',
        next: 'dyspnea_heart_swelling'
      },
      { label: "Tidak, sama saja dalam berbagai posisi", value: 'none', next: 'result_dyspnea_unspecified' }
    ]
  },
  {
    id: 'dyspnea_heart_swelling',
    question: "Apakah kedua kaki bengkak?",
    type: 'choice',
    options: [
      { label: "Ya, bengkak (edema)", value: 'edema', next: 'result_heart_failure' },
      { label: "Tidak bengkak", value: 'no', next: 'result_heart_failure_suspect' }
    ]
  },

  // --- SESAK KRONIS ---
  {
    id: 'dyspnea_chronic_check',
    question: "Faktor risiko utama sesak kronis?",
    type: 'choice',
    options: [
      {
        label: "Kombinasi: riwayat asma DAN perokok berat (usia > 40)",
        value: 'mixed',
        next: 'aco_pattern_check'
      },
      { label: "Perokok berat / bekas perokok", value: 'smoker', next: 'result_copd' },
      { label: "Riwayat pengobatan TB / paru rusak", value: 'tb_sequelae', next: 'result_post_tb' },
      { label: "Penyakit jantung / darah tinggi", value: 'heart', next: 'result_heart_failure_chronic' }
    ]
  },
  {
    id: 'aco_pattern_check',
    question: "Bagaimana pola sesak napasnya?",
    type: 'choice',
    options: [
      {
        label: "Terus-menerus ada, tapi kadang memburuk drastis (eksaserbasi)",
        value: 'persistent_variable',
        next: 'aco_trigger_check'
      },
      {
        label: "Hanya kambuh sesekali, di antara serangan relatif bebas gejala",
        value: 'intermittent',
        next: 'result_asthma_new'
      }
    ]
  },
  {
    id: 'aco_trigger_check',
    question: "Apakah kondisi memburuk dalam 3 hari terakhir?",
    type: 'choice',
    options: [
      { label: "Ya, memberat disertai demam/flu", value: 'infection', next: 'aco_sputum_check' },
      { label: "Tidak, stabil seperti biasa", value: 'stable', next: 'result_copd' }
    ]
  },
  {
    id: 'aco_sputum_check',
    question: "Apakah batuk menjadi lebih sering?",
    type: 'choice',
    options: [
      { label: "Ya, batuk produktif (berdahak)", value: 'productive', next: 'aco_sputum_color' },
      { label: "Tidak, batuk lebih kering", value: 'dry', next: 'aco_sound_check' }
    ]
  },
  {
    id: 'aco_sputum_color',
    question: "Apa warna dahak saat ini?",
    type: 'image_selection',
    options: [
      {
        label: "Kuning / Hijau Kental (Purulen)",
        value: 'purulent',
        image: "https://placehold.co/300x200/fef08a/854d0e?text=Kuning+Hijau",
        next: 'aco_sound_check'
      },
      {
        label: "Bening / Putih",
        value: 'white',
        image: "https://placehold.co/300x200/e2e8f0/1e293b?text=Bening",
        next: 'aco_sound_check'
      },
      {
        label: "Berdarah (Merah Segar)",
        value: 'blood',
        image: "https://placehold.co/300x200/fecaca/991b1b?text=Berdarah",
        next: 'aco_sound_check'
      },
      {
        label: "Merah muda berbuih (pink frothy)",
        value: 'pink_frothy',
        image: "https://placehold.co/300x200/fce7f3/be185d?text=Pink+Berbuih",
        next: 'result_heart_failure'
      }
    ]
  },
  {
    id: 'aco_sound_check',
    question: "Dengarkan suara napas. Apa yang terdengar?",
    type: 'audio_selection',
    options: [
      {
        label: "Mengi (ngik) DAN ronkhi (kretek)",
        value: 'mixed',
        audio: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Wheezing_lung_sound.ogg",
        next: 'aco_activity_check'
      },
      {
        label: "Hanya mengi",
        value: 'wheeze',
        audio: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Wheezing_lung_sound.ogg",
        next: 'aco_activity_check'
      },
      {
        label: "Hanya ronkhi",
        value: 'crackles',
        audio: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Crackles_lung_sound.ogg",
        next: 'aco_activity_check'
      }
    ]
  },
  {
    id: 'aco_activity_check',
    question: "Apakah sesak mengganggu bicara?",
    type: 'choice',
    options: [
      {
        label: "Ya, hanya bisa bicara terputus-putus (penggal kalimat)",
        value: 'severe',
        next: 'aco_treatment_check'
      },
      {
        label: "Masih bisa bicara kalimat penuh",
        value: 'moderate',
        next: 'aco_treatment_check'
      }
    ]
  },
  {
    id: 'aco_treatment_check',
    question: "Apakah sudah menggunakan inhaler/obat rutin?",
    type: 'choice',
    options: [
      {
        label: "Sudah pakai tapi TIDAK membaik",
        value: 'failed',
        next: 'aco_history_check'
      },
      {
        label: "Belum pakai obat sama sekali",
        value: 'none',
        next: 'result_aco_infected'
      }
    ]
  },
  {
    id: 'aco_history_check',
    question: "Apakah pernah dirawat di ICU / dipasang alat bantu napas?",
    type: 'choice',
    options: [
      {
        label: "Ya, pernah masuk ICU / intubasi",
        value: 'icu',
        next: 'result_aco_severe_infected'
      },
      { label: "Tidak pernah", value: 'no', next: 'result_aco_infected' }
    ]
  },

  // =================================================================================================
  // BRANCH 3: NYERI DADA (CHEST PAIN) - DEEP CHAINING
  // =================================================================================================
  {
    id: 'chest_pain_nature',
    question: "Seperti apa rasa nyerinya?",
    type: 'choice',
    options: [
      {
        label: "Seperti ditindih benda berat / diremas (tertindih, berat, menekan)",
        value: 'pressure',
        next: 'chest_pain_location_cardiac'
      },
      {
        label: "Tajam / menusuk, terutama saat tarik napas / batuk",
        value: 'sharp',
        next: 'chest_pain_pleuritic'
      },
      {
        label: "Rasa panas (burning) di ulu hati / dada tengah",
        value: 'burning',
        next: 'chest_pain_gerd'
      }
    ]
  },

  // --- CARDIAC PAIN ---
  {
    id: 'chest_pain_location_cardiac',
    question: "Apakah nyeri menjalar?",
    type: 'choice',
    options: [
      {
        label: "Ke lengan kiri, leher, atau rahang",
        value: 'radiating',
        next: 'chest_pain_trigger'
      },
      {
        label: "Hanya di dada kiri/tengah",
        value: 'localized',
        next: 'chest_pain_trigger'
      },
      { label: "Tidak terasa menjalar", value: 'none', next: 'chest_pain_trigger' }
    ]
  },
  {
    id: 'chest_pain_trigger',
    question: "Kapan nyeri muncul?",
    type: 'choice',
    options: [
      {
        label: "Saat aktivitas fisik (jalan cepat / naik tangga)",
        value: 'exertion',
        next: 'result_angina_stable'
      },
      {
        label: "Saat istirahat / tiba-tiba tanpa aktivitas berarti",
        value: 'rest',
        next: 'result_acs_unstable'
      }
    ]
  },

  // --- PLEURITIC / MUSCLE PAIN ---
  {
    id: 'chest_pain_pleuritic',
    question: "Apa yang paling memperberat nyeri?",
    type: 'choice',
    options: [
      {
        label: "Menarik napas dalam / batuk / bersin",
        value: 'breathing',
        next: 'chest_pain_pleuritic_detail'
      },
      {
        label: "Ditekan atau menggerakkan tubuh / otot",
        value: 'movement',
        next: 'result_muscle_pain'
      }
    ]
  },
  {
    id: 'chest_pain_pleuritic_detail',
    question: "Kondisi yang menyertai nyeri dada tajam saat napas?",
    type: 'choice',
    options: [
      {
        label: "Sesak napas muncul tiba-tiba + riwayat bedrest lama / operasi besar / kehamilan / riwayat DVT",
        value: 'pe_risk',
        next: 'result_pe_suspect'
      },
      {
        label: "Nyeri dada tajam satu sisi + sesak mendadak, sering pada perokok / tubuh tinggi-kurus / setelah batuk/trauma",
        value: 'pneumothorax_risk',
        next: 'result_pneumothorax_suspect'
      },
      {
        label: "Demam + batuk berdahak + nyeri pleuritik",
        value: 'pneumonia',
        next: 'result_pneumonia'
      },
      {
        label: "Tidak ada faktor di atas, nyeri lebih ringan / stabil",
        value: 'simple_pleurisy',
        next: 'result_pleurisy'
      }
    ]
  },

  // --- GERD ---
  {
    id: 'chest_pain_gerd',
    question: "Apakah ada rasa pahit di mulut / asam naik?",
    type: 'choice',
    options: [
      { label: "Ya, asam naik ke kerongkongan / rasa pahit", value: 'yes', next: 'result_gerd' },
      { label: "Tidak", value: 'no', next: 'result_dyspepsia' }
    ]
  },

  // =================================================================================================
  // RESULTS (DIAGNOSES)
  // =================================================================================================

  // --- BATUK RESULTS ---
  {
    id: 'result_ispa',
    type: 'result',
    diagnosis: "Infeksi Saluran Pernapasan Akut (ISPA) / Common Cold",
    recommendation:
      "Sering disebabkan virus. Istirahat cukup, banyak minum, air hangat, dan obat simptomatik. " +
      "Jika demam > 3 hari atau sesak, periksa ke fasilitas kesehatan.",
    severity: 'low',
    confidence: 90
  },
  {
    id: 'result_bronchitis',
    type: 'result',
    diagnosis: "Bronkitis Akut (umumnya viral)",
    recommendation:
      "Batuk berdahak setelah infeksi saluran napas atas, biasanya membaik dalam 2–3 minggu. " +
      "Hindari asap rokok. Gunakan obat batuk ekspektoran bila perlu. " +
      "Jika sesak atau demam tinggi menetap, konsultasi dokter.",
    severity: 'moderate',
    confidence: 85
  },
  {
    id: 'result_bronchitis_bacterial',
    type: 'result',
    diagnosis: "Suspek Bronkitis dengan Infeksi Bakteri",
    recommendation:
      "Dahak purulen (kuning/hijau) dan gejala sistemik dapat mengarah ke infeksi bakteri. " +
      "Evaluasi dokter diperlukan sebelum mempertimbangkan antibiotik.",
    severity: 'moderate',
    confidence: 80
  },
  {
    id: 'result_pneumonia',
    type: 'result',
    diagnosis: "Suspek Pneumonia (Radang Paru)",
    recommendation:
      "Demam, batuk berdahak, sesak, dan bunyi ronkhi mengarah ke pneumonia. " +
      "SEGERA ke dokter/RS untuk rontgen thoraks, pemeriksaan lab, dan penentuan antibiotik.",
    severity: 'high',
    confidence: 88
  },
  {
    id: 'result_tb_suspect',
    type: 'result',
    diagnosis: "Suspek Tuberkulosis (TB) Paru",
    recommendation:
      "Batuk berdarah, penurunan BB, keringat malam, dan riwayat kontak mengarah ke TB. " +
      "SEGERA ke Puskesmas/RS untuk pemeriksaan dahak (mis. TCM) dan rontgen. " +
      "TB menular dan perlu pengobatan teratur minimal 6 bulan.",
    severity: 'high',
    confidence: 92
  },
  {
    id: 'result_post_tb',
    type: 'result',
    diagnosis: "Penyakit Paru Pasca TB (Post-TB Lung Disease)",
    recommendation:
      "Bekas TB dapat menimbulkan kerusakan paru menetap (sesak/batuk kronis walau OAT sudah selesai). " +
      "Perlu evaluasi fungsi paru, rontgen/CT, dan tatalaksana jangka panjang oleh Sp.P.",
    severity: 'high',
    confidence: 85
  },
  {
    id: 'result_hemoptysis_observation',
    type: 'result',
    diagnosis: "Hemoptisis (Batuk Darah) - Perlu Observasi Lanjut",
    recommendation:
      "Batuk darah dapat disebabkan TB, bronkiektasis, keganasan, emboli paru, atau kelainan pembuluh darah. " +
      "SEGERA periksa ke Spesialis Paru / IGD jika darah banyak atau berulang.",
    severity: 'high',
    confidence: 85
  },
  {
    id: 'result_ace_cough',
    type: 'result',
    diagnosis: "Batuk Efek Samping Obat Golongan ACE Inhibitor",
    recommendation:
      "Batuk kering kronis pada pengguna obat darah tinggi golongan ACE (mis. captopril) cukup sering terjadi. " +
      "Konsultasikan ke dokter untuk mempertimbangkan penggantian obat.",
    severity: 'low',
    confidence: 95
  },
  {
    id: 'result_gerd_cough',
    type: 'result',
    diagnosis: "Batuk terkait Refluks Asam Lambung (GERD-related Cough)",
    recommendation:
      "Batuk memburuk saat berbaring/setelah makan dapat terkait refluks asam. " +
      "Perbaiki pola makan, jaga berat badan, dan konsultasikan ke dokter jika keluhan menetap.",
    severity: 'moderate',
    confidence: 80
  },
  {
    id: 'result_allergy_cough',
    type: 'result',
    diagnosis: "Batuk Alergi / Post-Nasal Drip",
    recommendation:
      "Batuk kering dipicu debu/dingin/malam hari dapat terkait alergi atau lendir yang menetes dari hidung. " +
      "Hindari pemicu, pertimbangkan antihistamin sesuai anjuran dokter.",
    severity: 'low',
    confidence: 85
  },
  {
    id: 'result_asthma_cough_variant',
    type: 'result',
    diagnosis: "Suspek Cough-Variant Asthma (CVA)",
    recommendation:
      "Batuk kering dominan dengan mengi dapat merupakan varian asma. " +
      "Perlu spirometri dan uji reversibilitas, serta pertimbangan inhaler bronkodilator/kortikosteroid oleh Sp.P.",
    severity: 'moderate',
    confidence: 80
  },
  {
    id: 'result_sinusitis',
    type: 'result',
    diagnosis: "Suspek Rhinosinusitis Akut",
    recommendation:
      "Hidung tersumbat, nyeri wajah, dan batuk dapat berasal dari sinusitis. " +
      "Irigasi hidung dengan NaCl dapat membantu. Jika nyeri > 10 hari atau berat, konsultasi dokter untuk evaluasi antibiotik.",
    severity: 'moderate',
    confidence: 85
  },
  {
    id: 'result_bronchitis_chronic',
    type: 'result',
    diagnosis: "Bronkitis Kronis (Non-PPOK)",
    recommendation:
      "Batuk berdahak kronis tanpa obstruksi paru bermakna. " +
      "Hindari iritan (asap/debu), lakukan spirometri bila ada sesak untuk menyingkirkan PPOK.",
    severity: 'moderate',
    confidence: 80
  },
  {
    id: 'result_bronchitis_chronic_smoker',
    type: 'result',
    diagnosis: "Bronkitis Kronis pada Perokok (Risiko PPOK)",
    recommendation:
      "Batuk berdahak kronis pada perokok mengarah ke bronkitis kronis dan risiko PPOK. " +
      "Stop merokok, lakukan spirometri, dan konsultasi ke Sp.P.",
    severity: 'high',
    confidence: 85
  },
  {
    id: 'result_lung_ca_suspect',
    type: 'result',
    diagnosis: "Suspek Keganasan Paru (Lung Cancer Risk)",
    recommendation:
      "Batuk kronis kering, penurunan berat badan tanpa sebab, atau hemoptisis terutama pada perokok usia > 40 " +
      "mengarah ke risiko kanker paru. SEGERA ke Spesialis Paru untuk CT-scan thoraks dan evaluasi lebih lanjut.",
    severity: 'critical',
    confidence: 80
  },
  {
    id: 'result_cough_chronic_idiopathic',
    type: 'result',
    diagnosis: "Batuk Kronis Idiopatik",
    recommendation:
      "Jika batuk kronis menetap meski penyebab umum (asma, PPOK, TB, GERD, obat, post-nasal drip) telah dievaluasi " +
      "dan diatasi, dapat dikategorikan sebagai batuk kronis idiopatik/refrakter. Perlu evaluasi komprehensif oleh Sp.P.",
    severity: 'moderate',
    confidence: 70
  },

  // --- SESAK RESULTS ---
  {
    id: 'result_asthma_exacerbation',
    type: 'result',
    diagnosis: "Serangan Asma (Eksaserbasi)",
    recommendation:
      "Mengi, sesak, dan riwayat asma mengarah ke serangan asma. " +
      "Gunakan inhaler pereda (sesuai rencana aksi asma dari dokter). Jika tidak membaik atau memburuk, ke IGD.",
    severity: 'high',
    confidence: 95
  },
  {
    id: 'result_asthma_new',
    type: 'result',
    diagnosis: "Suspek Asma Bronkial Baru",
    recommendation:
      "Sesak episodik, mengi, dan pencetus tertentu mengarah ke asma. " +
      "Perlu konfirmasi spirometri dan penatalaksanaan jangka panjang oleh Sp.P.",
    severity: 'moderate',
    confidence: 85
  },
  {
    id: 'result_copd',
    type: 'result',
    diagnosis: "Suspek PPOK (Penyakit Paru Obstruktif Kronis) Stabil",
    recommendation:
      "Riwayat merokok jangka panjang, usia > 40, dengan batuk berdahak & sesak kronis mengarah ke PPOK. " +
      "Stop merokok, lakukan spirometri, dan gunakan inhaler bronkodilator sesuai anjuran dokter.",
    severity: 'high',
    confidence: 85
  },
  {
    id: 'result_copd_severe',
    type: 'result',
    diagnosis: "Suspek PPOK Derajat Berat",
    recommendation:
      "Kapasitas jalan sangat terbatas dan riwayat sesak berat mengarah ke PPOK berat. " +
      "Perlu pemeriksaan fungsi paru lengkap, terapi inhaler kombinasi, dan rehabilitasi paru.",
    severity: 'high',
    confidence: 90
  },
  {
    id: 'result_copd_exacerbation',
    type: 'result',
    diagnosis: "PPOK Eksaserbasi Akut (Kambuh)",
    recommendation:
      "Perburukan sesak, bertambahnya volume dan purulensi dahak mengarah ke eksaserbasi PPOK. " +
      "Segera ke dokter; mungkin perlu antibiotik, steroid, dan intensifikasi bronkodilator.",
    severity: 'high',
    confidence: 92
  },
  {
    id: 'result_copd_cor_pulmonale',
    type: 'result',
    diagnosis: "Suspek PPOK dengan Cor Pulmonale (Komplikasi Jantung Kanan)",
    recommendation:
      "Tanda gagal jantung kanan (edema, pembesaran vena leher) pada pasien PPOK mengarah ke cor pulmonale. " +
      "Perlu penanganan bersama Sp.P dan Sp.JP.",
    severity: 'critical',
    confidence: 95
  },
  {
    id: 'result_copd_heart_failure',
    type: 'result',
    diagnosis: "Overlap PPOK + Gagal Jantung Kiri",
    recommendation:
      "Gejala PPOK yang berat dengan orthopnea/pink frothy sputum mengarah ke kombinasi PPOK dan gagal jantung kiri. " +
      "Kondisi kompleks, SEGERA ke RS untuk stabilisasi.",
    severity: 'critical',
    confidence: 98
  },
  {
    id: 'result_heart_failure',
    type: 'result',
    diagnosis: "Suspek Gagal Jantung (Heart Failure)",
    recommendation:
      "Sesak yang memburuk saat berbaring, bengkak tungkai, cepat lelah mengarah ke gagal jantung. " +
      "SEGERA ke dokter jantung (Sp.JP) untuk EKG, echocardiography, dan tatalaksana.",
    severity: 'high',
    confidence: 88
  },
  {
    id: 'result_heart_failure_suspect',
    type: 'result',
    diagnosis: "Suspek Gangguan Jantung / Edema Paru Awal",
    recommendation:
      "Keluhan sesak dengan beberapa tanda tidak spesifik bisa mengarah ke gangguan jantung atau paru lain. " +
      "Perlu pemeriksaan fisik langsung dan penunjang.",
    severity: 'moderate',
    confidence: 75
  },
  {
    id: 'result_heart_failure_chronic',
    type: 'result',
    diagnosis: "Gagal Jantung Kronis (CHF)",
    recommendation:
      "Riwayat penyakit jantung dengan sesak kronis dan edema mengarah ke CHF. " +
      "Perlu kontrol rutin ke Sp.JP, minum obat teratur, dan pemantauan berat badan.",
    severity: 'high',
    confidence: 90
  },
  {
    id: 'result_aco_infected',
    type: 'result',
    diagnosis: "Asthma–COPD Overlap (ACO) dengan Infeksi Sekunder",
    recommendation:
      "Riwayat asma dan perokok usia > 40 tahun dengan gejala bronkitis mengarah ke ACO dengan eksaserbasi infeksi. " +
      "Penatalaksanaan biasanya mencakup inhaler kombinasi (ICS + bronkodilator) dan terapi infeksi sesuai dokter.",
    severity: 'high',
    confidence: 92
  },
  {
    id: 'result_aco_severe_infected',
    type: 'result',
    diagnosis: "GAWAT: ACO Eksaserbasi Berat dengan Infeksi",
    recommendation:
      "Riwayat ACO yang berat + pernah ICU + perburukan akut menandakan risiko gagal napas. " +
      "SEGERA ke IGD, kemungkinan perlu oksigen beraliran tinggi/ventilasi dan perawatan intensif.",
    severity: 'critical',
    confidence: 99
  },

  // --- NYERI DADA RESULTS ---
  {
    id: 'result_angina_stable',
    type: 'result',
    diagnosis: "Suspek Angina Pectoris Stabil",
    recommendation:
      "Nyeri dada tipe jantung yang muncul saat aktivitas dan membaik saat istirahat mengarah ke angina stabil. " +
      "Perlu evaluasi Sp.JP, misalnya uji latih (treadmill) dan penatalaksanaan faktor risiko.",
    severity: 'high',
    confidence: 90
  },
  {
    id: 'result_acs_unstable',
    type: 'result',
    diagnosis: "GAWAT DARURAT: Suspek Unstable Angina / Serangan Jantung",
    recommendation:
      "Nyeri dada tipe jantung yang muncul saat istirahat / memburuk cepat adalah tanda bahaya. " +
      "SEGERA ke IGD, risiko henti jantung dan infark miokard.",
    severity: 'critical',
    confidence: 95
  },
  {
    id: 'result_pe_suspect',
    type: 'result',
    diagnosis: "Suspek Emboli Paru (Pulmonary Embolism)",
    recommendation:
      "Nyeri dada tajam saat napas + sesak mendadak + faktor risiko tromboemboli " +
      "(bedrest lama, operasi besar, kehamilan, riwayat DVT) mengarah ke emboli paru. " +
      "SEGERA ke IGD untuk penilaian skor klinis, D-dimer, dan pencitraan (CTPA/V-Q scan).",
    severity: 'critical',
    confidence: 90
  },
  {
    id: 'result_pneumothorax_suspect',
    type: 'result',
    diagnosis: "Suspek Pneumothorax (Paru Kempis)",
    recommendation:
      "Nyeri dada tiba-tiba satu sisi + sesak mendadak, terutama pada perokok tinggi-kurus atau setelah trauma/batuk berat, " +
      "mengarah ke pneumothorax. SEGERA ke IGD untuk foto thoraks dan penanganan (mis. pemasangan drain).",
    severity: 'critical',
    confidence: 90
  },
  {
    id: 'result_pleurisy',
    type: 'result',
    diagnosis: "Suspek Pleuritis (Radang Selaput Paru)",
    recommendation:
      "Nyeri dada tajam yang memburuk saat tarik napas dapat mengarah ke pleuritis. " +
      "Perlu rontgen thoraks dan evaluasi penyebab (infeksi, autoimun, dll.).",
    severity: 'moderate',
    confidence: 80
  },
  {
    id: 'result_muscle_pain',
    type: 'result',
    diagnosis: "Nyeri Otot Dada (Myalgia / Musculoskeletal)",
    recommendation:
      "Nyeri yang memburuk saat ditekan atau digerakkan cenderung berasal dari otot/tulang. " +
      "Biasanya membaik dengan istirahat, posisi ergonomis, dan analgetik ringan sesuai anjuran.",
    severity: 'low',
    confidence: 90
  },
  {
    id: 'result_gerd',
    type: 'result',
    diagnosis: "Gastroesophageal Reflux Disease (GERD)",
    recommendation:
      "Rasa panas di dada dan asam naik setelah makan atau saat berbaring mengarah ke GERD. " +
      "Hindari makan dekat waktu tidur, makanan pedas/berlemak, dan rokok. " +
      "Pertimbangkan konsultasi untuk terapi penekan asam.",
    severity: 'low',
    confidence: 92
  },
  {
    id: 'result_dyspepsia',
    type: 'result',
    diagnosis: "Dispepsia / Gangguan Lambung",
    recommendation:
      "Nyeri/ketidaknyamanan di ulu hati tanpa ciri khas GERD bisa termasuk dispepsia. " +
      "Atur pola makan, kurangi kopi/rokok. Jika nyeri menetap atau ada alarm sign (BB turun, muntah darah), segera ke dokter.",
    severity: 'low',
    confidence: 85
  },

  // --- FALLBACK ---
  {
    id: 'result_cough_unspecified',
    type: 'result',
    diagnosis: "Batuk Non-Spesifik",
    recommendation:
      "Batuk tanpa pola jelas dan tanpa tanda bahaya bisa diobservasi singkat. " +
      "Jika > 3 minggu, disertai demam, sesak, penurunan berat badan, atau batuk darah, segera periksa.",
    severity: 'low',
    confidence: 50
  },
  {
    id: 'result_dyspnea_unspecified',
    type: 'result',
    diagnosis: "Sesak Napas Non-Spesifik",
    recommendation:
      "Sesak tanpa pola jelas dapat berasal dari paru, jantung, anemia, gangguan metabolik, atau faktor lain. " +
      "Perlu pemeriksaan fisik langsung dan penunjang untuk memastikan penyebab.",
    severity: 'moderate',
    confidence: 50
  }
];
