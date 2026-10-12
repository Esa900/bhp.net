import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'zh' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    zh: string;
    bn?: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  aboutUs: { en: 'About Us', es: 'Sobre nosotros', zh: '关于我们', bn: 'আমাদের সম্পর্কে' },
  whatWeDo: { en: 'What we do', es: 'Qué hacemos', zh: '业务领域', bn: 'আমাদের কার্যক্রম' },
  investorCentre: { en: 'Investor Centre', es: 'Centro de inversores', zh: '投资者中心', bn: 'বিনিয়োগকারী কেন্দ্র' },
  sustainability: { en: 'Sustainability', es: 'Sostenibilidad', zh: '可持续发展', bn: 'স্থায়িত্ব ও পরিবেশ' },
  careers: { en: 'Careers', es: 'Carreras', zh: '职业生涯', bn: 'ক্যারিয়ার' },
  newsPublications: { en: 'News & Publications', es: 'Noticias y publicaciones', zh: '新闻与出版物', bn: 'সংবাদ ও প্রকাশনা' },
  suppliers: { en: 'Suppliers', es: 'Proveedores', zh: '供应商', bn: 'সরবরাহকারী' },
  contactUs: { en: 'Contact us', es: 'Contáctenos', zh: '联系我们', bn: 'যোগাযোগ করুন' },

  // Hero
  heroTitle: {
    en: 'Building what’s next is what BHP does best.',
    es: 'Construir lo que viene es lo que mejor hace BHP.',
    zh: '开创未来是必和必拓的核心优势。',
    bn: 'ভবিষ্যত নির্মাণই BHP-এর সেরা শক্তি।',
  },
  heroSubtitle: {
    en: 'Resources that make the future possible.',
    es: 'Recursos que hacen posible el futuro.',
    zh: '为未来赋能的核心资源。',
    bn: 'ভবিষ্যতকে সম্ভাবনাময় করে তোলার সম্পদ।',
  },
  findOutMore: { en: 'Find out more', es: 'Saber más', zh: '了解更多', bn: 'আরও জানুন' },
  positioningTitle: {
    en: 'Positioning for the future',
    es: 'Posicionándonos para el futuro',
    zh: '立足未来，长远布局',
    bn: 'ভবিষ্যতের জন্য প্রস্তুতি',
  },
  positioningDesc: {
    en: 'Learn more about our focus on the commodities the world needs to decarbonise and sustainably grow.',
    es: 'Conozca más sobre nuestro enfoque en los productos básicos que el mundo necesita para descarbonizarse y crecer de forma sostenible.',
    zh: '深入了解我们致力于提供的关键大宗商品，助力全球脱碳与可持续增长。',
    bn: 'বিশ্বের ডিকার্বনাইজেশন এবং টেকসই প্রবৃদ্ধির জন্য প্রয়োজনীয় পণ্যের ওপর আমাদের উদ্যোগ সম্পর্কে জানুন।',
  },

  // CEO Quote
  ceoQuote: {
    en: 'BHP is in tremendous shape. We have the people and the portfolio to deliver more of what the world needs – safely, productively and responsibly. Best of all, we still have so much more opportunity ahead of us. Together, we can build the resource projects the world needs and win the next decade.',
    es: 'BHP está en una forma extraordinaria. Contamos con las personas y la cartera para entregar más de lo que el mundo necesita, de manera segura, productiva y responsable. Lo mejor de todo es que aún tenemos muchas más oportunidades por delante. Juntos, podemos construir los proyectos de recursos que el mundo necesita y ganar la próxima década.',
    zh: '必和必拓正处于强劲稳健的发展阶段。我们拥有优秀的团队和资产组合，能够以安全、高效和负责任的方式为世界提供所需资源。最重要的是，未来仍有机遇等待我们去开拓。携手共进，我们将建设世界所需的资源项目，决胜下一个十年。',
    bn: 'BHP অসাধারণ অবস্থানে রয়েছে। বিশ্বের যা প্রয়োজন তা নিরাপদ, উৎপাদনশীল এবং দায়িত্বশীলভাবে সরবরাহ করার মতো দক্ষ কর্মী ও সম্পদ আমাদের রয়েছে। সবচেয়ে বড় কথা, আমাদের সামনে আরও অপার সম্ভাবনা রয়েছে।',
  },
  readCeoMessage: {
    en: 'Read the CEO message',
    es: 'Leer el mensaje del CEO',
    zh: '阅读首席执行官致辞',
    bn: 'সিইও-র বার্তা পড়ুন',
  },

  // Bento
  positiveDifferenceTitle: {
    en: 'Making a positive difference',
    es: 'Marcando una diferencia positiva',
    zh: '创造积极深远的影响',
    bn: 'ইতিবাচক পরিবর্তন সৃষ্টি',
  },
  positiveDifferenceDesc: {
    en: 'We are committed to finding new ways of operating more sustainably while supplying products that are essential for the global transition towards a more sustainable future.',
    es: 'Nos comprometemos a encontrar nuevas formas de operar de manera más sostenible mientras suministramos productos esenciales para la transición global hacia un futuro más sostenible.',
    zh: '我们致力于探索更加可持续的运营方式，同时供应推动全球向低碳未来转型的关键产品。',
    bn: 'আমরা টেকসই উপায়ে কাজ করার পাশাপাশি এমন পণ্য সরবরাহ করতে প্রতিশ্রুতিবদ্ধ যা টেকসই ভবিষ্যতের জন্য অপরিহার্য।',
  },
  shareholdersTitle: {
    en: 'Delivering for shareholders',
    es: 'Generando valor para los accionistas',
    zh: '为股东创造卓越回报',
    bn: 'শেয়ারহোল্ডারদের জন্য অর্জন',
  },
  shareholdersDesc: {
    en: 'Over the last 12 months our teams have delivered strong and, in some cases, record production. Learn more about our performance.',
    es: 'Durante los últimos 12 meses, nuestros equipos lograron una producción sólida y, en algunos casos, récord. Conozca más sobre nuestro desempeño.',
    zh: '在过去的12个月中，我们各运营团队表现亮眼，多项产销创下历史纪录。了解我们的业绩表现。',
    bn: 'গত ১২ মাসে আমাদের দলগুলো শক্তিশালী এবং কয়েকটি ক্ষেত্রে রেকর্ড উৎপাদন উপহার দিয়েছে।',
  },
  investorHubTitle: {
    en: 'Investor hub',
    es: 'Portal del inversionista',
    zh: '投资者枢纽',
    bn: 'ইনভেস্টর হাব',
  },
  careerTitle: {
    en: 'A career with BHP',
    es: 'Una carrera en BHP',
    zh: '在必和必拓发展事业',
    bn: 'BHP-তে ক্যারিয়ার',
  },
  whereWeOperateTitle: {
    en: 'Where we operate',
    es: 'Dónde operamos',
    zh: '全球运营网络',
    bn: 'আমাদের কর্মক্ষেত্র',
  },
  whatWeProduceTitle: {
    en: 'What we produce',
    es: 'Lo que producimos',
    zh: '我们的核心产品',
    bn: 'আমরা যা উৎপাদন করি',
  },
  latestNewsTitle: {
    en: 'Latest news',
    es: 'Últimas noticias',
    zh: '最新动态',
    bn: 'তাজা খবর',
  },
  moreNews: {
    en: 'More news',
    es: 'Más noticias',
    zh: '更多新闻',
    bn: 'আরও খবর',
  },
  latestReportsTitle: {
    en: 'Our latest reports',
    es: 'Nuestros últimos informes',
    zh: '最新官方报告',
    bn: 'আমাদের সাম্প্রতিক প্রতিবেদন',
  },
  upcomingEventsTitle: {
    en: 'Upcoming Events',
    es: 'Próximos eventos',
    zh: '近期日程安排',
    bn: 'আসন্ন অনুষ্ঠান',
  },
  addToCalendar: {
    en: 'Add to calendar',
    es: 'Añadir al calendario',
    zh: '添加至日历',
    bn: 'ক্যালেন্ডারে যোগ করুন',
  },
  subscribe: {
    en: 'Subscribe',
    es: 'Suscribirse',
    zh: '立即订阅',
    bn: 'সাবস্ক্রাইব করুন',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
