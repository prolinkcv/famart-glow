export const SITE = {
  name: "Famart Healthcare Medical and Skin Clinic",
  shortName: "Famart Healthcare",
  tagline: "Medical and Skin Clinic",
  phone: "+254725077433",
  phoneDisplay: "+254 725 077 433",
  whatsapp: "254725077433",
  email: "info@famarthealthcare.co.ke",
  address: "Nairobi Town, Odeon Cinema, Opposite Shell Petrol Station",
  city: "Nairobi",
  country: "Kenya",
  hours: "Monday – Friday, 9:00 AM – 5:00 PM",
  mapsQuery: "Odeon+Cinema+Nairobi+Kenya",
} as const;

export const waLink = (message = "Hello Famart Healthcare, I would like to book an appointment.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

export const telLink = `tel:${SITE.phone}`;

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${SITE.mapsQuery}`;

export const services = [
  { slug: "acne-treatment", name: "Acne Treatment", icon: "Sparkles", desc: "Targeted medical therapy for acne, breakouts and post-acne scarring." },
  { slug: "eczema-management", name: "Eczema Management", icon: "Droplets", desc: "Long-term relief plans for dry, itchy and inflamed eczema-prone skin." },
  { slug: "psoriasis-treatment", name: "Psoriasis Treatment", icon: "ShieldPlus", desc: "Evidence-based control of plaques, flares and scalp psoriasis." },
  { slug: "skin-allergy-treatment", name: "Skin Allergy Treatment", icon: "AlertCircle", desc: "Identify triggers and calm hives, contact dermatitis and reactions." },
  { slug: "fungal-skin-infections", name: "Fungal Skin Infections", icon: "Bug", desc: "Accurate diagnosis and treatment of ringworm, tinea and yeast infections." },
  { slug: "skin-rash-diagnosis", name: "Skin Rash Diagnosis", icon: "Search", desc: "Clear answers for unexplained rashes with a thorough clinical review." },
  { slug: "pigmentation-disorders", name: "Pigmentation Disorders", icon: "Palette", desc: "Care for melasma, dark spots, hyperpigmentation and uneven tone." },
  { slug: "skin-consultation", name: "Skin Consultation", icon: "Stethoscope", desc: "One-on-one assessment with a personalised skin care plan." },
  { slug: "general-dermatology", name: "General Dermatology", icon: "HeartPulse", desc: "Full-spectrum medical dermatology for adults and children." },
  { slug: "cosmetic-skin-care", name: "Cosmetic Skin Care", icon: "Gem", desc: "Safe, medically guided treatments for glow, texture and confidence." },
  { slug: "hair-scalp-conditions", name: "Hair & Scalp Conditions", icon: "Scissors", desc: "Hair loss, dandruff and scalp inflammation assessed and treated." },
  { slug: "mole-assessment", name: "Mole Assessment", icon: "ScanEye", desc: "Careful examination of moles and lesions for early warning signs." },
  { slug: "wart-removal", name: "Wart Removal", icon: "Zap", desc: "Quick in-clinic removal of warts, skin tags and small growths." },
  { slug: "skin-infection-treatment", name: "Skin Infection Treatment", icon: "Syringe", desc: "Prompt care for bacterial, viral and inflammatory skin infections." },
  { slug: "patient-follow-up", name: "Patient Follow-up", icon: "CalendarCheck", desc: "Structured review visits so your treatment keeps working." },
] as const;

export const whyChooseUs = [
  { icon: "Award", title: "Experienced Professionals", desc: "A clinical team with deep experience in skin health." },
  { icon: "HeartHandshake", title: "Patient-Centered Care", desc: "We listen first, then build care around you." },
  { icon: "Microscope", title: "Modern Treatment", desc: "Current protocols and modern clinical practice." },
  { icon: "Wallet", title: "Affordable Services", desc: "Transparent, fair pricing for quality dermatology." },
  { icon: "MapPin", title: "Convenient CBD Location", desc: "Easy to reach in the heart of Nairobi CBD." },
  { icon: "BookOpenCheck", title: "Evidence-Based Medicine", desc: "Treatments backed by clinical evidence." },
  { icon: "Timer", title: "Fast Appointments", desc: "Short waiting times and same-week slots." },
  { icon: "BadgeCheck", title: "Quality Healthcare", desc: "Consistent standards at every single visit." },
] as const;

export const testimonials = [
  { name: "Wanjiru M.", text: "My acne cleared up within weeks. The doctor explained everything clearly and the plan actually worked." },
  { name: "Brian O.", text: "I had a rash for months. One consultation at Famart and I finally had a proper diagnosis and treatment." },
  { name: "Aisha K.", text: "Clean clinic, warm staff and very affordable. The follow-up visit showed they genuinely care." },
  { name: "Peter N.", text: "Booked on WhatsApp and was seen the same week. Excellent eczema care for my son." },
  { name: "Faith C.", text: "The pigmentation treatment changed my confidence completely. Highly professional service." },
  { name: "Samuel G.", text: "Convenient CBD location and no long queues. This is how healthcare should feel." },
] as const;

export const faqs = [
  { q: "Do I need an appointment?", a: "An appointment is recommended so we can reserve dedicated consultation time for you. You can book online, call us or send a WhatsApp message and we will confirm your slot." },
  { q: "What skin conditions do you treat?", a: "We treat acne, eczema, psoriasis, skin allergies, fungal infections, unexplained rashes, pigmentation disorders, hair and scalp conditions, warts, moles, skin infections and more." },
  { q: "How long does treatment take?", a: "A first consultation usually takes 20–30 minutes. Treatment length depends on the condition — some infections resolve in one to two weeks, while chronic conditions such as eczema or psoriasis are managed with a longer-term plan and review visits." },
  { q: "Do you accept walk-in patients?", a: "Yes. Walk-in patients are welcome during working hours, Monday to Friday, 9:00 AM to 5:00 PM. Booked patients are attended to first, so booking ahead reduces your waiting time." },
  { q: "Where are you located?", a: "We are in Nairobi Town at Odeon Cinema, opposite the Shell Petrol Station — easily accessible from anywhere in the CBD." },
] as const;
