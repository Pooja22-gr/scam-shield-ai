import { ScamInspectionReport } from './dynamicScanner';

export type LanguageCode = 'en' | 'es' | 'hi' | 'fr' | 'zh' | 'de' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', label: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', label: 'Mandarin', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export interface TranslatedReport extends ScamInspectionReport {
  originalLanguage: string;
  translatedLanguage: LanguageOption;
  isAiTranslated: boolean;
  translatedRiskLevel?: string;
}

// Static UI String Dictionary for instant preview and simulation mode
export const UI_DICTIONARY: Record<string, Record<LanguageCode, string>> = {
  scamThreatIndex: {
    en: 'Scam Threat Index',
    hi: 'घोटाला खतरा सूचकांक',
    es: 'Índice de Amenaza de Fraude',
    fr: "Indice de menace d'escroquerie",
    zh: '诈骗威胁指数',
    de: 'Betrugs-Gefahrenindex',
    ar: 'مؤشر خطر الاحتيال',
  },
  executiveVerdict: {
    en: 'Executive Threat Verdict',
    hi: 'कार्यकारी खतरा निर्णय',
    es: 'Veredicto Ejecutivo de Amenaza',
    fr: 'Verdict exécutif de la menace',
    zh: '总体威胁裁定报告',
    de: 'Exekutives Gefahrenurteil',
    ar: 'الحكم التنفيذي لمستوى التهديد',
  },
  contributingFactors: {
    en: 'Contributing Risk Factors (Calculated Weights):',
    hi: 'योगदानकर्ता जोखिम कारक (गणना किए गए भार):',
    es: 'Factores de Riesgo Contribuyentes (Pesos Calculados):',
    fr: 'Facteurs de risque contributifs (Pondérations calculées) :',
    zh: '风险诱发因子（量化权重）：',
    de: 'Beitragende Risikofaktoren (Berechnete Gewichtung):',
    ar: 'عوامل الخطر المساهمة (الأوزان المحسوبة):',
  },
  detectedRedFlags: {
    en: 'Detected Red Flags & Forensic Evidence',
    hi: 'पहचाने गए खतरे और फोरेंसिक साक्ष्य',
    es: 'Señales de Alerta Detectadas y Evidencia Forense',
    fr: "Signaux d'alerte détectés et preuves médico-légales",
    zh: '检测到的风险预警与取证线索',
    de: 'Erkannte Warnsignale & Forensische Beweise',
    ar: 'المؤشرات الحمراء المرصودة والأدلة الجنائية',
  },
  legitimateSafeSignals: {
    en: 'Legitimate Safe Signals',
    hi: 'वैध सुरक्षित संकेत',
    es: 'Señales Legítimas de Seguridad',
    fr: 'Signaux légitimes de sécurité',
    zh: '合法安全合规指标',
    de: 'Legitime Sicherheitssignale',
    ar: 'المؤشرات الإيجابية الآمنة',
  },
  domainInfrastructureProbe: {
    en: 'Domain & Infrastructure Probe',
    hi: 'डोमेन और इन्फ्रास्ट्रक्चर जांच',
    es: 'Sonda de Dominio e Infraestructura',
    fr: 'Sonde du domaine et de l’infrastructure',
    zh: '域名网络与基础设施侦测',
    de: 'Domain- & Infrastruktur-Prüfung',
    ar: 'فحص النطاق والبنية التحتية',
  },
  recommendedNextActions: {
    en: 'Recommended Next Actions',
    hi: 'सुझाए गए अगले सुरक्षा कदम',
    es: 'Acciones Recomendadas a Seguir',
    fr: 'Mesures de sécurité recommandées',
    zh: '建议采纳的防范行动',
    de: 'Empfohlene nächste Maßnahmen',
    ar: 'الخطوات الوقائية الموصى بها',
  },
  inspectTargetPayload: {
    en: 'INSPECT TARGET PAYLOAD',
    hi: 'लक्षित सामग्री का निरीक्षण करें',
    es: 'INSPECCIONAR DOCUMENTO O ENLACE',
    fr: 'INSPECTER LE CONTENU CIBLE',
    zh: '审查目标文本或网址',
    de: 'ZIEL-PAYLOAD ANALYSIEREN',
    ar: 'فحص المحتوى المستهدف',
  },
  scenarioSimulator: {
    en: 'SCENARIO SIMULATOR HUD',
    hi: 'परिदृश्य सिम्युलेटर HUD',
    es: 'SIMULADOR DE ESCENARIOS HUD',
    fr: 'SIMULATEUR DE SCÉNARIOS HUD',
    zh: '场景对抗模拟面板 HUD',
    de: 'SZENARIO-SIMULATOR HUD',
    ar: 'منصة محاكاة السيناريوهات',
  },
  vectorsReady: {
    en: '4 VECTORS READY',
    hi: '4 खतरे के नमूने तैयार',
    es: '4 VECTORES LISTOS',
    fr: '4 VECTEURS PRÊTS',
    zh: '4 种攻击场景就绪',
    de: '4 VEKTOREN BEREIT',
    ar: '4 سيناريوهات جاهزة',
  },
  runInspection: {
    en: 'Run Forensic Threat Inspection',
    hi: 'फोरेंसिक खतरा जांच शुरू करें',
    es: 'Iniciar Inspección Forense de Amenazas',
    fr: "Lancer l'inspection forensique",
    zh: '启动深度威胁取证分析',
    de: 'Forensische Gefahrenanalyse starten',
    ar: 'بدء الفحص الجنائي للتهديدات',
  },
  analyzingPayload: {
    en: 'Analyzing Threat Payload...',
    hi: 'सामग्री का विश्लेषण जारी है...',
    es: 'Analizando contenido...',
    fr: 'Analyse du contenu en cours...',
    zh: '正在深度解析威胁载荷...',
    de: 'Analysiere Bedrohung...',
    ar: 'جاري تحليل المحتوى...',
  },
  generateSafeReply: {
    en: 'Generate Safe Verification Reply',
    hi: 'सुरक्षित सत्यापन उत्तर उत्पन्न करें',
    es: 'Generar Respuesta Segura de Verificación',
    fr: 'Générer une réponse de vérification',
    zh: '生成安全反欺诈核实回复',
    de: 'Sichere Verifizierungsantwort generieren',
    ar: 'إنشاء رد تحقق آمن',
  },
  exportOfficialReport: {
    en: 'Export Official Scam Report',
    hi: 'आधिकारिक घोटाला रिपोर्ट निर्यात करें',
    es: 'Exportar Informe Oficial de Estafa',
    fr: "Exporter le rapport officiel d'escroquerie",
    zh: '导出权威反诈举报报告',
    de: 'Offiziellen Betrugsbericht exportieren',
    ar: 'تصدير تقرير احتيال رسمي',
  },
  exportForensicReport: {
    en: 'Export Forensic Report',
    hi: 'फोरेंसिक रिपोर्ट निर्यात करें',
    es: 'Exportar Informe Forense',
    fr: 'Exporter le rapport forensique',
    zh: '导出取证报告 (PDF/HTML)',
    de: 'Forensischen Bericht exportieren',
    ar: 'تصدير التقرير الجنائي',
  },
  hookVectorFlow: {
    en: '"Hook Vector" Attack Flow',
    hi: 'हुक वेक्टर अटैक फ्लो',
    es: 'Flujo de Ataque del Vector de Enganche',
    fr: "Flux d'attaque du vecteur d'accroche",
    zh: '钓鱼挂钩攻击链路',
    de: 'Angriffskette & Vektordiagramm',
    ar: 'سلسلة هجوم ناقل الخداع',
  },
  extractedEntities: {
    en: 'Extracted Entities & Audit',
    hi: 'निकाली गई संस्थाएं और ऑडिट',
    es: 'Entidades Extraídas y Auditoría',
    fr: 'Entités extraites et audit',
    zh: '提取实体与安全审计',
    de: 'Extrahierte Entitäten & Audit',
    ar: 'الكيانات المستخرجة والتدقيق',
  },
  rawJson: {
    en: '<Raw JSON>',
    hi: '<रॉ JSON>',
    es: '<JSON sin formato>',
    fr: '<JSON brut>',
    zh: '<原始 JSON 数据>',
    de: '<Roh-JSON>',
    ar: '<بيانات JSON الخام>',
  },
  reset: {
    en: 'Reset',
    hi: 'रीसेट करें',
    es: 'Reiniciar',
    fr: 'Réinitialiser',
    zh: '重置',
    de: 'Zurücksetzen',
    ar: 'إعادة ضبط',
  },
  clearText: {
    en: 'Clear Text',
    hi: 'टेक्स्ट हटाएं',
    es: 'Borrar',
    fr: 'Effacer',
    zh: '清空',
    de: 'Löschen',
    ar: 'مسح',
  },
  pasteSample: {
    en: 'Paste Sample',
    hi: 'नमूना पेस्ट करें',
    es: 'Pegar Muestra',
    fr: 'Coller un extrait',
    zh: '粘贴范例',
    de: 'Muster einfügen',
    ar: 'لصق نموذج',
  },
  activeIncidentHud: {
    en: 'Active Threat Containment & Response',
    hi: 'सक्रिय खतरा नियंत्रण और प्रतिक्रिया',
    es: 'Contención y Respuesta Activa ante Amenazas',
    fr: 'Endiguement et réponse active aux menaces',
    zh: '实时威胁遏制与处置系统',
    de: 'Aktive Gefahrenabwehr & Reaktion',
    ar: 'احتواء التهديد والاستجابة النشطة',
  },
  criticalRisk: {
    en: 'Critical Risk',
    hi: 'गंभीर खतरा',
    es: 'Riesgo Crítico',
    fr: 'Risque Critique',
    zh: '极高风险',
    de: 'Kritisches Risiko',
    ar: 'خطر حرج',
  },
  highRisk: {
    en: 'High Risk',
    hi: 'उच्च जोखिम',
    es: 'Riesgo Alto',
    fr: 'Risque Élevé',
    zh: '高风险',
    de: 'Hohes Risiko',
    ar: 'خطر مرتفع',
  },
  moderateRisk: {
    en: 'Moderate Risk',
    hi: 'मध्यम जोखिम',
    es: 'Riesgo Moderado',
    fr: 'Risque Modéré',
    zh: '中度风险',
    de: 'Moderates Risiko',
    ar: 'خطر متوسط',
  },
  lowRisk: {
    en: 'Low Risk',
    hi: 'कम जोखिम (सुरक्षित)',
    es: 'Bajo Riesgo',
    fr: 'Faible Risque',
    zh: '低风险',
    de: 'Geringes Risiko',
    ar: 'خطر منخفض',
  },
  targetHost: {
    en: 'Target Host',
    hi: 'लक्षित होस्ट',
    es: 'Host Objetivo',
    fr: 'Hôte cible',
    zh: '目标域名/主机',
    de: 'Ziel-Host',
    ar: 'المضيف المستهدف',
  },
  domainAge: {
    en: 'Domain Age',
    hi: 'डोमेन आयु',
    es: 'Antigüedad del Dominio',
    fr: 'Âge du domaine',
    zh: '域名注册年限',
    de: 'Domain-Alter',
    ar: 'عمر النطاق',
  },
  assessmentNotes: {
    en: 'Assessment Notes',
    hi: 'मूल्यांकन नोट्स',
    es: 'Notas de Evaluación',
    fr: "Notes d'évaluation",
    zh: '评估分析要点',
    de: 'Bewertungsnotizen',
    ar: 'ملاحظات التقييم',
  },
  aiTranslatedTo: {
    en: 'AI Translated to',
    hi: 'AI द्वारा अनुवादित:',
    es: 'Traducido por IA a',
    fr: 'Traduit par IA en',
    zh: 'AI 实时翻译至',
    de: 'KI-übersetzt auf',
    ar: 'مترجم بالذكاء الاصطناعي إلى',
  },
  vectorsIdentified: {
    en: 'vectors identified',
    hi: 'खतरे के पैटर्न पहचाने गए',
    es: 'vectores identificados',
    fr: 'vecteurs identifiés',
    zh: '个威胁特征已识别',
    de: 'Vektoren identifiziert',
    ar: 'مؤشرات تهديد محددة',
  },
  forensicEvidence: {
    en: 'Verbatim Source Quoted (English)',
    hi: 'मूल अंग्रेजी उद्धरण (यथावत साक्ष्य)',
    es: 'Cita Textual del Origen (Inglés)',
    fr: 'Citation textuelle originale (Anglais)',
    zh: '原文英文引用（原始证据）',
    de: 'Wörtliches Originalzitat (Englisch)',
    ar: 'الاقتباس الأصلي بالإنجليزية (دليل نصي)',
  },
  clickCardTip: {
    en: 'Click card to scroll & glow target snippet above',
    hi: 'ऊपर लक्ष्य अंश को देखने और हाइलाइट करने के लिए कार्ड पर क्लिक करें',
    es: 'Haga clic para desplazarse y resaltar el fragmento arriba',
    fr: 'Cliquez sur la carte pour faire défiler et mettre en évidence le texte',
    zh: '点击卡片可在上方快速定位并高亮证据原文',
    de: 'Klicken Sie auf die Karte, um den Textausschnitt hervorzuheben',
    ar: 'انقر على البطاقة للتمرير وإبراز النص المستهدف أعلاه',
  },
  forensicThreatExplanation: {
    en: 'Forensic Threat Explanation:',
    hi: 'फोरेंसिक खतरा स्पष्टीकरण:',
    es: 'Explicación Forense de Amenaza:',
    fr: 'Explication médico-légale de la menace :',
    zh: '安全威胁取证解析：',
    de: 'Forensische Gefahrenerklärung:',
    ar: 'التفسير الجنائي لمصدر التهديد:',
  },
};

export function getUiString(key: string, lang: LanguageCode): string {
  if (UI_DICTIONARY[key]) {
    return UI_DICTIONARY[key][lang] || UI_DICTIONARY[key]['en'] || key;
  }
  return key;
}

export function translateRiskLevel(riskLevel: string, lang: LanguageCode): string {
  if (lang === 'en') return riskLevel;
  const isCritical = riskLevel.includes('Critical');
  const isHigh = riskLevel.includes('High');
  const isModerate = riskLevel.includes('Moderate');

  if (isCritical) {
    switch (lang) {
      case 'hi':
        return 'गंभीर खतरा (Critical Risk)';
      case 'es':
        return 'Riesgo Crítico';
      case 'fr':
        return 'Risque Critique';
      case 'zh':
        return '极高风险';
      case 'de':
        return 'Kritisches Risiko';
      case 'ar':
        return 'خطر حرج';
      default:
        return riskLevel;
    }
  }
  if (isHigh) {
    switch (lang) {
      case 'hi':
        return 'उच्च जोखिम (High Risk)';
      case 'es':
        return 'Riesgo Alto';
      case 'fr':
        return 'Risque Élevé';
      case 'zh':
        return '高风险';
      case 'de':
        return 'Hohes Risiko';
      case 'ar':
        return 'خطر مرتفع';
      default:
        return riskLevel;
    }
  }
  if (isModerate) {
    switch (lang) {
      case 'hi':
        return 'मध्यम जोखिम (Moderate Risk)';
      case 'es':
        return 'Riesgo Moderado';
      case 'fr':
        return 'Risque Modéré';
      case 'zh':
        return '中度风险';
      case 'de':
        return 'Moderates Risiko';
      case 'ar':
        return 'خطر متوسط';
      default:
        return riskLevel;
    }
  }
  switch (lang) {
    case 'hi':
      return 'सुरक्षित / कम जोखिम (Safe)';
    case 'es':
      return 'Bajo Riesgo (Seguro)';
    case 'fr':
      return 'Faible Risque (Sécurisé)';
    case 'zh':
      return '低风险（安全）';
    case 'de':
      return 'Geringes Risiko (Sicher)';
    case 'ar':
      return 'خطر منخفض (آمن)';
    default:
      return riskLevel;
  }
}

// Comprehensive dictionary for cybersecurity indicators across languages
const INDICATOR_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Fake Check Equipment Scam': {
    en: 'Fake Check Equipment Scam',
    es: 'Fraude de Equipo con Cheque Falso',
    hi: 'अग्रिम शुल्क उपकरण घोटाला (फर्जी चेक)',
    fr: 'Arnaque au faux chèque et matériel',
    zh: '虚假支票设备代购诈骗',
    de: 'Betrug mit gefälschtem Ausrüstungs-Scheck',
    ar: 'احتيال شراء المعدات بشيك وهمي',
  },
  'Advance-Fee Equipment Scam & Fake Check Buyback': {
    en: 'Advance-Fee Equipment Scam & Fake Check Buyback',
    es: 'Fraude de Equipo con Pago por Adelantado y Cheque Falso',
    hi: 'अग्रिम शुल्क उपकरण घोटाला और फर्जी चेक वापसी',
    fr: 'Arnaque au matériel avec frais préalables et faux chèque',
    zh: '预付设备费兼虚假支票回购诈骗',
    de: 'Vorschussbetrug bei Ausrüstung und gefälschter Scheckrückkauf',
    ar: 'احتيال دفع رسوم المعدات مسبقاً وتمرير الشيكات المزيفة',
  },
  'Advance-Fee Equipment & Fake Check Overpayment Trap': {
    en: 'Advance-Fee Equipment & Fake Check Overpayment Trap',
    es: 'Trampa de Equipo con Sobrepago de Cheque Falso',
    hi: 'अग्रिम शुल्क उपकरण और फर्जी चेक ओवरपेमेंट धोखाधड़ी',
    fr: 'Piège de surpaiement par faux chèque et matériel',
    zh: '预付设备与超额支票退款陷阱',
    de: 'Falle mit Vorauszahlungsschecks und Ausrüstungskauf',
    ar: 'فخ دفع رسوم المعدات وشيكات السداد الزائد المزيفة',
  },
  'Sensitive PII & Financial Credentials Harvesting': {
    en: 'Sensitive PII & Financial Credentials Harvesting',
    es: 'Recolección de Datos Personales y Claves Bancarias',
    hi: 'संवेदनशील डेटा और बैंकिंग क्रेडेंशियल चोरी का जाल',
    fr: 'Collecte de données personnelles sensibles et identifiants bancaires',
    zh: '敏感个人身份信息与银行凭证窃取',
    de: 'Erfassung sensibler PII-Daten und Bankdaten',
    ar: 'سرقة البيانات الشخصية الحساسة وبيانات الاعتماد المصرفية',
  },
  'Sensitive PII & Financial Credentials Harvesting Trap': {
    en: 'Sensitive PII & Financial Credentials Harvesting Trap',
    es: 'Trampa de Recolección de Datos Personales (PII) y Claves Bancarias',
    hi: 'संवेदनशील व्यक्तिगत डेटा (PII) और वित्तीय क्रेडेंशियल चोरी का जाल',
    fr: 'Piège de collecte de données personnelles sensibles et identifiants bancaires',
    zh: '敏感个人身份信息与银行凭证窃取陷阱',
    de: 'Falle zur Erfassung sensibler PII-Daten und Bankzugangsdaten',
    ar: 'فخ سرقة البيانات الشخصية الحساسة وبيانات الاعتماد المصرفية',
  },
  'Absentee Landlord Deposit Trap': {
    en: 'Absentee Landlord Deposit Trap',
    es: 'Trampa de Depósito de Arrendador Ausente',
    hi: 'संपत्ति देखे बिना अग्रिम किराया / जमा राशि की मांग',
    fr: 'Piège de caution du propriétaire absent',
    zh: '异地房东未验房预收定金陷阱',
    de: 'Kautionsfalle durch abwesenden Schein-Vermieter',
    ar: 'فخ تأمين المؤجر الغائب دون معاينة',
  },
  'Sight-Unseen Holding Deposit / Wire Demanded': {
    en: 'Sight-Unseen Holding Deposit / Wire Demanded',
    es: 'Exigencia de Depósito o Transferencia sin Visita Presencial',
    hi: 'संपत्ति देखे बिना अग्रिम किराया या वायर ट्रांसफर की मांग',
    fr: 'Exigence de dépôt ou virement sans visite préalable du logement',
    zh: '未实地看房前索要押金或电汇定金',
    de: 'Forderung einer Vorab-Kaution ohne vorherige Wohnungsbesichtigung',
    ar: 'المطالبة بإيداع تأمين أو تحويل مالي دون معاينة العقار شخصياً',
  },
  'Sight-Unseen Rental Deposit Trap': {
    en: 'Sight-Unseen Rental Deposit Trap',
    es: 'Trampa de Depósito de Alquiler sin Visita',
    hi: 'बिना भौतिक सत्यापन के अग्रिम किराया जमा जाल',
    fr: 'Piège de caution locative sans visite préalable',
    zh: '未实地看房的租赁预付定金陷阱',
    de: 'Kautionsfalle ohne Wohnungsbesichtigung',
    ar: 'فخ عربون الإيجار دون معاينة شخصية',
  },
  'Irreversible Payment Vector': {
    en: 'Irreversible Payment Vector',
    es: 'Vector de Pago Irreversible (Zelle/Cripto/Transferencia)',
    hi: 'अपरिवर्तनीय भुगतान चैनल की मांग (Zelle/Wire/Crypto)',
    fr: 'Vecteur de paiement irréversible (Zelle/Virement/Crypto)',
    zh: '不可逆资金转账通道要求（Zelle/电汇/虚拟币）',
    de: 'Irreversibler Zahlungsvektor (Zelle/Überweisung/Krypto)',
    ar: 'وسيلة دفع غير قابلة للاسترداد (Zelle أو عملات رقمية)',
  },
  'Non-Reversible Payment Channel Demand (Zelle/Wire/Crypto)': {
    en: 'Non-Reversible Payment Channel Demand (Zelle/Wire/Crypto)',
    es: 'Exigencia de Canal de Pago Irreversible (Zelle/Transferencia/Cripto)',
    hi: 'अपरिवर्तनीय भुगतान माध्यम की मांग (Zelle/Wire/Crypto)',
    fr: 'Exigence de moyen de paiement irréversible (Zelle/Virement/Crypto)',
    zh: '强制要求使用不可撤销的支付方式（Zelle/电汇/加密货币）',
    de: 'Forderung irreversibler Zahlungskanäle (Zelle/Überweisung/Krypto)',
    ar: 'اشتراط وسيلة دفع غير قابلة للاسترجاع (Zelle أو تحويل بنكي)',
  },
  'Consumer Webmail Domain for Corporate Operations': {
    en: 'Consumer Webmail Domain for Corporate Operations',
    es: 'Dominio de Correo Gratuito para Operaciones Corporativas',
    hi: 'कॉर्पोरेट भर्ती के लिए मुफ्त वेबमेल (Gmail/Yahoo)',
    fr: 'Utilisation de messagerie grand public pour des opérations professionnelles',
    zh: '企业正规招聘使用免费公共个人邮箱',
    de: 'Kostenlose Webmail-Domain für Unternehmensprozesse',
    ar: 'استخدام بريد إلكتروني مجاني في معاملات مؤسسية',
  },
  'Free Consumer Webmail for Corporate Enterprise Recruitment': {
    en: 'Free Consumer Webmail for Corporate Enterprise Recruitment',
    es: 'Uso de Correo Gratuito de Consumo para Selección Corporativa',
    hi: 'कॉर्पोरेट भर्ती के लिए मुफ्त सार्वजनिक वेबमेल का उपयोग',
    fr: 'Utilisation de messagerie grand public gratuite pour le recrutement',
    zh: '企业正规招聘使用免费公共邮箱',
    de: 'Verwendung kostenloser Webmail-Dienste für Unternehmensrekrutierung',
    ar: 'استخدام بريد إلكتروني مجاني في توظيف مؤسسي رسمي',
  },
  'Official Enterprise / Vendor Using Free Public Webmail': {
    en: 'Official Enterprise / Vendor Using Free Public Webmail',
    es: 'Empresa o Proveedor Oficial Usando Correo Gratuito Público',
    hi: 'कॉर्पोरेट भर्ती या वेंडर के लिए मुफ्त सार्वजनिक ईमेल का उपयोग',
    fr: 'Entreprise ou fournisseur officiel utilisant une messagerie gratuite',
    zh: '自称正规企业却使用免费公共个人邮箱',
    de: 'Unternehmen oder Lieferant nutzt kostenlose Freemail',
    ar: 'ادعاء صفة مؤسسة رسمية باستخدام بريد مجاني',
  },
  'Lookalike or High-Risk Phishing Domain': {
    en: 'Lookalike or High-Risk Phishing Domain',
    es: 'Dominio de Suplantación o Phishing de Alto Riesgo',
    hi: 'नकली या उच्च जोखिम वाला फ़िशिंग डोमेन',
    fr: "Nom de domaine d'usurpation ou de phishing à haut risque",
    zh: '高仿钓鱼网站或高风险顶级域名',
    de: 'Lookalike- oder hochriskante Phishing-Domain',
    ar: 'نطاق احتيالي مقلد أو عالي الخطورة',
  },
  'Typosquatted Lookalike Domain Structure': {
    en: 'Typosquatted Lookalike Domain Structure',
    es: 'Estructura de Dominio Falso con Suplantación Tipográfica',
    hi: 'ब्रांड नकल करने वाली संदिग्ध डोमेन संरचना (Typosquatting)',
    fr: "Structure de nom de domaine trompeuse (Typosquattage d'imitation)",
    zh: '仿冒官方品牌的障眼法拼写域名结构',
    de: 'Gefälschte Lookalike-Domain-Struktur (Typosquatting)',
    ar: 'بنية نطاق مزيف منتحل ومشابه للنطاقات الرسمية',
  },
  'Suspicious Lookalike / Typosquatted Domain Structure': {
    en: 'Suspicious Lookalike / Typosquatted Domain Structure',
    es: 'Estructura de Dominio Falso Sospechosa o con Tipografía Engañosa',
    hi: 'संदिग्ध नकली या गलत वर्तनी वाली डोमेन संरचना',
    fr: 'Structure suspecte de nom de domaine trompeur ou imité',
    zh: '可疑的仿冒高仿域名拼写结构',
    de: 'Verdächtige gefälschte Domain-Struktur (Typosquatting)',
    ar: 'بنية نطاق مشبوهة تحاكي العلامات التجارية الرسمية',
  },
  'Off-Platform Chat Migration': {
    en: 'Off-Platform Chat Migration',
    es: 'Migración de Chat Fuera de la Plataforma (Telegram/WhatsApp)',
    hi: 'बिना निगरानी वाले चैट ऐप (Telegram/WhatsApp) पर स्थानांतरण',
    fr: 'Migration des échanges hors plateforme (Telegram/WhatsApp)',
    zh: '脱离正规渠道引流至私人聊天软件（Telegram/WhatsApp）',
    de: 'Verlagerung des Chats auf externe Messenger (Telegram/WhatsApp)',
    ar: 'نقل المحادثات إلى تطبيقات خاصة (تليجرام/واتساب)',
  },
  'Off-Platform Migration to Unmonitored Messenger': {
    en: 'Off-Platform Migration to Unmonitored Messenger',
    es: 'Migración Fuera de la Plataforma a Mensajería No Supervisada',
    hi: 'बिना निगरानी वाले मैसेजिंग ऐप पर स्थानांतरण',
    fr: 'Migration hors plateforme vers une messagerie non surveillée',
    zh: '脱离官方平台迁移至未受监管的聊天软件',
    de: 'Verlagerung auf unüberwachte externe Messaging-Dienste',
    ar: 'الانتقال خارج المنصة الرسمية إلى تطبيقات مراسلة غير خاضعة للرقابة',
  },
  'Off-Platform Recruitment Migration (Telegram/WhatsApp)': {
    en: 'Off-Platform Recruitment Migration (Telegram/WhatsApp)',
    es: 'Migración del Proceso de Selección a Telegram o WhatsApp',
    hi: 'अनियंत्रित मैसेजिंग ऐप (Telegram/WhatsApp) पर भर्ती स्थानांतरण',
    fr: 'Détournement du recrutement vers Telegram ou WhatsApp',
    zh: '招聘沟通脱离正规平台转移至 Telegram 或 WhatsApp',
    de: 'Bewerbungsprozess auf unüberwachte Chat-Apps verlagert',
    ar: 'تحويل إجراءات التوظيف لتطبيقات المراسلة المشفرة',
  },
  'High-Pressure Urgency Trap': {
    en: 'High-Pressure Urgency Trap',
    es: 'Trampa de Urgencia y Alta Presión',
    hi: 'अत्यधिक दबाव और कृत्रिम तात्कालिकता का जाल',
    fr: "Piège d'urgence et de pression temporelle",
    zh: '人为制造极度紧迫感的施压陷阱',
    de: 'Künstliche Dringlichkeits- und Hochdruckfalle',
    ar: 'فخ خلق حالة الاستعजال المصطنعة والضغط النفسي',
  },
  'Artificial High-Pressure Urgency Trap': {
    en: 'Artificial High-Pressure Urgency Trap',
    es: 'Trampa de Urgencia Artificial y Alta Presión Psicológica',
    hi: 'अत्यधिक दबाव और कृत्रिम तात्कालिकता का जाल',
    fr: "Piège d'urgence artificielle et de pression psychologique",
    zh: '人为制造极度紧迫感的施压陷阱',
    de: 'Künstliche Dringlichkeits- und Hochdruckfalle',
    ar: 'فخ خلق حالة الاستعجال المصطنعة والضغط النفسي العالي',
  },
  'Manufactured High-Pressure Urgency Deadline': {
    en: 'Manufactured High-Pressure Urgency Deadline',
    es: 'Plazo Límite de Urgencia Fabricado para Presionar',
    hi: 'कृत्रिम तात्कालिकता और सख्त समय सीमा का दबाव',
    fr: 'Délai d’urgence artificiel conçu pour forcer la décision',
    zh: '人为编造的紧急期限施压套路',
    de: 'Konstruierte Dringlichkeitsfrist zur psychologischen Druckausübung',
    ar: 'مهلة نهائية مصطنعة للضغط النفسي والاستعجال',
  },
  'Generic Salutation': {
    en: 'Generic Salutation',
    es: 'Saludo Genérico e Impersonal',
    hi: 'सामान्य और गैर-व्यक्तिगत अभिवादन',
    fr: 'Salutation impersonnelle et générique',
    zh: '缺乏个人定制的通用称呼',
    de: 'Generische Anrede ohne Namensnennung',
    ar: 'تحية عامة غير مخصصة تخلو من الاسم الشخصي',
  },
  'Impersonal Generic Salutation': {
    en: 'Impersonal Generic Salutation',
    es: 'Saludo Genérico e Impersonal sin Destinatario Específico',
    hi: 'सामान्य और व्यक्तिगत विवरण रहित अभिवादन',
    fr: 'Salutation impersonnelle et générique',
    zh: '缺乏个人定制的通用称呼',
    de: 'Generische, unpersönliche Anrede',
    ar: 'تحية عامة غير مخصصة تخلو من الاسم الشخصي',
  },
  'Impersonal Generic Salutation (Mass Phishing Blast)': {
    en: 'Impersonal Generic Salutation (Mass Phishing Blast)',
    es: 'Saludo Genérico e Impersonal (Envío Masivo de Phishing)',
    hi: 'सामूहिक फ़िशिंग के लिए सामान्य अभिवादन (Dear Applicant)',
    fr: 'Salutation impersonnelle générique (Campagne de phishing massif)',
    zh: '通用群发式称谓（大规模自动化钓鱼邮件特征）',
    de: 'Unpersönliche Massen-Anrede (Massen-Phishing)',
    ar: 'تحية عامة غير موجهة بالاسم (رسائل تصيد عشوائية جماعية)',
  },
  'Unrealistic Compensation Hook': {
    en: 'Unrealistic Compensation Hook',
    es: 'Gancho de Remuneración Excesiva e Irreal',
    hi: 'अवास्तविक अत्यधिक वेतन का प्रलोभन',
    fr: 'Appât de rémunération disproportionnée et irréaliste',
    zh: '与工作要求严重不符的高薪诱饵',
    de: 'Unrealistisch überhöhtes Gehaltsversprechen als Köder',
    ar: 'إغراء برواتب مبالغ فيها بشكل غير واقعي',
  },
  'Disproportionately Inflated Entry-Level Remote Compensation': {
    en: 'Disproportionately Inflated Entry-Level Remote Compensation',
    es: 'Remuneración Remota para Puestos Básicos Desproporcionadamente Inflada',
    hi: 'प्रारंभिक स्तर के कार्य के लिए अत्यधिक अवास्तविक वेतन',
    fr: 'Rémunération pour débutant en télétravail démesurément gonflée',
    zh: '入门级远程基础岗位严重虚高的超额薪资',
    de: 'Unverhältnismäßig überhöhte Vergütung für einfache Einsteiger-Tätigkeiten',
    ar: 'وعود برواتب خيالية لمهام عمل بسيطة عن بُعد',
  },
};

// Explanations translated across languages
const EXPLANATION_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  equipment: {
    en: 'Legitimate employers supply hardware through managed IT logistics and never send checks for candidates to disburse to third parties.',
    es: 'Los empleadores legítimos envían equipos mediante logística corporativa de TI y nunca envían cheques para que el candidato pague a terceros.',
    hi: 'वैध नियोक्ता प्रबंधित आईटी लॉजिस्टिक्स के माध्यम से उपकरण भेजते हैं और कभी भी तीसरे पक्ष को भुगतान करने के लिए चेक नहीं देते।',
    fr: "Les employeurs légitimes fournissent le matériel via leur service informatique et n'envoient jamais de chèques à encaisser pour payer des tiers.",
    zh: '正规雇主均由公司IT部门直接采购配发电脑设备，绝不会要求应聘者先存入支票再向第三方供应商垫付资金。',
    de: 'Seriöse Arbeitgeber stellen Arbeitsgeräte über die interne IT bereit und stellen niemals Schecks aus, um Geld an Dritte weiterzuleiten.',
    ar: 'أصحاب العمل الشرعيون يقدمون أجهزة العمل عبر الدعم الفني للشركة ولا يرسلون أبداً شيكات لتحويل أموالها لجهات خارجية.',
  },
  pii: {
    en: 'Demanding full SSN, passport scans, or banking passwords before a formal job offer or verified contract is typical credential harvesting.',
    es: 'Exigir número de seguridad social, pasaportes o claves bancarias antes de un contrato formal firmado es una táctica clásica de robo de identidad.',
    hi: 'औपचारिक नियुक्ति पत्र से पहले सामाजिक सुरक्षा संख्या (SSN) या बैंक पासवर्ड मांगना पहचान और वित्तीय डेटा चुराने का स्पष्ट संकेत है।',
    fr: "Exiger un numéro de sécurité sociale, passeport ou mot de passe bancaire avant tout contrat formel est une tentative de vol d'identité caractérisée.",
    zh: '在正式签约录用前索取社保卡号、护照扫描件或银行密码，是典型的网络钓鱼凭证窃取行为。',
    de: 'Das Abfragen von Sozialversicherungsnummern, Passkopien oder Bankzugängen vor einem förmlichen Arbeitsvertrag deutet auf Datendiebstahl hin.',
    ar: 'المطالبة بأرقام الهوية أو جواز السفر أو كلمات مرور الحسابات البنكية قبل العقد الرسمي يعد استيلاء صريحاً على البيانات الشخصية.',
  },
  telegram: {
    en: 'Scammers shift communications to unmonitored messaging apps (Telegram, WhatsApp) to evade enterprise corporate audit logs.',
    es: 'Los ciberdelincuentes trasladan las conversaciones a apps de mensajería no supervisadas para eludir los registros de auditoría corporativa.',
    hi: 'धोखेबाज़ कॉर्पोरेट सुरक्षा रिकॉर्ड से बचने के लिए बातचीत को टेलीग्राम या व्हाट्सएप जैसे अनियंत्रित प्लेटफॉर्म पर ले जाते हैं।',
    fr: "Les fraudeurs détournent les échanges vers des messageries chiffrées non surveillées afin d'échapper aux audits des entreprises.",
    zh: '诈骗分子通过将受害者引流至 Telegram 或 WhatsApp 等聊天软件，企图逃避企业正规合规监管与邮件审计。',
    de: 'Betrüger verlagern Gespräche auf unüberwachte Chat-Apps, um internen IT-Sicherheitsprüfungen und Nachweisen zu entgehen.',
    ar: 'يلجأ المحتالون لنقل المحادثات إلى تطبيقات مراسلة خاصة مثل تليجرام أو واتساب لتفادي رقابة أنظمة الأمان المؤسسية.',
  },
  urgency: {
    en: 'High-pressure deadlines are engineered to induce emotional panic and bypass rational security verification before signing or wiring funds.',
    es: 'Los plazos extremos buscan provocar pánico y evitar la verificación racional antes de firmar documentos o transferir fondos.',
    hi: 'अत्यधिक समय सीमा का दबाव पीड़ितों को सोच-समझकर जांच करने से रोकने और जल्दबाजी में पैसे भेजने के लिए बनाया जाता है।',
    fr: "Les délais d'urgence artificielle sont conçus pour susciter la panique et empêcher les vérifications de sécurité avant tout virement.",
    zh: '通过制造极度紧迫的时间倒计时诱发受害者焦虑情绪，阻断其冷静核实真伪与安全风控的过程。',
    de: 'Künstlicher Zeitdruck soll Panik erzeugen, damit Opfer Gelder überweisen, ohne den Sachverhalt vorher sorgfältig zu prüfen.',
    ar: 'تهدف المواعيد النهائية الضاغطة إلى إثارة الذعر ومنع الضحية من التحقق الأمني المستقل قبل تحويل الأموال.',
  },
  rental: {
    en: 'Never transfer funds sight-unseen. Demanding wire transfers before a physical walkthrough is a classic non-existent rental property fraud.',
    es: 'Nunca transfiera fondos sin ver la propiedad. Exigir transferencias antes de una visita física es una estafa clásica de alquileres inexistentes.',
    hi: 'बिना देखे कभी पैसे ट्रांसफर न करें। भौतिक रूप से देखे बिना अग्रिम राशि मांगना गैर-मौजूद मकानों के किराये के घोटाले का प्रमुख लक्षण है।',
    fr: "Ne virez jamais d'argent sans visite. Exiger un acompte avant d'avoir visité le logement est typique des fausses annonces locatives.",
    zh: '切勿在未实地看房前支付任何定金。在实地验房前要求电汇或转账是典型的虚构假房源租赁骗局。',
    de: 'Überweisen Sie niemals Geld ohne Besichtigung. Kautionsforderungen vor einer Vor-Ort-Begehung kennzeichnen betrügerische Scheinangebote.',
    ar: 'إياك وتحويل أي أموال دون معاينة العقار شخصياً. اشتراط دفع مبالغ مسبقة قبل الزيارة هو احتيال عقاري نموذجي.',
  },
  webmail: {
    en: 'Official enterprise organizations hire through verified corporate domains, not generic free public consumer webmail addresses.',
    es: 'Las empresas oficiales contratan a través de dominios corporativos propios y verificados, no mediante correos públicos gratuitos.',
    hi: 'वैध कॉर्पोरेट संगठन अपने आधिकारिक डोमेन से पत्राचार करते हैं, न कि मुफ्त सार्वजनिक जीमेल या याहू खातों से।',
    fr: 'Les entreprises reconnues recrutent via des adresses de leur propre nom de domaine, et non depuis des boîtes gratuites comme Gmail.',
    zh: '正规大型企业均使用经过安全认证的官方公司域名邮箱联系求职者，绝非使用公开免费邮箱。',
    de: 'Offizielle Unternehmen wickeln Bewerbungen über eigene, verifizierte Firmendomains ab, nicht über kostenlose Freemail-Konten.',
    ar: 'تتعامل المؤسسات الرسمية دوماً عبر نطاقات البريد الإلكتروني المعتمدة للشركة وليس عبر حسابات بريد مجانية.',
  },
  lookalike: {
    en: 'Multiple hyphens and spoofing keywords indicate an unverified lookalike domain designed to mimic legitimate brand infrastructure.',
    es: 'Los guiones repetidos y términos engañosos indican un dominio falso creado para imitar la infraestructura de marcas reconocidas.',
    hi: 'असामान्य हाइफ़न और ब्रांड शब्दों का संयोजन यह दर्शाता है कि यह असली कंपनी की नकल करने वाली एक फर्जी वेबसाइट है।',
    fr: "La multiplication de tirets et de mots-clés d'usurpation signale un faux domaine conçu pour copier la marque officielle.",
    zh: '过多的连字符以及拼接的假冒关键词表明该域名是蓄意伪造的高仿钓鱼网站。',
    de: 'Mehrfache Bindestriche und nachgeahmte Markenbegriffe deuten auf eine gefälschte Phishing-Domain hin.',
    ar: 'تشير الفواصل المتعددة والكلمات التمويهية إلى نطاق احتيالي مقلد مصمم لخداع المستخدمين وانتحال صفة العلامة التجارية.',
  },
};

// Recommended actions translated
const ACTION_TRANSLATIONS: Record<LanguageCode, string[]> = {
  en: [
    'Cease all correspondence on unmonitored messaging apps like Telegram, Signal, or WhatsApp.',
    'Do not cash or deposit any advance cashier checks, wire transfers, or third-party vendor drafts.',
    'Verify recruiter identity by calling the official corporate headquarters switchboard directly.',
    'Do not provide SSN, passport photos, or banking verification credentials via unverified links.',
    'Demand an in-person physical property walk-through before transferring any holding deposits.',
  ],
  es: [
    'Interrumpa de inmediato la comunicación en aplicaciones de mensajería no supervisadas como Telegram o WhatsApp.',
    'No cobre ni deposite ningún cheque por adelantado, transferencia ni pago a supuestos proveedores de equipo.',
    'Verifique la identidad del reclutador llamando directamente al conmutador telefónico oficial de la sede corporativa.',
    'No proporcione su número de seguro social, pasaporte ni claves bancarias a través de enlaces no verificados.',
    'Exija una visita física presencial al inmueble antes de transferir cualquier depósito de reserva o fianza.',
  ],
  hi: [
    'टेलीग्राम, सिग्नल या व्हाट्सएप जैसे अनधिकृत मैसेजिंग ऐप्स पर बातचीत तुरंत बंद करें।',
    'नियोक्ता द्वारा भेजे गए किसी भी अग्रिम चेक या वेंडर भुगतान ड्राफ्ट को बैंक में जमा न करें।',
    'आधिकारिक कंपनी मुख्यालय के मुख्य फोन नंबर पर सीधे कॉल करके भर्तीकर्ता की पहचान सत्यापित करें।',
    'किसी भी असत्यापित लिंक या फॉर्म के माध्यम से आधार, पैन, बैंक विवरण या ओटीपी साझा न करें।',
    'किसी भी प्रकार का किराया या अग्रिम जमा राशि भेजने से पहले संपत्ति का व्यक्तिगत रूप से दौरा करने की मांग करें।',
  ],
  fr: [
    'Cessez immédiatement tout échange sur des messageries non supervisées comme Telegram ou WhatsApp.',
    "N'encaissez aucun chèque d'avance et refusez tout transfert d'argent destiné à de prétendus fournisseurs d'équipement.",
    "Vérifiez l'identité du recruteur en contactant directement le standard officiel de l'entreprise.",
    'Ne communiquez jamais votre numéro de sécurité sociale, pièce d’identité ou codes bancaires par formulaire en ligne.',
    'Exigez une visite physique des lieux avant tout versement d’arrhes ou de dépôt de garantie locative.',
  ],
  zh: [
    '立即终止在 Telegram、WhatsApp 等未经企业审计的第三方私人聊天软件上的所有沟通。',
    '切勿将任何所谓雇主寄来的预付支票存入个人银行账户，坚决拒绝向指定设备供应商垫付资金。',
    '通过官方公开的公司总机电话联系人力资源部门，核实该招聘岗位与招聘人员的真实身份。',
    '严禁通过未经安全认证的网页链接或聊天窗口提交身份证号、护照原件扫描件或银行账户密码。',
    '在完成实地房屋查验并签署正规租赁合同之前，坚决不向房东支付任何形式的电汇订金。',
  ],
  de: [
    'Brechen Sie den Kontakt über unüberwachte Chat-Apps wie Telegram oder WhatsApp unverzüglich ab.',
    'Lösen Sie keine Vorauszahlungsschecks ein und überweisen Sie kein Geld an angebliche Hardware-Händler.',
    'Überprüfen Sie die Identität des Ansprechpartners über die offizielle Telefonzentrale des Unternehmens.',
    'Geben Sie keine Sozialversicherungsnummern, Ausweiskopien oder Bankdaten über ungesicherte Formulare preis.',
    'Bestehen Sie auf einer persönlichen Vor-Ort-Besichtigung, bevor Sie Mietkautionen oder Reservierungsgebühren zahlen.',
  ],
  ar: [
    'أوقف جميع المراسلات فوراً على تطبيقات المحادثات غير الخاضعة للرقابة مثل تليجرام أو واتساب.',
    'لا تصرف أو تودع أي شيكات مرسلة مسبقاً وتجنب تحويل أي أموال لموردي معدات خارجيين.',
    'تحقق من هوية مسؤول التوظيف من خلال الاتصال بالبدالة الهاتفية الرسمية للمقر الرئيسي للشركة.',
    'لا تقدم أرقام الهوية أو نسخ جواز السفر أو البيانات المصرفية عبر روابط أو استمارات غير موثوقة.',
    'اشترط المعاينة الميدانية الشخصية للعقار قبل إرسال أي مبالغ حجز أو عربون إيجار.',
  ],
};

// Safe signals translated
const SAFE_SIGNAL_TRANSLATIONS: Record<LanguageCode, string[]> = {
  en: [
    'Legitimate company email domain without typosquatting or lookalike markers.',
    'No upfront advance equipment fee, check buyback, or holding deposit demanded.',
    'Standard professional recruitment and interview coordination procedure.',
  ],
  es: [
    'Dominio de correo electrónico corporativo legítimo sin indicios de suplantación tipográfica.',
    'No se exige pago adelantado por equipos, compra de cheques ni depósito de reserva.',
    'Procedimiento estándar y profesional de coordinación de entrevistas y contratación.',
  ],
  hi: [
    'वैध कॉर्पोरेट ईमेल डोमेन जिसमें कोई संदिग्ध या फर्जी वर्तनी नहीं पाई गई।',
    'कोई अग्रिम उपकरण शुल्क, चेक खरीद या अग्रिम जमा राशि की मांग नहीं की गई है।',
    'मानक पेशेवर भर्ती और साक्षात्कार समन्वय प्रोटोकॉल का पालन किया जा रहा है।',
  ],
  fr: [
    "Nom de domaine officiel vérifié sans altération typographique ni usurpation d'identité.",
    'Aucun frais de matériel préalable ni demande de virement ou caution exigée.',
    "Procédure de recrutement et d'entretien conforme aux standards professionnels.",
  ],
  zh: [
    '采用经过验证的企业正规官方邮箱域名，未发现任何仿冒障眼法字符。',
    '未提出任何购买工作设备的前期垫资要求或虚假支票回购指令。',
    '符合正规企业的人才招聘、面试沟通与背调合规流程。',
  ],
  de: [
    'Verifizierte Firmen-E-Mail-Domain ohne Anzeichen von Typosquatting oder Imitation.',
    'Keine Forderung von Hardware-Vorauszahlungen, Schecks oder voreiligen Kautionen.',
    'Professioneller Bewerbungs- und Vorstellungsgesprächsprozess nach Industriestandards.',
  ],
  ar: [
    'نطاق بريد إلكتروني رسمي معتمد للشركة يخلو من أي تحريف أو محاولات احتيال.',
    'لم يتم طلب أي رسوم معدات مسبقة أو دفع شيكات أو إيداع مبالغ ضمان مشبوهة.',
    'إجراءات توظيف ومقابلات عمل مهنية تتماشى مع المعايير القياسية المتبعة.',
  ],
};

// Executive Summary dynamic translation engine
export function translateSummary(summary: string, lang: LanguageCode, riskLevel: string): string {
  if (lang === 'en') return summary;

  const isCritical = riskLevel === 'Critical Risk' || riskLevel === 'Critical Threat';
  const isHigh = riskLevel === 'High Risk';
  const isModerate = riskLevel === 'Moderate Risk';

  if (isCritical) {
    switch (lang) {
      case 'es':
        return `ALERTA DE AMENAZA CRÍTICA: La inspección forense ha identificado múltiples vectores de fraude deliberados, incluyendo demandas de pago por adelantado, suplantación de identidad o presión psicológica de alta urgencia. Se recomienda encarecidamente no enviar fondos ni información personal.`;
      case 'hi':
        return `गंभीर साइबर खतरा चेतावनी: सुरक्षा जांच में अग्रिम भुगतान की मांग, संवेदनशील डेटा चोरी या अत्यधिक तात्कालिकता के दबाव जैसे कई स्पष्ट धोखाधड़ी संकेत मिले हैं। किसी भी स्थिति में पैसे या दस्तावेज न भेजें।`;
      case 'fr':
        return `ALERTE DE MENACE CRITIQUE : L'analyse de sécurité a mis en évidence de multiples vecteurs d'escroquerie avérée, notamment des exigences de frais préalables et une pression psychologique illégitime. Interrompez immédiatement tout contact.`;
      case 'zh':
        return `极高风险警报：安全审查系统检测到多个确凿的欺诈风险特征，包括预付垫资陷阱、敏感凭证窃取及人为制造紧迫感。请立即停止沟通，严禁转账或提交个人信息。`;
      case 'de':
        return `KRITISCHE GEFAHRENWARNUNG: Die forensische Analyse hat eindeutige Betrugsmuster wie Vorkasse-Forderungen, Datendiebstahl und unzulässigen Zeitdruck identifiziert. Überweisen Sie keinesfalls Geld und geben Sie keine Daten weiter.`;
      case 'ar':
        return `تحذير أمني عالي الخطورة: كشف الفحص الجنائي عن مؤشرات احتيال مؤكدة تشمل طلب أموال مسبقاً وسرقة بيانات وضغطاً نفسياً مصطنعاً. يُحظر بشدة تحويل أي أموال أو إرسال مستندات شخصية.`;
    }
  }

  if (isHigh) {
    switch (lang) {
      case 'es':
        return `ALTO RIESGO DE FRAUDE: Se detectaron discrepancias sustanciales en el dominio o solicitudes financieras atípicas. Proceda con máxima precaución y realice una verificación corporativa independiente antes de continuar.`;
      case 'hi':
        return `उच्च जोखिम चेतावनी: संदेश में संदिग्ध डोमेन संरचना या असामान्य वित्तीय मांगें पाई गई हैं। आगे बढ़ने से पहले कंपनी के आधिकारिक माध्यमों से स्वतंत्र पुष्टि करें।`;
      case 'fr':
        return `RISQUE ÉLEVÉ D'ARNAQUE : Des incohérences notables dans le nom de domaine et des demandes financières suspectes ont été relevées. Une vérification indépendante est indispensable avant toute démarche.`;
      case 'zh':
        return `高风险提示：检测到可疑的域名结构及异常的资金往来要求。在采取任何行动之前，请务必通过企业官方公开渠道进行独立核实。`;
      case 'de':
        return `HOHES BETRUGSRISIKO: Erhebliche Domain-Auffälligkeiten und verdächtige finanzielle Forderungen erkannt. Führen Sie zwingend eine unabhängige Verifizierung durch, bevor Sie fortfahren.`;
      case 'ar':
        return `خطر احتيال مرتفع: تم رصد تناقضات ملحوظة في النطاق وطلبات مالية غير اعتيادية. يُرجى اتخاذ أقصى درجات الحذر والتحقق من القنوات الرسمية قبل اتخاذ أي خطوة.`;
    }
  }

  if (isModerate) {
    switch (lang) {
      case 'es':
        return `RIESGO MODERADO (PRECAUCIÓN): Se identificaron anomalías menores o falta de verificación de la identidad del remitente. Se aconseja solicitar credenciales corporativas oficiales antes de compartir datos confidenciales.`;
      case 'hi':
        return `मध्यम जोखिम (सावधानी): कुछ अस्पष्टताएं या प्रेषक की पहचान संबंधी कमियां पाई गई हैं। संवेदनशील जानकारी साझा करने से पहले आधिकारिक सत्यापन मांगें।`;
      case 'fr':
        return `RISQUE MODÉRÉ (ATTENTION) : Des signaux ambigus ou une absence de vérification de l'émetteur nécessitent une vigilance accrue avant toute transmission d'informations.`;
      case 'zh':
        return `中度风险（审慎操作）：发现少量可疑特征或发件人官方凭证缺失。在提交任何私密材料前，请要求对方提供正规企业凭证。`;
      case 'de':
        return `MODERATES RISIKO (VORSICHT): Es wurden kleinere Auffälligkeiten oder unklare Absenderangaben festgestellt. Fordern Sie offizielle Nachweise an, bevor Sie sensible Daten preisgeben.`;
      case 'ar':
        return `خطر متوسط (تنبيه احترازي): توجد بعض الشكوك حول هوية المرسل أو متطلبات غير واضحة. يُنصح بطلب إثباتات رسمية قبل مشاركة أي بيانات.`;
    }
  }

  // Safe / Low Risk
  switch (lang) {
    case 'es':
      return `RIESGO BAJO (SEGURO): El documento o enlace evaluado no presenta indicadores maliciosos conocidos ni vectores de pago por adelantado. La comunicación se ajusta a los estándares legítimos.`;
    case 'hi':
      return `कम जोखिम (सुरक्षित): प्रस्तुत दस्तावेज या लिंक में कोई ज्ञात दुर्भावनापूर्ण संकेत या अग्रिम शुल्क की मांग नहीं मिली है। यह सामान्य पेशेवर मानकों के अनुरूप प्रतीत होता है।`;
    case 'fr':
      return `FAIBLE RISQUE (SÉCURISÉ) : Aucun indicateur suspect ni demande de paiement préalable n'a été détecté. La communication correspond aux normes professionnelles habituelles.`;
    case 'zh':
      return `低风险（安全）：经安全系统全面核验，未发现已知的恶意欺诈特征或预付定金要求，整体符合正规企业沟通标准。`;
    case 'de':
      return `GERINGES RISIKO (SICHER): Das geprüfte Dokument weist keine bekannten Betrugsmuster oder Vorauszahlungsforderungen auf und entspricht legitimen Standards.`;
    case 'ar':
      return `خطر منخفض (آمن): لم يُظهر التحليل أي مؤشرات احتيال أو طلبات دفع مشبوهة، وتبدو المراسلات متطابقة مع الإجراءات الرسمية المعتادة.`;
    default:
      return summary;
  }
}

// Translate full inspection report while preserving exact English evidence string
export function translateInspectionReport(
  report: ScamInspectionReport,
  targetLang: LanguageCode
): TranslatedReport {
  const langConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  if (targetLang === 'en') {
    return {
      ...report,
      originalLanguage: 'English',
      translatedLanguage: langConfig,
      isAiTranslated: false,
    };
  }

  // Translate summary
  const translatedSummary = translateSummary(report.summary, targetLang, report.riskLevel);

  // Translate red flags - KEEPING EXACT ORIGINAL ENGLISH EVIDENCE
  const translatedRedFlags = report.detectedRedFlags.map((flag) => {
    // 1. Translated indicator title
    let translatedIndicator = flag.indicator;
    for (const [key, mapping] of Object.entries(INDICATOR_TRANSLATIONS)) {
      if (
        flag.indicator.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(flag.indicator.toLowerCase())
      ) {
        translatedIndicator = mapping[targetLang] || flag.indicator;
        break;
      }
    }

    // 2. Translated explanation
    let translatedExplanation = flag.explanation;
    const lowerFlag = `${flag.indicator} ${flag.explanation}`.toLowerCase();

    if (lowerFlag.includes('equipment') || lowerFlag.includes('check')) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.equipment[targetLang];
    } else if (
      lowerFlag.includes('pii') ||
      lowerFlag.includes('ssn') ||
      lowerFlag.includes('credential')
    ) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.pii[targetLang];
    } else if (
      lowerFlag.includes('telegram') ||
      lowerFlag.includes('whatsapp') ||
      lowerFlag.includes('unmonitored')
    ) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.telegram[targetLang];
    } else if (lowerFlag.includes('urgency') || lowerFlag.includes('deadline')) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.urgency[targetLang];
    } else if (
      lowerFlag.includes('rental') ||
      lowerFlag.includes('lease') ||
      lowerFlag.includes('deposit')
    ) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.rental[targetLang];
    } else if (lowerFlag.includes('webmail') || lowerFlag.includes('gmail')) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.webmail[targetLang];
    } else if (lowerFlag.includes('lookalike') || lowerFlag.includes('domain')) {
      translatedExplanation = EXPLANATION_TRANSLATIONS.lookalike[targetLang];
    }

    return {
      ...flag,
      indicator: translatedIndicator,
      explanation: translatedExplanation,
      // CRITICAL REQUIREMENT: Retain exact original English quote in the "Evidence" snippet
      evidence: flag.evidence,
    };
  });

  // Translate recommended actions
  const translatedActions =
    ACTION_TRANSLATIONS[targetLang] || report.recommendedActions;

  // Translate safe signals
  const translatedSafeSignals =
    report.safeSignals.length > 0 && SAFE_SIGNAL_TRANSLATIONS[targetLang]
      ? SAFE_SIGNAL_TRANSLATIONS[targetLang]
      : report.safeSignals;

  // Translate score factor titles
  const translatedScoreFactors = report.scoreFactors.map((factor) => {
    let factorName = factor.factor;
    for (const [key, mapping] of Object.entries(INDICATOR_TRANSLATIONS)) {
      if (
        factor.factor.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(factor.factor.toLowerCase())
      ) {
        factorName = mapping[targetLang] || factor.factor;
        break;
      }
    }
    return {
      ...factor,
      factor: factorName,
    };
  });

  const translatedDomainNotes = report.domainAnalysis?.notes
    ? targetLang === 'hi'
      ? report.domainAnalysis.notes.toLowerCase().includes('free consumer') ||
        report.domainAnalysis.notes.toLowerCase().includes('webmail')
        ? 'निजी मुफ्त ईमेल सेवा का उपयोग आधिकारिक कॉर्पोरेट सत्यापन में विफल रहता है।'
        : report.domainAnalysis.notes.toLowerCase().includes('no suspicious') ||
          report.domainAnalysis.notes.toLowerCase().includes('legitimate')
        ? 'डोमेन संरचना में कोई संदिग्ध संकेत नहीं मिला। कॉर्पोरेट मानकों के अनुकूल।'
        : 'संदिग्ध डोमेन विशेषताओं या संभावित फ़िशिंग पैटर्न का पता चला।'
      : report.domainAnalysis.notes
    : '';

  const translatedDomainAge = report.domainAnalysis?.domainAge
    ? targetLang === 'hi' && report.domainAnalysis.domainAge.toLowerCase().includes('unavailable')
      ? 'डोमेन आयु अनुपलब्ध (लाइव WHOIS जांच आवश्यक है)'
      : report.domainAnalysis.domainAge
    : '';

  return {
    ...report,
    summary: translatedSummary,
    translatedRiskLevel: translateRiskLevel(report.riskLevel, targetLang),
    detectedRedFlags: translatedRedFlags,
    recommendedActions: translatedActions,
    safeSignals: translatedSafeSignals,
    scoreFactors: translatedScoreFactors,
    domainAnalysis: {
      ...report.domainAnalysis,
      domainAge: translatedDomainAge || report.domainAnalysis.domainAge,
      notes: translatedDomainNotes || report.domainAnalysis.notes,
    },
    originalLanguage: 'English',
    translatedLanguage: langConfig,
    isAiTranslated: true,
  };
}

// Multilingual Safe Verification Reply Builder
export function buildLocalizedProbeResponse(
  strategy: 'equipment' | 'rental' | 'pii' | 'corporate',
  recipient: string,
  lang: LanguageCode,
  domain?: string | null
): string {
  switch (lang) {
    case 'es':
      if (strategy === 'equipment') {
        return `Estimado/a ${recipient}:

Gracias por proporcionarme los detalles del puesto y la oferta de empleo.

Siguiendo las normas de seguridad financiera personal y los protocolos estándar de teletrabajo, no acepto, deposito ni transfiero fondos derivados de cheques por adelantado a proveedores externos de equipo informático.

Para continuar con el proceso de incorporación de manera segura:
1. Le ruego me confirme si el equipo informático necesario será configurado y enviado directamente por su Departamento de TI corporativo a mi dirección física.
2. Sírvase facilitar el nombre legal de la entidad, su NIF/CIF o Número de Identificación Patronal (EIN) y la dirección postal de su sede central.
3. Le solicito que todas las comunicaciones oficiales se efectúen exclusivamente mediante un dominio de correo corporativo verificado.

Una vez validados estos datos mediante su portal corporativo oficial, estaré encantado/a de formalizar la documentación de ingreso.

Atentamente,
[Su Nombre]
[Información de Contacto]`;
      }
      if (strategy === 'rental') {
        return `Estimado/a ${recipient}:

Gracias por la información relativa al inmueble en alquiler.

Antes de realizar cualquier transferencia de fondos, señal o depósito de fianza vía Zelle o transferencia bancaria, solicito la verificación estándar:
1. Una visita física presencial a la vivienda en compañía suya o de un agente inmobiliario colegiado.
2. Documento acreditativo de titularidad catastral o contrato de gestión inmobiliaria debidamente autorizado.
3. Redacción y firma presencial del contrato de arrendamiento oficial o mediante servicio notarial de custodia fehaciente.

Por favor, indíqueme qué día y franja horaria le resultan convenientes para coordinar la visita presencial.

Atentamente,
[Su Nombre]
[Número de Teléfono]`;
      }
      if (strategy === 'pii') {
        return `Estimado/a ${recipient}:

Agradezco su contacto en relación con esta oportunidad profesional.

Con el fin de salvaguardar mis datos personales y financieros frente a riesgos de divulgación no autorizada, no proporciono números de identificación fiscal, pasaportes ni credenciales bancarias mediante correo electrónico o aplicaciones de mensajería.

Con mucho gusto remitiré toda la documentación reglamentaria exclusivamente a través de:
1. Un portal oficial y cifrado de recursos humanos (Workday, ADP, BambooHR) alojado bajo el dominio web de su compañía.
2. Tras la entrega formal de la carta de oferta vinculante refrendada por los representantes legales de la empresa.

Le agradeceré que me facilite su dirección de correo institucional y el número telefónico de la centralita de recursos humanos.

Atentamente,
[Su Nombre]`;
      }
      return `Estimado/a ${recipient}:

Gracias por su mensaje en relación con esta vacante.

Tengo gran interés en la oportunidad. No obstante, antes de dar el siguiente paso, le solicito que me facilite los siguientes datos de acreditación corporativa:
1. Razón social registrada y número de identificación fiscal (NIF/EIN).
2. Dirección física de la sede corporativa y teléfono directo de la centralita general.
3. Dirección de correo electrónico oficial asociada al dominio institucional de la empresa.
4. Confirmación del enlace de la oferta en el portal de empleo oficial de la compañía.

Por razones de ciberseguridad, no mantengo entrevistas de selección a través de mensajería privada (Telegram, WhatsApp).

Quedo a la espera de su respuesta.

Atentamente,
[Su Nombre]`;

    case 'hi':
      if (strategy === 'equipment') {
        return `आदरणीय ${recipient},

रोजगार संबंधी विवरण और प्रस्ताव पत्र साझा करने के लिए धन्यवाद।

मेरी व्यक्तिगत वित्तीय सुरक्षा नीतियों और कॉर्पोरेट ऑनबोर्डिंग मानकों के अनुसार, मैं उपकरण खरीद के लिए अग्रिम चेक स्वीकार या किसी तीसरे पक्ष को राशि ट्रांसफर नहीं करता/करती।

प्रक्रिया को सुरक्षित रूप से आगे बढ़ाने के लिए:
1. कृपया पुष्टि करें कि सभी आवश्यक हार्डवेयर (लैपटॉप व सहायक उपकरण) आपकी कंपनी के आईटी विभाग द्वारा सीधे मेरे पते पर भेजे जाएंगे।
2. कृपया कंपनी का पंजीकृत कानूनी नाम, कॉर्पोरेट पहचान संख्या (CIN/EIN) और मुख्यालय का वास्तविक पता साझा करें।
3. कृपया पुष्टि करें कि भविष्य के सभी आधिकारिक पत्राचार कंपनी के सत्यापित कॉर्पोरेट डोमेन ईमेल के माध्यम से ही होंगे।

सत्यापन के पश्चात मैं औपचारिकताएं पूर्ण करने के लिए सहर्ष तैयार रहूँगा/रहूंगी।

सधन्यवाद,
[आपका नाम]
[आपका संपर्क विवरण]`;
      }
      if (strategy === 'rental') {
        return `आदरणीय ${recipient},

किराये की संपत्ति के संबंध में जानकारी देने के लिए धन्यवाद।

किसी भी प्रकार की अग्रिम जमानत राशि, टोकन मनी या ऑनलाइन बैंक ट्रांसफर करने से पहले मैं निम्नलिखित अनिवार्य सत्यापन का अनुरोध करता/करती हूँ:
1. संपत्ति का व्यक्तिगत रूप से निरीक्षण (फिजिकल वॉक-थ्रू) आपके या अधिकृत एजेंट के साथ।
2. स्वामित्व प्रमाण या अधिकृत संपत्ति प्रबंधन अनुबंध की प्रतिलिपि।
3. भौतिक रूप से हस्ताक्षरित औपचारिक रेंटल एग्रीमेंट।

कृपया बताएं कि इस सप्ताह किस समय संपत्ति देखने के लिए उपयुक्त रहेगा।

सधन्यवाद,
[आपका नाम]
[आपका फोन नंबर]`;
      }
      if (strategy === 'pii') {
        return `आदरणीय ${recipient},

इस अवसर के लिए संपर्क करने हेतु धन्यवाद।

पहचान सुरक्षा और वित्तीय गोपनीयता बनाए रखने के लिए, मैं चैट ऐप या असत्यापित ईमेल के माध्यम से आधार, पैन कार्ड, बैंक पासवर्ड या ओटीपी साझा नहीं करता/करती।

मैं आवश्यक वैधानिक दस्तावेज केवल निम्नलिखित माध्यम से ही उपलब्ध कराऊँगा/कराऊँगी:
1. कंपनी के अधिकृत एवं सुरक्षित एचआर पोर्टल (जैसे Workday, ADP) पर।
2. औपचारिक एवं हस्ताक्षरित नियुक्ति पत्र प्राप्त होने के पश्चात।

कृपया अपना आधिकारिक कॉर्पोरेट ईमेल और एचआर विभाग का संपर्क नंबर साझा करें।

सधन्यवाद,
[आपका नाम]`;
      }
      return `आदरणीय ${recipient},

इस पद के संदर्भ में पत्राचार के लिए धन्यवाद।

प्रक्रिया में आगे बढ़ने से पहले, कृपया कंपनी की प्रमाणिकता हेतु निम्नलिखित विवरण उपलब्ध कराएं:
1. पंजीकृत कॉर्पोरेट नाम और व्यवसाय पहचान संख्या (CIN / EIN)।
2. मुख्यालय का पता और आधिकारिक टेलीफोन नंबर।
3. आपका आधिकारिक कंपनी डोमेन ईमेल पता और लिंक्डइन प्रोफाइल।

सुरक्षा कारणों से मैं टेलीग्राम या व्हाट्सएप पर भर्ती प्रक्रिया में भाग नहीं लेता/लेती।

आपके उत्तर की प्रतीक्षा में।

सधन्यवाद,
[आपका नाम]`;

    case 'fr':
      if (strategy === 'equipment') {
        return `Bonjour ${recipient},

Je vous remercie pour les informations relatives à cette offre d'emploi.

Conformément à mes exigences de sécurité financière et aux pratiques standard d'intégration, je n'accepte ni n'encaisse de chèques d'avance pour payer des tiers.

Pour poursuivre en toute sécurité :
1. Veuillez confirmer que l'ensemble du matériel sera configuré et expédié directement par votre service informatique interne.
2. Merci de me communiquer la dénomination sociale de l'entreprise, le numéro SIRET/EIN et l'adresse du siège.
3. Veuillez confirmer que toute correspondance se fera via un nom de domaine d'entreprise vérifié.

Dès validation de ces éléments, je complèterai les formalités avec plaisir.

Cordialement,
[Votre Nom]`;
      }
      if (strategy === 'rental') {
        return `Bonjour ${recipient},

Merci pour les précisions concernant le logement en location.

Avant tout versement d'acompte ou de garantie locative par virement, j'exige :
1. Une visite physique des lieux en votre présence ou celle d'un gestionnaire agréé.
2. La justification du titre de propriété ou du mandat de gestion officiel.
3. La signature d'un bail de location en bonne et due forme.

Merci de m'indiquer vos disponibilités pour une visite cette semaine.

Cordialement,
[Votre Nom]`;
      }
      if (strategy === 'pii') {
        return `Bonjour ${recipient},

Merci de me contacter au sujet de ce poste.

Afin de protéger mes données personnelles et bancaires, je ne transmets aucune pièce d'identité ni coordonnée bancaire par messagerie instantanée ou courriel non sécurisé.

Je transmettrai l'ensemble des justificatifs via :
1. Un portail RH officiel et chiffré de votre entreprise (Workday, ADP, etc.).
2. Après réception de la lettre d'engagement formelle contresignée par la direction.

Merci de m'indiquer votre adresse électronique institutionnelle.

Cordialement,
[Votre Nom]`;
      }
      return `Bonjour ${recipient},

Merci pour votre message au sujet de cette opportunité.

Avant de poursuivre le processus, merci de me transmettre les éléments de vérification suivants :
1. Raison sociale et numéro SIREN / EIN de l'entreprise.
2. Adresse physique du siège et numéro direct du standard.
3. Votre adresse de courriel sur le nom de domaine de la société.

Pour des raisons de cybersécurité, je ne poursuis pas d'entretiens via des applications comme Telegram ou WhatsApp.

Dans l'attente de votre retour,
Cordialement,
[Votre Nom]`;

    case 'zh':
      if (strategy === 'equipment') {
        return `尊敬的 ${recipient}：

感谢您发送工作录用及入职详情。

依据个人财务信息安全规范及远程办公标准流程，本人坚决不接受任何以支票垫付方式向第三方供应商转账采购设备的要求。

为确保入职流程正规推进，请您协助确认以下事项：
1. 请确认办公所需全部电脑硬件及外设将由贵司内部IT部门直接统一配置并免费邮寄至我的通信地址。
2. 请提供贵司的工商注册法定全称、统一社会信用代码/雇主税号（EIN）及公司实际总部地址。
3. 请确认后续所有官方正式信函均通过贵司认证的企业域名官方邮箱发送。

待上述信息在贵司官方招聘系统核实无误后，我将配合完成标准入职登记。

顺祝商祺，
[您的姓名]
[您的联系电话]`;
      }
      if (strategy === 'rental') {
        return `尊敬的 ${recipient}：

感谢您提供该套房源的租赁详情。

在未实地验房前，为保障资金安全，本人暂不接受任何形式的微信转账、支付宝定金或银行电汇。请配合完成以下必要核验：
1. 与您本人或持证正规中介在房源现场进行实地看房。
2. 核对房屋产权证明原件（房产证及业主身份证件）或委托授权书。
3. 双方在现场当面签署正规纸质或带法律效力的电子租赁合同。

请告知本周方便进行现场验房的具体时间。

此致，
[您的姓名]
[您的联系电话]`;
      }
      if (strategy === 'pii') {
        return `尊敬的 ${recipient}：

感谢您关于此职位的沟通与邀请。

为防范个人敏感身份及财务凭证被非法盗用，在未收到盖章正式录用通知前，本人不通过私人邮件或社交聊天工具提供身份证件扫描件、护照或银行卡敏感信息。

本人仅同意通过以下安全合规渠道提交法定入职材料：
1. 贵司官方域名下的加密人力资源管理门户（如 Workday、北森等）。
2. 在正式签署具有法律效力的录用协议后。

请提供您在贵司的企业邮箱及人力资源部总机以便核实。

顺祝商祺，
[您的姓名]`;
      }
      return `尊敬的 ${recipient}：

感谢您发来的招聘信息。

在进入下一阶段评估前，为核实招聘渠道真实性，请协助提供以下企业认证信息：
1. 贵司工商注册法定名称及企业代码。
2. 实体总部办公地址及公司前台总机电话。
3. 您的企业官方域名邮箱及企业官方职位主页链接。

出于信息安全考虑，本人不通过 Telegram 或 WhatsApp 等非企业审计的私人软件进行正式面试沟通。

期待您的正式回复。

顺祝商祺，
[您的姓名]`;

    case 'de':
      if (strategy === 'equipment') {
        return `Sehr geehrte(r) ${recipient},

vielen Dank für die Zusendung der Arbeitsvertrags- und Onboarding-Informationen.

Aus Gründen der persönlichen IT- und Finanzsicherheit löse ich keine Vorab-Schecks ein, um Überweisungen an Drittanbieter zu tätigen.

Um den Onboarding-Prozess sicher fortzusetzen:
1. Bestätigen Sie bitte, dass benötigte Hardware direkt von Ihrer internen IT-Abteilung bereitgestellt und versendet wird.
2. Nennen Sie mir bitte den eingetragenen Firmennamen, die Handelsregisternummer bzw. Steuernummer und den Hauptsitz.
3. Bitte stellen Sie sicher, dass die Kommunikation ausschließlich über eine verifizierte Firmen-E-Mail-Domain erfolgt.

Nach offizieller Verifizierung sende ich die Unterlagen gerne zurück.

Mit freundlichen Grüßen,
[Ihr Name]`;
      }
      if (strategy === 'rental') {
        return `Sehr geehrte(r) ${recipient},

vielen Dank für die Auskunft bezüglich der Mietwohnung.

Vor der Überweisung von Kautionen oder Reservierungsgebühren bestehe ich auf folgenden Schritten:
1. Eine persönliche Vor-Ort-Besichtigung mit Ihnen oder der lizenzierten Hausverwaltung.
2. Nachweis des Eigentums oder einer entsprechenden Verwaltungsvollmacht.
3. Ein formaler, rechtsgültiger Mietvertrag vor Übergabe jeglicher Zahlungen.

Teilen Sie mir bitte mit, wann eine Begehung vor Ort möglich ist.

Mit freundlichen Grüßen,
[Ihr Name]`;
      }
      if (strategy === 'pii') {
        return `Sehr geehrte(r) ${recipient},

vielen Dank für Ihre Kontaktaufnahme.

Zum Schutz persönlicher und finanzieller Daten übermittle ich keine Ausweisdokumente oder Bankzugänge über unverschlüsselte E-Mails oder Chat-Kanäle.

Ich stelle diese Daten ausschließlich bereit über:
1. Ein gesichertes, verschlüsseltes HR-Portal Ihres Unternehmens.
2. Nach Erhalt eines unterzeichneten, offiziellen Arbeitsvertrags.

Bitte nennen Sie mir Ihre offizielle geschäftliche E-Mail-Adresse.

Mit freundlichen Grüßen,
[Ihr Name]`;
      }
      return `Sehr geehrte(r) ${recipient},

vielen Dank für Ihre Nachricht bezüglich dieser Position.

Bevor wir die nächsten Schritte einleiten, bitte ich um folgende Unternehmensangaben:
1. Offizieller Firmenname und Handelsregisternummer.
2. Anschrift des Hauptsitzes und offizielle Festnetznummer der Telefonzentrale.
3. Ihre geschäftliche E-Mail-Adresse auf der offiziellen Unternehmensdomain.

Über private Messaging-Dienste wie Telegram führe ich keine Einstellungsgespräche.

Mit freundlichen Grüßen,
[Ihr Name]`;

    case 'ar':
      if (strategy === 'equipment') {
        return `عزيزي ${recipient}،

شكراً لمشاركتكم تفاصيل عرض العمل وإجراءات التعيين.

وفقاً لمعايير الأمان المالي الشخصي وسياسات العمل عن بُعد، أعتذر عن عدم قبول أو صرف أي شيكات مسبقة بهدف تحويل مبالغ لموردي معدات خارجيين.

لمتابعة الإجراءات بأمان:
1. يُرجى تأكيد شحن جميع أجهزة العمل المطلوبة مباشرة عبر قسم تكنولوجيا المعلومات في شركتكم إلى عنواني.
2. تزويدي بالاسم القانوني المسجل للمنشأة، ورقم السجل التجاري أو الضريبي، وعنوان المقر الرئيسي.
3. تأكيد أن جميع المراسلات ستتم حصراً عبر نطاق البريد الإلكتروني الرسمي المعتمد للشركة.

بمجرد التحقق من هذه البيانات عبر بوابتكم الرسمية، يسعدني استكمال وثائق التعيين.

مع خالص التحية،
[اسمك]
[معلومات الاتصال]`;
      }
      if (strategy === 'rental') {
        return `عزيزي ${recipient}،

شكراً للتفاصيل المتعلقة بالعقار المعروض للإيجار.

قبل تحويل أي عربون أو دفع تأمين إيجاري، أشترط الآتي:
1. معاينة ميدانية شخصية للعقار برفقتكم أو برفقة وسيط عقاري معتمد.
2. تقديم ما يثبت ملكية العقار أو عقد تفويض إدارة الأملاك.
3. توقيع عقد إيجار رسمي في المكتب أو عبر منصة إلكترونية حكومية موثقة.

يُرجى إفادتي بالموعد المناسب لكم خلال هذا الأسبوع للمعاينة الميدانية.

مع التقدير،
[اسمك]
[رقم الهاتف]`;
      }
      if (strategy === 'pii') {
        return `عزيزي ${recipient}،

شكراً لتواصلكم بخصوص هذه الفرصة الوظيفية.

حرصاً على حماية البيانات الشخصية والبنكية من التسريب، لا أشارك وثائق الهوية الوطنية أو جواز السفر أو الحسابات البنكية عبر البريد العادي أو تطبيقات المحادثات.

يسعدني تقديم كافة المستندات المطلوبة حصراً عبر:
1. بوابة الموارد البشرية الرسمية والمشفرة التابعة لنطاق شركتكم.
2. بعد استلام العرض الوظيفي الرسمي الموقع من الإدارة المخولة.

يُرجى تزويدي ببريدكم الإلكتروني المؤسسي ورقم هاتف إدارة الموارد البشرية.

مع أطيب التحيات،
[اسمك]`;
      }
      return `عزيزي ${recipient}،

شكراً لمراسلتكم بخصوص هذا المنصب الوظيفي.

قبل استكمال خطوات التقييم، يُرجى تزويدي ببيانات التحقق المؤسسي التالية:
1. الاسم القانوني المسجل للشركة ورقم التسجيل التجاري.
2. العنوان الفعلي للمقر الرئيسي ورقم الهاتف المباشر للبدالة.
3. بريدكم الإلكتروني التابع للنطاق الرسمي للشركة.

لدواعي الأمان السيبراني، لا أجري مقابلات التوظيف عبر تطبيقات المراسلة الفورية غير المراقبة (مثل تليجرام أو واتساب).

أتطلع إلى ردكم الكريم.

مع خالص الشكر،
[اسمك]`;

    case 'en':
    default:
      if (strategy === 'equipment') {
        return `Dear ${recipient},

Thank you for sending over the employment details and offer overview.

In accordance with personal financial security standards and standard remote onboarding protocol, I do not accept, deposit, or disburse funds from advance cashier checks or reimbursement drafts to third-party equipment suppliers.

To proceed smoothly with the onboarding process:
1. Please confirm whether all required hardware (laptop, peripherals, workstation tools) will be configured and shipped directly by your internal IT Department to my address at company expense.
2. Kindly provide the registered corporate name, Employer Identification Number (EIN), and physical corporate headquarters address.
3. Please confirm that all future correspondence will be conducted via an official corporate email domain${
          domain ? ` rather than unverified channels` : ''
        }.

Once these details and the formal, countersigned offer letter are verified through your official corporate portal, I will be pleased to complete standard onboarding paperwork.

Thank you for your understanding and cooperation.

Sincerely,
[Your Name]
[Your Contact Information]`;
      }
      if (strategy === 'rental') {
        return `Dear ${recipient},

Thank you for the information regarding the property listing.

Before submitting any financial holding deposits, security funds, or application fees via wire transfer, Zelle, or cash transfer, I require standard due diligence verification:

1. A physical, in-person walk-through of the property with you or a licensed property management representative.
2. Proof of ownership or property management authorization (such as the local county parcel ID, property management agreement, or state leasing license).
3. Delivery of a formal residential lease agreement completed and signed at your physical leasing office or via an authenticated digital escrow service.

Please let me know which date and time this week works best for a physical viewing at the property.

Sincerely,
[Your Name]
[Your Phone Number]`;
      }
      if (strategy === 'pii') {
        return `Dear ${recipient},

Thank you for reaching out regarding this opportunity.

To protect personal and financial data against unauthorized transmission, I do not provide sensitive personally identifiable information (including Social Security Numbers, government passport copies, or bank account credentials) via email or unverified chat platforms.

I will be glad to provide all statutory identity and tax documentation (W-4 / I-9 / direct deposit forms) exclusively through:
1. An official, encrypted corporate HR onboarding portal (e.g. Workday, ADP, BambooHR) registered under the company's verified domain.
2. After receipt of a formal, legally binding offer letter countersigned by authorized corporate leadership.

Please provide your official corporate email address and the direct phone number to your company headquarters HR department so we can coordinate secure onboarding.

Sincerely,
[Your Name]`;
      }
      return `Dear ${recipient},

Thank you for your correspondence regarding this position.

I am interested in learning more about the role. Before taking the next steps in the evaluation process, please provide the following corporate verification details to confirm company credentials:

1. Registered Legal Entity Name and State Employer Identification Number (EIN).
2. Physical corporate headquarters address and direct office switchboard phone number.
3. Your official corporate email address (matching the registered corporate domain) and LinkedIn company profile.
4. Confirmation of whether this role was posted through the official company career portal.

For security reasons, I do not conduct formal recruitment dialogues over mobile messaging applications (Telegram, WhatsApp, Signal) and require all official hiring communications to proceed through registered enterprise channels.

I look forward to your reply so we can proceed safely.

Sincerely,
[Your Name]
[Your Contact Information]`;
  }
}
