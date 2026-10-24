
import { Product, BlogPost, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'અલ્ટ્રા ફાસ્ટ 65W ચાર્જર',
    description: 'તમામ ફ્લેગશિપ ઉપકરણો માટે યુનિવર્સલ ફાસ્ટ ચાર્જિંગ. ડ્યુઅલ પોર્ટ (USB-C અને USB-A).',
    price: 1299,
    category: 'Charger',
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    reviews: 1205,
    stock: 15,
    relatedIds: ['2', '4']
  },
  {
    id: '2',
    name: 'TATA પ્રીમિયમ ડેટા કેબલ',
    description: 'ભારે વપરાશ માટે મજબૂત, 2-મીટર લાંબો ડેટા કેબલ, ફાસ્ટ સિંક અને ચાર્જિંગ સાથે.',
    price: 499,
    category: 'Cable',
    image: 'https://images.unsplash.com/photo-1619190165532-6804a1b023f9?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviews: 850,
    stock: 50,
    relatedIds: ['1']
  },
  {
    id: '3',
    name: 'હાઈ-કેપેસિટી 5000mAh બેટરી',
    description: 'લાંબા સમય સુધી ચાલતી કામગીરી અને સુરક્ષા માટે OEM ગ્રેડની રિપ્લેસમેન્ટ બેટરી.',
    price: 1599,
    category: 'Battery',
    image: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    reviews: 340,
    stock: 5,
    relatedIds: ['4']
  },
  {
    id: '4',
    name: '9H હાર્ડનેસ ટેમ્પર્ડ ગ્લાસ',
    description: 'સ્ક્રીન સુરક્ષા માટે ઓલેઓફોબિક કોટિંગ સાથે એજ-ટુ-એજ પ્રોટેક્શન.',
    price: 299,
    category: 'Glass',
    image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviews: 2100,
    stock: 100,
    relatedIds: ['1', '2']
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'મોબાઈલ બેટરીની લાઈફ કેવી રીતે વધારવી?',
    excerpt: 'તમારા સ્માર્ટફોનની બેટરી લાંબો સમય ચાલે તે માટેની ૫ ખાસ ટિપ્સ.',
    content: 'બેટરી લાઈફ વધારવા માટે હંમેશા ઓરિજિનલ ચાર્જરનો ઉપયોગ કરો...',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop',
    date: '૨૦ મે, ૨૦૨૪'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    userName: 'રાજેશ પટેલ',
    userImage: 'https://i.pravatar.cc/150?u=rajesh',
    rating: 5,
    comment: 'ચાર્જરની ક્વોલિટી એકદમ જોરદાર છે. ટાટા કેબલ પણ મજબૂત છે!',
    date: '૨ દિવસ પહેલા'
  },
  {
    id: 'r2',
    userName: 'કોમલ શાહ',
    userImage: 'https://i.pravatar.cc/150?u=komal',
    rating: 4,
    comment: 'બેટરી બેકઅપ હવે ઘણો સારો મળે છે. સર્વિસ પણ ફાસ્ટ છે.',
    date: '૫ દિવસ પહેલા'
  }
];

export const PROMO_CODES: Record<string, number> = {
  'WELCOME10': 10, 
  'MOBI20': 20,   
};
