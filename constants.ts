import { Product, BlogPost, Review, BuyingGuide, StoreSettings } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'અલ્ટ્રા ફાસ્ટ 65W ચાર્જર',
    description: 'તમામ ફ્લેગશિપ ઉપકરણો માટે યુનિવર્સલ ફાસ્ટ ચાર્જિંગ. ડ્યુઅલ પોર્ટ (USB-C અને USB-A).',
    price: 1299,
    category: 'Charger',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    rating: 0,
    reviews: 0,
    reviewsList: [],
    stock: 15,
    relatedIds: ['2', '4'],
    status: 'published',
    returnPolicy: '7 Days'
  },
  {
    id: '2',
    name: 'TATA પ્રીમિયમ ડેટા કેબલ',
    description: 'ભારે વપરાશ માટે મજબૂત, 2-મીટર લાંબો ડેટા કેબલ, ફાસ્ટ સિંક અને ચાર્જિંગ સાથે.',
    price: 499,
    category: 'Cable',
    image: 'https://images.unsplash.com/photo-1619190165532-6804a1b023f9?q=80&w=800&auto=format&fit=crop',
    rating: 0,
    reviews: 0,
    reviewsList: [],
    stock: 50,
    relatedIds: ['1'],
    status: 'published',
    returnPolicy: '7 Days'
  },
  {
    id: '3',
    name: 'હાઈ-કેપેસિટી 5000mAh બેટરી',
    description: 'લાંબા સમય સુધી ચાલતી કામગીરી અને સુરક્ષા માટે રિપ્લેસમેન્ટ મોબાઈલ બેટરી.',
    price: 1599,
    category: 'Battery',
    image: 'https://images.unsplash.com/photo-1609592424209-27d4b8c3b366?q=80&w=800&auto=format&fit=crop',
    rating: 0,
    reviews: 0,
    reviewsList: [],
    stock: 5,
    relatedIds: ['4'],
    status: 'published',
    returnPolicy: '7 Days'
  },
  {
    id: '4',
    name: '9H હાર્ડનેસ ટેમ્પર્ડ ગ્લાસ',
    description: 'સ્ક્રીન સુરક્ષા માટે ઓલેઓફોબિક કોટિંગ સાથે એજ-ટુ-એજ પ્રોટેક્શન.',
    price: 299,
    category: 'Glass',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    rating: 0,
    reviews: 0,
    reviewsList: [],
    stock: 100,
    relatedIds: ['1', '2'],
    status: 'published',
    returnPolicy: '7 Days'
  },
  {
    id: '1772984716711',
    name: 'પ્રીમિયમ 20W ફાસ્ટ ચાર્જર અને ટાઈપ-સી કેબલ',
    description: 'હાઇ સ્પીડ ફાસ્ટ ચાર્જિંગ, ડ્યુઅલ પોર્ટ, ઓવરહિટીંગ પ્રિવેન્શન અને સુરક્ષિત ચાર્જિંગ.',
    price: 999,
    oldPrice: 1999,
    category: 'Charger',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviews: 12,
    reviewsList: [],
    stock: 25,
    relatedIds: ['1', '2'],
    status: 'published',
    returnPolicy: '7 Days',
    brand: 'MyshopMyhome',
    model: 'FastCharge Pro 20W',
    capacity: 'N/A',
    inputSpec: '100-240V 50/60Hz',
    outputSpec: '5V/3A, 9V/2.22A, 12V/1.67A'
  }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  businessName: 'MyshopMyhome.shop',
  supportEmail: '',
  supportPhone: '',
  businessAddress: '',
  businessHours: '',
  shippingSummary: '',
  deliveryTimeline: '',
  returnPolicySummary: 'Products display their applicable return eligibility ("7 Days Return" or "No Return") directly on each product listing and order record.',
  refundTimeline: '',
  cancellationPolicy: 'Orders that are still in "Pending" status can be cancelled directly from the "My Orders" section before dispatch.',
  warrantySummary: '',
  registrationDetails: '',
  adsenseEnabled: false,
  adsenseGuideSlotId: '',
  adsenseFaqSlotId: '',
};

export const INITIAL_BUYING_GUIDES: BuyingGuide[] = [
  {
    id: 'guide-charger-compatibility',
    slug: 'how-to-choose-compatible-phone-charger',
    title: 'How to Choose a Charger Compatible with Your Phone',
    summary: 'A practical guide to matching charging wattage, connector types (USB-C vs USB-A), and charging protocols safely without overpaying.',
    category: 'Chargers & Adapters',
    readTime: '5 min read',
    updatedAt: '2026-10-24',
    sections: [
      {
        heading: '1. Check Your Phone’s Maximum Supported Wattage',
        body: 'Every smartphone has a built-in power management circuit that controls how much power it draws. Using a higher-wattage charger from a reputable manufacturer will not force extra power into your phone—the phone only draws what it supports. However, using a charger with lower wattage than your phone requires will result in slower charging speeds.',
        checklist: [
          'Check your phone manual or settings for its maximum wired charging input (e.g., 18W, 25W, 33W, 45W, or 65W).',
          'Choose a wall adapter rated at or above your phone’s supported wattage for normal fast-charging performance.',
          'Remember that dual-port chargers often split total wattage when two devices are plugged in at the same time.'
        ]
      },
      {
        heading: '2. Understand Charging Protocols (USB-PD, PPS, and Proprietary Standards)',
        body: 'Wattage alone does not guarantee fast charging. Phones and chargers communicate using charging protocols. Most modern Android phones and recent iPhones use USB Power Delivery (USB-PD) or Programmable Power Supply (PPS) over a USB-C port, while some brands use proprietary fast-charging protocols that require specific cables and adapters.',
        checklist: [
          'USB-C PD (Power Delivery): Widely used across modern smartphones, tablets, and accessories.',
          'PPS (Programmable Power Supply): Adjusts voltage and current in small steps to reduce heat during fast charging.',
          'USB-A Ports: Useful for older cables and low-power accessories such as neckbands, earbuds, and smartwatches.'
        ]
      },
      {
        heading: '3. Match the Adapter with the Right Cable',
        body: 'A fast wall charger cannot deliver its rated speed through a basic low-current cable. Standard USB-C to USB-C cables typically support up to 60W (20V/3A), whereas higher wattages require cables rated for 5A (100W+) with an E-Marker chip.',
        checklist: [
          'Verify whether the charger box includes a data/charging cable or is sold as an adapter unit only.',
          'Inspect connector fit—loose plugs create resistance and excess heat.'
        ]
      }
    ]
  },
  {
    id: 'guide-power-bank-checklist',
    slug: 'what-to-check-before-buying-a-power-bank',
    title: 'What to Check Before Buying a Power Bank',
    summary: 'Understand rated battery capacity versus real-world output, port selection, weight, and safety features before choosing a portable charger.',
    category: 'Power Banks & Batteries',
    readTime: '6 min read',
    updatedAt: '2026-10-24',
    sections: [
      {
        heading: '1. Battery Capacity (mAh) vs. Actual Usable Output',
        body: 'Power banks advertise cell capacity (such as 10,000mAh or 20,000mAh) measured at the internal battery voltage (typically 3.7V). When charging your phone at 5V, 9V, or 12V, voltage conversion and heat loss mean you typically get around 60% to 70% of the stated mAh rating at 5V.',
        checklist: [
          '10,000mAh Power Bank: Usually provides 1.2 to 1.5 full charges for a typical 4,500–5,000mAh phone, while staying pocket-friendly.',
          '20,000mAh Power Bank: Provides roughly 2.5 to 3 full charges, ideal for travel or multiple devices, but is noticeably heavier.'
        ]
      },
      {
        heading: '2. Input and Output Charging Speeds',
        body: 'A high-capacity power bank can take many hours to recharge if its input speed is slow (such as 10W). Look for two-way fast charging where the USB-C port functions as both a fast input and a fast output.',
        checklist: [
          'Check that the USB-C port supports bidirectional PD (both recharging the power bank and charging your phone).',
          'Check the single-port vs. multi-port output rating if you plan to charge two phones simultaneously.'
        ]
      },
      {
        heading: '3. Safety Protections and Travel Rules',
        body: 'Lithium-ion and lithium-polymer cells require protection circuits against overcharging, short circuits, and excessive temperature. When flying, airlines require power banks to be carried in cabin hand luggage rather than checked baggage.',
        checklist: [
          'Never leave a power bank charging under pillows, blankets, or in direct sunlight inside a parked vehicle.',
          'Stop using any battery or power bank immediately if you notice swelling, unusual odor, or excessive heat.'
        ]
      }
    ]
  },
  {
    id: 'guide-audio-accessories',
    slug: 'wired-earphones-vs-neckbands-vs-tws-earbuds',
    title: 'How to Choose Between Wired Earphones, Neckbands, and Earbuds',
    summary: 'Compare battery life, call clarity, audio latency, comfort, and daily durability across wired earphones, Bluetooth neckbands, and TWS earbuds.',
    category: 'Audio & Headphones',
    readTime: '5 min read',
    updatedAt: '2026-10-24',
    sections: [
      {
        heading: '1. Wired Earphones (3.5mm Jack or USB-C)',
        body: 'Wired earphones never need charging and offer zero wireless audio delay (latency), making them dependable for long calls, online classes, and gaming. Because the inline microphone sits close to your mouth, voice pickup in noisy surroundings is often very clear.',
        checklist: [
          'Check whether your phone has a 3.5mm audio jack or requires a USB-C connector.',
          'If using USB-C wired earphones, check whether your phone supports analog audio pass-through or needs a built-in DAC chip.'
        ]
      },
      {
        heading: '2. Bluetooth Neckbands',
        body: 'Neckbands rest around your collar, allowing larger batteries than tiny earbuds and preventing accidental drops when you remove an earpiece. They are practical for commuters, delivery riders, and long workday phone calls.',
        checklist: [
          'Look for magnetic earpieces that clip together when not in use.',
          'Check charging port type (USB-C is easier to share with your phone cable than older Micro-USB).'
        ]
      },
      {
        heading: '3. True Wireless Stereo (TWS) Earbuds',
        body: 'TWS earbuds eliminate wires completely and store inside a pocketable charging case. They are convenient for workouts and travel, though individual earbuds have smaller batteries and can be easier to misplace if not returned to the case.',
        checklist: [
          'Keep the charging contacts inside the case clean and dry so both earbuds charge evenly.',
          'Choose ear-tip sizes that seal comfortably without causing ear fatigue.'
        ]
      }
    ]
  },
  {
    id: 'guide-cable-adapter-care',
    slug: 'basic-care-and-safe-use-of-charging-cables-and-adapters',
    title: 'Basic Care and Safe Use of Charging Cables and Adapters',
    summary: 'Simple habits that prevent frayed wires, loose charging ports, overheating adapters, and premature accessory failure.',
    category: 'Care & Safety',
    readTime: '4 min read',
    updatedAt: '2026-10-24',
    sections: [
      {
        heading: '1. Pull the Connector Plug, Never the Cord',
        body: 'Most charging cable failures happen right behind the connector head where internal copper strands bend repeatedly. Always grip the solid plastic or metal plug housing when unplugging from your phone or wall socket.',
        checklist: [
          'Avoid resting the bottom of your phone on the cable bend while using the phone in bed or on a couch.',
          'Coil cables loosely in smooth loops rather than wrapping them tightly around sharp adapter corners.'
        ]
      },
      {
        heading: '2. Keep Connectors Dry and Free of Pocket Lint',
        body: 'If a cable stops clicking firmly into your phone port, compacted pocket lint inside the phone’s charging port is often the cause rather than a broken cable. Moisture or dust on connector pins can also cause corrosion or intermittent charging.',
        checklist: [
          'Never insert metal pins, needles, or paperclips into a charging port.',
          'Never plug in a wet cable or charge a device when moisture is present in the port.'
        ]
      },
      {
        heading: '3. Ventilation and Socket Safety for Wall Adapters',
        body: 'Fast chargers naturally get warm during the high-speed phase of charging (typically 0% to 60%). They rely on surrounding air to dissipate heat.',
        checklist: [
          'Plug adapters into firm wall sockets; loose sockets can arc and damage adapter prongs.',
          'Unplug and replace any cable that has exposed wiring, melted insulation, or burnt pin marks.'
        ]
      }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'મોબાઈલ બેટરીની લાઈફ કેવી રીતે વધારવી?',
    excerpt: 'તમારા સ્માર્ટફોનની બેટરી લાંબો સમય ચાલે તે માટેની ૫ ખાસ ટિપ્સ.',
    content: 'બેટરી લાઈફ વધારવા માટે હંમેશા યોગ્ય વોટેજના ચાર્જરનો ઉપયોગ કરો અને ફોનને અતિશય ગરમીથી બચાવો.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    date: '૨૦ મે, ૨૦૨૪'
  }
];

export const REVIEWS: Review[] = [];

export const PROMO_CODES: Record<string, number> = {
  'WELCOME10': 10,
  'MOBI20': 20,
};
