export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    // Nav
    nav_map: 'Map',
    nav_feed: 'Intelligence Feed',
    nav_report: 'Report Issue',
    nav_about: 'About',
    nav_how: 'How It Works',
    nav_tagline: 'Yaad rakhein. Behtar banaayein.',
    nav_report_btn: 'Report',

    // Hero
    hero_title_1: 'Bhopal doesn’t have',
    hero_title_2: 'a complaint problem.',
    hero_title_highlight: 'It has a memory problem.',
    hero_subtitle:
      'Civic Memory connects citizen reports, historical interventions, and external evidence to uncover recurring failures and drive lasting resolution.',
    hero_btn_report: 'Report an Issue',
    hero_btn_feed: 'View Intelligence Feed',

    // Metrics
    metric_rain: 'Rain Sensors',
    metric_monitoring: 'Monitoring',
    metric_active: 'Active Incidents',
    metric_sla: 'SLA Compliance',

    // Feature Cards
    card1_title: 'Evidence First',
    card1_desc: 'Every incident is grounded in photos, sensor data, and external records.',
    card2_title: 'Recurrence Intelligence',
    card2_desc: 'We don’t treat reports in isolation. We detect patterns, not just problems.',
    card3_title: 'Root Cause Focused',
    card3_desc: 'From surface issues to underlying causes — with hypotheses, not assumptions.',
    card4_title: 'Verification Driven',
    card4_desc: 'Resolution isn’t claimed. It’s visually verified and epistemically audited.',
    scroll_explore: 'Scroll to explore',

    // Map section
    map_badge: 'Spatial Intelligence & Ward Reconnaissance',
    map_title: 'Interactive Bhopal Civic Map',
    map_desc:
      'Explore real-time spatial incidents, Ramsar wetland catchment buffers, and municipal ward infrastructure across 85 administrative zones.',
    map_btn_fullscreen: 'Full Screen Map',
    map_btn_pin: 'Pin New Incident',

    // Feed section
    feed_badge: 'Real-Time Incident Records',
    feed_title: 'Bhopal Municipal Incident Feed',
    feed_desc:
      'Every card below represents an epistemically audited incident backed by multi-year recurrence history, CPCB/IMD telemetry, and Claude reasoning.',
    feed_search_placeholder: 'Search by keyword, token, or ward...',
    feed_all_domains: 'All Domains',
    feed_all_severities: 'All Severities',
    feed_no_results_title: 'No incidents match your filter criteria',
    feed_no_results_desc: 'Try adjusting your search terms or clearing the selected category and ward filters.',
    feed_reset: 'Reset all filters',

    // How it works
    how_badge: 'Epistemic Architecture',
    how_title: 'Beyond Complaint Management',
    how_desc:
      'Conventional grievance portals reset after every dispatch. Bhopal Civic Memory accumulates long-term systemic intelligence.',
    how_step1_label: '01 / INTAKE',
    how_step1_title: 'Multimodal Reporting',
    how_step1_desc:
      'Citizens submit Hindi/English text, photos, and precise ward coordinates. No rigid municipal taxonomy required.',
    how_step2_label: '02 / TRIAGE',
    how_step2_title: 'Claude Epistemic Audit',
    how_step2_desc:
      'Claude decomposes claims into 7 epistemic dimensions and bounds reasoning against CPCB, IMD, and NGT baseline registries.',
    how_step3_label: '03 / RECURRENCE',
    how_step3_title: 'Root-Cause Memory',
    how_step3_desc:
      'Semantic matching clusters related reports across monsoon cycles, diagnosing chronic structural bottlenecks over temporary patching.',
    how_step4_label: '04 / VERIFICATION',
    how_step4_title: 'Vision-Audited Resolution',
    how_step4_desc:
      'Resolutions require photographic before/after audits evaluated by Claude Vision to ensure permanent physical restoration.',

    // About section
    about_badge: 'Bhopal Municipal Corporation & Ramsar Site #1206',
    about_title: 'Grounded in Verified Environmental & Civic Baselines',
    about_desc:
      'Bhopal Civic Memory integrates data from the Central Pollution Control Board (CPCB), India Meteorological Department (IMD), National Green Tribunal (NGT Central Zone), and BMC 85-Ward delimitation records to prevent AI hallucinations and enforce deterministic safety gates.',
    about_stat1_label: 'Registry Records',
    about_stat1_val: '15 Verified Baselines',
    about_stat1_sub: '100% Primary Source Grounding',
    about_stat2_label: 'Protected Wet Zone',
    about_stat2_val: 'Bhoj Wetland #1206',
    about_stat2_sub: 'Ramsar Catchment Buffer Oversight',
    about_stat3_label: 'AI Reasoning Engine',
    about_stat3_val: 'Claude Sonnet 4.5',
    about_stat3_sub: 'Live Epistemic Safety Gates'
  },
  hi: {
    // Nav
    nav_map: 'नक्शा',
    nav_feed: 'इंटेलिजेंस फ़ीड',
    nav_report: 'समस्या दर्ज करें',
    nav_about: 'परिचय',
    nav_how: 'कार्यप्रणाली',
    nav_tagline: 'याद रखें। बेहतर बनाएं।',
    nav_report_btn: 'रिपोर्ट दर्ज करें',

    // Hero
    hero_title_1: 'भोपाल में केवल',
    hero_title_2: 'शिकायतों की समस्या नहीं है।',
    hero_title_highlight: 'यहाँ नागरिक स्मृति (मेमोरी) की समस्या है।',
    hero_subtitle:
      'सिविक मेमोरी नागरिक रिपोर्टों, पिछले नगर निगम कार्यों और वैज्ञानिक प्रमाणों को जोड़कर बार-बार होने वाली समस्याओं का मूल कारण खोजती है और स्थायी समाधान देती है।',
    hero_btn_report: 'समस्या दर्ज करें',
    hero_btn_feed: 'इंटेलिजेंस फ़ीड देखें',

    // Metrics
    metric_rain: 'वर्षा सेंसर',
    metric_monitoring: '24/7 निगरानी',
    metric_active: 'सक्रिय मामले',
    metric_sla: 'समयबद्ध समाधान',

    // Feature Cards
    card1_title: 'प्रमाण पहले (Evidence First)',
    card1_desc: 'हर घटना की पुष्टि फ़ोटो, सेंसर डेटा और सीपीसीबी/आईएमडी आधिकारिक रिकॉर्ड से होती है।',
    card2_title: 'पुनरावृत्ति समझ (Recurrence Intelligence)',
    card2_desc: 'हम शिकायतों को अकेला नहीं देखते। हम हर मौसम में बार-बार होने वाले पैटर्न पकड़ते हैं।',
    card3_title: 'मूल कारण पर ध्यान (Root Cause Focused)',
    card3_desc: 'सतही मरम्मत से लेकर गहरे ढांचागत कारणों तक — अनुमान नहीं, वैज्ञानिक परिकल्पना।',
    card4_title: 'सत्यापन-आधारित (Verification Driven)',
    card4_desc: 'समाधान का केवल कागजी दावा नहीं होता। क्लॉड विजन से पहले/बाद की फ़ोटो का ऑडिट होता है।',
    scroll_explore: 'नीचे स्क्रॉल करें',

    // Map section
    map_badge: 'स्थानिक बुद्धिमत्ता एवं वार्ड निगरानी',
    map_title: 'इंटरएक्टिव भोपाल सिविक नक्शा',
    map_desc:
      '85 नगर निगम वार्डों, भोज वेटलैंड रामसर साइट कैचमेंट और वास्तविक घटनाओं की वास्तविक समय में निगरानी करें।',
    map_btn_fullscreen: 'बड़ा नक्शा खोलें',
    map_btn_pin: 'स्थान पर रिपोर्ट करें',

    // Feed section
    feed_badge: 'वास्तविक समय की घटनाएँ',
    feed_title: 'भोपाल म्युनिसिपल इंसिडेंट फ़ीड',
    feed_desc:
      'प्रत्येक मामला कई वर्षों के इतिहास, वैज्ञानिक सेंसर डेटा और क्लॉड AI विश्लेषण से प्रमाणित है।',
    feed_search_placeholder: 'कीवर्ड, टोकन या वार्ड से खोजें...',
    feed_all_domains: 'सभी क्षेत्र',
    feed_all_severities: 'सभी गंभीरता स्तर',
    feed_no_results_title: 'इस फ़िल्टर के अनुसार कोई शिकायत नहीं मिली',
    feed_no_results_desc: 'कृपया खोज शब्द बदलें या वार्ड/श्रेणी फ़िल्टर रीसेट करें।',
    feed_reset: 'सभी फ़िल्टर रीसेट करें',

    // How it works
    how_badge: 'ज्ञानमीमांसा संरचना (Epistemic Architecture)',
    how_title: 'पारंपरिक शिकायत पोर्टल से आगे',
    how_desc:
      'आम पोर्टल हर बार शिकायत बंद करके भूल जाते हैं। भोपाल सिविक मेमोरी वर्षों का नगर निगम ज्ञान संजोती है।',
    how_step1_label: '01 / रिपोर्टिंग',
    how_step1_title: 'मल्टीमॉडल रिपोर्टिंग',
    how_step1_desc:
      'नागरिक हिंदी या अंग्रेजी में विवरण, फ़ोटो और स्थान भेज सकते हैं। कठिन सरकारी फॉर्म की जरूरत नहीं।',
    how_step2_label: '02 / विश्लेषण',
    how_step2_title: 'क्लॉड AI ट्राइएज',
    how_step2_desc:
      'AI रिपोर्ट को 7 आयामों में बांटता है और CPCB, IMD तथा NGT के आधिकारिक रिकॉर्ड से पुष्टि करता है।',
    how_step3_label: '03 / इतिहास',
    how_step3_title: 'मूल-कारण मेमोरी',
    how_step3_desc:
      'विगत वर्षों के मानसून डेटा से मिलान कर सतही लीपापोती के बजाय स्थायी इंजीनियरिंग समस्या पहचानी जाती है।',
    how_step4_label: '04 / सत्यापन',
    how_step4_title: 'फ़ोटो-ऑडिटेड समाधान',
    how_step4_desc:
      'काम पूरा होने पर क्लॉड विजन पहले और बाद की तस्वीरों की तुलना कर वास्तविक समाधान सुनिश्चित करता है।',

    // About section
    about_badge: 'भोपाल नगर निगम एवं भोज वेटलैंड रामसर साइट #1206',
    about_title: 'प्रमाणित पर्यावरणीय और नागरिक डेटा पर आधारित',
    about_desc:
      'केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB), भारतीय मौसम विभाग (IMD), राष्ट्रीय हरित अधिकरण (NGT) और 85 वार्डों के नक्शे से जुड़ा एक विश्वसनीय नागरिक प्लेटफॉर्म।',
    about_stat1_label: 'प्रमाणित रिकॉर्ड',
    about_stat1_val: '15 आधिकारिक रिकॉर्ड',
    about_stat1_sub: '100% प्राथमिक स्रोतों पर आधारित',
    about_stat2_label: 'संरक्षित रामसर क्षेत्र',
    about_stat2_val: 'भोज वेटलैंड #1206',
    about_stat2_sub: 'कैचमेंट बफर की सतत निगरानी',
    about_stat3_label: 'AI रीज़निंग इंजन',
    about_stat3_val: 'क्लॉड सॉनेट 4.5',
    about_stat3_sub: 'सुरक्षा और सत्यता परीक्षण सक्षम'
  }
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS['en'];

