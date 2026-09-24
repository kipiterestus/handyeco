import React, { createContext, useContext, useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessData';
import { SERVICES } from '../data/servicesData';
import { GALLERY_ITEMS } from '../data/galleryData';
import { REVIEWS } from '../data/reviewsData';

// Fallback initial state ensuring 100% stability
const DEFAULT_CONTENT = {
  siteConfig: {
    businessName: BUSINESS_INFO.name,
    tagline: BUSINESS_INFO.tagline,
    craftsmanName: BUSINESS_INFO.craftsman,
    phone: BUSINESS_INFO.phone,
    displayPhone: BUSINESS_INFO.displayPhone,
    email: BUSINESS_INFO.email,
    whatsappNumber: BUSINESS_INFO.whatsapp,
    whatsappUrl: BUSINESS_INFO.whatsappUrl,
    googleProfileUrl: BUSINESS_INFO.googleProfileUrl,
    callOutFee: 0,
    minimumJobBooking: 65,
    callOutText: 'Free Quotes • Minimum Job £65 (Edinburgh Area)',
    responseTime: '15–30 mins',
    responseTimeText: 'Average response time: 15–30 mins on WhatsApp.',
    availabilityText: 'Available for Booking',
    areaCoverage: 'Edinburgh & Lothians',
    workingHours: BUSINESS_INFO.hours,
    address: 'Edinburgh, Scotland, UK'
  },
  hero: {
    ratingScore: '5.0 / 5.0',
    ratingPlatform: 'Google Verified Reviews',
    headlineStart: "Edinburgh's Trusted Handyman for",
    headlineHighlight: 'Repairs, Assembly',
    headlineEnd: '& Home Renovations.',
    description: 'Looking for a trusted, 5-star rated local handyman near me in Edinburgh? Specialist in flat-pack furniture assembly, TV wall mounting into historic stone walls, interior painting, and mould-free bathroom silicone sealing. Fast, reliable, and exceptionally tidy workmanship.',
    bullets: [
      'Punctual, Clean & Spotless Tidy',
      'Free Quotes • Minimum Job £65',
      'Tenement Specialists (Stone & Plaster)',
      'Prompt WhatsApp Photo Estimates'
    ],
    heroImage: '/hero-handyman-edinburgh.jpg',
    completedCount: 'Over 500+ Edinburgh Homes Maintained',
    completedSubtext: 'From Morningside flats to New Town tenements.'
  },
  services: SERVICES,
  gallery: GALLERY_ITEMS,
  reviews: REVIEWS,
  areas: [
    { zone: 'Central & City', postcodes: 'EH1 - EH3, EH7 - EH8', areas: 'Old Town, New Town, West End, Broughton' },
    { zone: 'North & Coast', postcodes: 'EH4 - EH6, EH15', areas: 'Leith, Stockbridge, Trinity, Portobello' },
    { zone: 'South & West', postcodes: 'EH9 - EH14', areas: 'Morningside, Bruntsfield, Corstorphine, Balerno' },
    { zone: 'Lothians', postcodes: 'EH21 - EH30, EH54', areas: 'Musselburgh, Dalkeith, Queensferry, Livingston' }
  ],
  faq: [
    {
      q: 'How does your pricing work? Are there hidden charges?',
      a: 'We believe in 100% transparent pricing. We provide fixed quotes upfront based on photos or description of the job sent via WhatsApp or our online quote form. Our minimum call-out fee is £65 (covers travel and the initial diagnostic/small repair time within Edinburgh). There are never hidden extras or surprise call-out fees.'
    },
    {
      q: 'How quickly can a local handyman near me in Edinburgh attend to a job?',
      a: 'We regularly accommodate same-week and even next-day emergency appointments for urgent jobs like leaking silicone or pre-tenancy move-out repairs. Average response time on WhatsApp is 15–30 minutes.'
    },
    {
      q: 'Can you mount heavy items into traditional Edinburgh sandstone or tenement walls?',
      a: 'Yes, absolutely. Edinburgh tenement walls require specialist masonry drill bits and heavy-duty Fischer DuoPower anchors to prevent crumbling. We routinely secure heavy 75-85" TVs, solid oak bookshelves, and heavy ornate mirrors into both historic stone and stud partitions.'
    },
    {
      q: 'Do I need to supply tools or hardware fixings?',
      a: 'No, we bring a comprehensive kit of professional 18V cordless power tools, laser levels, and industrial-grade fixings (screws, wall plugs, masonry anchors). For flat-pack furniture, all assembly hardware is included in your boxes; if any screws are missing, we carry spares in our kit.'
    },
    {
      q: 'What areas in Edinburgh do you cover if I need a handyman near me?',
      a: 'We cover all of Edinburgh (EH1 through EH17) as well as the surrounding Lothians including Musselburgh (EH21), Dalkeith (EH22), South Queensferry (EH30), and Livingston (EH54) with zero extra travel surcharge within standard zones.'
    }
  ],
  seo: {
    metaTitle: 'Handyman Edinburgh | #1 Trusted Handyman Near Me | Handyeco',
    metaDescription: 'Looking for a trusted local handyman near me in Edinburgh? 5-star rated for IKEA flat-pack assembly, TV wall mounting into stone, silicone sealing & odd jobs. From £65.',
    keywords: [
      'handyman edinburgh',
      'handyman near me',
      'local handyman near me',
      'handyman near me edinburgh',
      'edinburgh handyman services',
      'emergency handyman near me',
      'flat pack assembly edinburgh',
      'ikea furniture assembly edinburgh',
      'tv wall mounting edinburgh',
      'tv mounting stone walls edinburgh',
      'bathroom silicone sealing edinburgh',
      'property repairs edinburgh',
      'tenement repairs edinburgh',
      'painter decorator edinburgh'
    ],
    canonicalUrl: 'https://handyeco.co.uk/',
    geoRegion: 'GB-EDH',
    geoPlacename: 'Edinburgh',
    geoPosition: '55.9533;-3.1883',
    icbm: '55.9533, -3.1883',
    ogImage: '/hero-handyman-edinburgh.jpg'
  }
};

const ContentContext = createContext({
  content: DEFAULT_CONTENT,
  loading: false,
  refreshContent: async () => {},
  updateSectionLocally: () => {}
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          if (data.content.siteConfig && (!data.content.siteConfig.email || data.content.siteConfig.email === 'ekremguran@gmail.com')) {
            data.content.siteConfig.email = 'info@handyeco.co.uk';
          }
          setContent(prev => ({
            ...prev,
            ...data.content
          }));
        }
      }
    } catch (err) {
      console.warn('[ContentContext] Using local fallback content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateSectionLocally = (section, data) => {
    setContent(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <ContentContext.Provider value={{
      content,
      loading,
      refreshContent: fetchContent,
      updateSectionLocally
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
