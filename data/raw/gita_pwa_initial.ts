
import { Verse, Language } from '../types';

export const INITIAL_VERSES: Verse[] = [
  {
    id: 'bg-2-13',
    chapter: 2,
    verse: 13,
    [Language.ENGLISH]: {
      sanskrit: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥ १३ ॥',
      transliteration: 'dehino ’smin yathā dehe\nkaumāraṁ yauvanaṁ jarā\ntathā dehāntara-prāptir\ndhīras tatra na muhyati',
      synonyms: 'dehinaḥ — of the embodied; asmin — in this; yathā — as; dehe — in the body; kaumāram — boyhood; yauvanam — youth; jarā — old age; tathā — similarly; deha-antara — of transference of the body; prāptiḥ — achievement; dhīraḥ — the sober; tatra — thereupon; na — never; muhyati — is deluded.',
      translation: 'As the embodied soul continuously passes, in this body, from boyhood to youth to old age, the soul similarly passes into another body at death. A sober person is not bewildered by such a change.',
      purport: 'Since every living entity is an individual soul, each is changing his body at every moment, manifesting sometimes as a child, sometimes as a youth, and sometimes as an old man. Yet the same spirit soul is there and does not undergo any change.'
    },
    [Language.NEPALI]: {
      sanskrit: 'देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा ।\nतथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ॥ १३ ॥',
      transliteration: 'देहिनोऽस्मिन यथा देहे कौमारं यौवनं जरा...',
      synonyms: 'देहिनः — शरीरधारीको; अस्मिन् — यस; यथा — जसरी; देहे — शरीरमा...',
      translation: 'जसरी शरीरधारी आत्माको यस शरीरमा कौमार्य, यौवन र वृद्धावस्था आउँछ, त्यसरी नै मृत्युपछि उसले अर्को शरीर प्राप्त गर्छ। धीर व्यक्ति यस्तो परिवर्तनबाट मोहित हुँदैनन्।',
      purport: 'प्रत्येक जीवित प्राणी एक व्यक्तिगत आत्मा भएको हुनाले, प्रत्येकले आफ्नो शरीर हरेक क्षण परिवर्तन गरिरहेको हुन्छ, कहिले बालक, कहिले जवान र कहिले वृद्धको रूपमा प्रकट हुन्छ।'
    }
  },
  {
    id: 'bg-2-47',
    chapter: 2,
    verse: 47,
    [Language.ENGLISH]: {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥',
      transliteration: 'karmaṇy evādhikāras te\nmā phaleṣu kadācana\nmā karma-phala-hetur bhūr\nmā te saṅgo ’stv akarmaṇi',
      synonyms: 'karmaṇi — in prescribed duties; eva — certainly; adhikāraḥ — right; te — of you; mā — never; phaleṣu — in the fruits; kadācana — at any time...',
      translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
      purport: 'There are three considerations here: prescribed duties, capricious work, and inaction. Prescribed duties are activities enjoined by the supreme authority...'
    },
    [Language.NEPALI]: {
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ ४७ ॥',
      transliteration: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...',
      synonyms: 'कर्मणि — कर्ममा; एव — मात्र; अधिकारः — अधिकार; ते — तिम्रो...',
      translation: 'तिमीलाई आफ्नो निर्धारित कर्म गर्ने अधिकार छ, तर कर्मको फलमा तिम्रो कुनै अधिकार छैन। तिमी कहिल्यै पनि आफूलाई आफ्नो कर्मको फलको कारण नठान र अकर्मण्यतामा पनि तिम्रो आशक्ति नहोस्।',
      purport: 'यहाँ तीनवटा विचारहरू छन्: निर्धारित कर्तव्य, स्वेच्छाचारी काम र अकर्मण्यता। निर्धारित कर्तव्यहरू सर्वोच्च अधिकारीद्वारा आज्ञा गरिएका गतिविधिहरू हुन्...'
    }
  }
];
