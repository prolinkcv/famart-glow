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

/** Bare WhatsApp link with no prefilled text — always safe to open. */
export const waPlainLink = `https://wa.me/${SITE.whatsapp}`;

/** Builds a clean, readable booking message. */
export const bookingMessage = (d: {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
  message?: string;
}) => {
  const lines = [
    "Hello Famart Healthcare, I would like to book an appointment.",
    "",
    d.name ? `Name: ${d.name}` : "",
    d.phone ? `Phone: ${d.phone}` : "",
    d.email ? `Email: ${d.email}` : "",
    d.service ? `Service: ${d.service}` : "",
    d.date ? `Preferred date: ${d.date}` : "",
    d.time ? `Preferred time: ${d.time}` : "",
    d.message ? `Message: ${d.message}` : "",
  ].filter(Boolean);
  return lines.join("\n");
};

/**
 * Opens WhatsApp with the prefilled message. If the message cannot be
 * prefilled (encoding issue, over-long URL, blocked popup), it falls back to a
 * clean chat window so the patient is never left stranded.
 */
export const openWhatsApp = (message?: string): { prefilled: boolean } => {
  const open = (url: string) => {
    const w = typeof window !== "undefined" ? window.open(url, "_blank", "noopener") : null;
    if (!w && typeof window !== "undefined") window.location.href = url;
    return true;
  };

  if (message) {
    try {
      const url = waLink(message);
      if (url.length <= 1800) {
        open(url);
        return { prefilled: true };
      }
    } catch {
      /* fall through to the plain link */
    }
  }
  open(waPlainLink);
  return { prefilled: false };
};

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

export type ServiceDetail = {
  headline: string;
  intro: string;
  benefits: readonly string[];
  faqs: readonly { q: string; a: string }[];
};

const cta = (name: string) =>
  `Book a ${name.toLowerCase()} consultation at our Nairobi CBD clinic and get a clear, personalised plan.`;

export const serviceDetails: Record<string, ServiceDetail> = {
  "acne-treatment": {
    headline: "Acne Treatment in Nairobi",
    intro:
      "Acne is more than a cosmetic concern — it is a medical skin condition. At Famart Healthcare we assess the type and severity of your acne, identify the triggers behind it and build a treatment plan that clears active breakouts while protecting your skin from scarring.",
    benefits: [
      "Medical-grade topical and oral acne therapy",
      "Care for teenage, adult and hormonal acne",
      "Post-acne scar and dark spot management",
      "Guidance on skincare products that suit Kenyan skin",
    ],
    faqs: [
      { q: "How long before my acne clears?", a: "Most patients notice a visible reduction in breakouts within 4–8 weeks. Deeper cystic acne and scarring take longer and are reviewed at follow-up visits." },
      { q: "Will the treatment leave dark marks?", a: "Treated early, acne is far less likely to leave marks. Where pigmentation already exists we add a fading protocol to your plan." },
      { q: "Do you treat adult and hormonal acne?", a: "Yes. Adult and hormonal acne needs a different approach from teenage acne, and we tailor therapy accordingly." },
    ],
  },
  "eczema-management": {
    headline: "Eczema Treatment and Management in Nairobi",
    intro:
      "Eczema flares are unpredictable, itchy and exhausting. Our dermatology team focuses on calming the current flare quickly and then keeping your skin stable with a long-term maintenance routine you can actually follow.",
    benefits: [
      "Rapid relief for itching and inflammation",
      "Child and adult eczema care",
      "Trigger identification and avoidance advice",
      "Moisturiser and barrier-repair routines",
    ],
    faqs: [
      { q: "Is eczema curable?", a: "Eczema is a long-term condition, but with the right plan it can be controlled so well that flares become rare and mild." },
      { q: "Can you treat eczema in babies and children?", a: "Yes. We regularly manage childhood eczema with gentle, age-appropriate treatment." },
      { q: "How often should I come for review?", a: "Usually every 4–8 weeks at first, then less often once your skin is stable." },
    ],
  },
  "psoriasis-treatment": {
    headline: "Psoriasis Treatment in Nairobi",
    intro:
      "Psoriasis affects the skin, scalp and confidence. We use evidence-based therapy to reduce plaques and scaling, control flares and keep the condition in remission for as long as possible.",
    benefits: [
      "Plaque, scalp and nail psoriasis care",
      "Topical, systemic and combination therapy",
      "Flare-prevention and lifestyle guidance",
      "Structured review to monitor progress",
    ],
    faqs: [
      { q: "Is psoriasis contagious?", a: "No. Psoriasis is an immune-driven condition and cannot be passed to another person." },
      { q: "What triggers a psoriasis flare?", a: "Stress, infections, some medicines, skin injury and weather changes are common triggers. We help you identify yours." },
      { q: "Do you treat scalp psoriasis?", a: "Yes, scalp psoriasis is one of the most common presentations we see and it responds well to targeted treatment." },
    ],
  },
  "skin-allergy-treatment": {
    headline: "Skin Allergy Treatment in Nairobi",
    intro:
      "Hives, contact dermatitis and sudden reactions need a proper diagnosis, not guesswork. We work through your history and exposures to find the trigger, calm the reaction and prevent it happening again.",
    benefits: [
      "Treatment for hives, itching and swelling",
      "Contact and cosmetic allergy assessment",
      "Drug and food reaction review",
      "Prevention plan and emergency advice",
    ],
    faqs: [
      { q: "How do you find what I am allergic to?", a: "We take a detailed history of products, medicines, foods and exposures, examine the pattern of the rash and, where needed, arrange further testing." },
      { q: "How fast will the itching stop?", a: "Most acute reactions settle within days of starting treatment. Chronic hives need a longer, structured plan." },
      { q: "Are the medicines safe long term?", a: "Yes, when prescribed and monitored properly. We review your dose at every visit." },
    ],
  },
  "fungal-skin-infections": {
    headline: "Fungal Skin Infection Treatment in Nairobi",
    intro:
      "Ringworm, athlete's foot, nail fungus and yeast infections are often self-treated with the wrong creams for months. We confirm the diagnosis and prescribe the right antifungal at the right strength and duration.",
    benefits: [
      "Ringworm, tinea and candida treatment",
      "Nail and scalp fungal infection care",
      "Correct diagnosis before treatment",
      "Advice to stop reinfection at home",
    ],
    faqs: [
      { q: "Why does my ringworm keep coming back?", a: "Usually because treatment was stopped too early, the strength was too low, or household reinfection was not addressed. We tackle all three." },
      { q: "How long is treatment?", a: "Skin infections often clear in 2–4 weeks. Nail infections need several months of consistent treatment." },
      { q: "Is it contagious?", a: "Yes, most fungal skin infections spread by contact, so we also advise on protecting your family." },
    ],
  },
  "skin-rash-diagnosis": {
    headline: "Skin Rash Diagnosis in Nairobi",
    intro:
      "An unexplained rash can be anything from a simple irritation to a sign of an internal condition. Our consultation gives you a clear diagnosis and a treatment plan instead of another guess.",
    benefits: [
      "Thorough clinical examination",
      "History-led diagnosis of unclear rashes",
      "Referral for tests where needed",
      "Clear explanation of what your rash is",
    ],
    faqs: [
      { q: "What should I bring to the appointment?", a: "Bring any creams or medicines you have used, plus photos of the rash when it was at its worst." },
      { q: "Should I stop my current creams before coming?", a: "Where possible, pause steroid creams for a day or two so the rash can be seen clearly — unless it is severe." },
      { q: "Will I get a diagnosis on the same day?", a: "In most cases yes. Some rashes require tests, and we explain the next step clearly." },
    ],
  },
  "pigmentation-disorders": {
    headline: "Pigmentation and Dark Spot Treatment in Nairobi",
    intro:
      "Melasma, dark patches and uneven tone respond best to medically supervised treatment. We use safe, dermatologist-approved protocols — never skin-damaging bleaching products.",
    benefits: [
      "Melasma and hyperpigmentation care",
      "Post-inflammatory dark spot fading",
      "Safe treatment for deeper skin tones",
      "Sun protection and maintenance plan",
    ],
    faqs: [
      { q: "How long until my dark spots fade?", a: "Visible improvement usually starts at 6–12 weeks. Melasma is a long-term condition that needs maintenance." },
      { q: "Do you use skin-lightening creams?", a: "We never use unsafe bleaching agents. We prescribe regulated, evidence-based pigment therapy only." },
      { q: "Will it come back?", a: "It can, especially with sun exposure. Daily sunscreen and review visits keep results stable." },
    ],
  },
  "skin-consultation": {
    headline: "Dermatology Skin Consultation in Nairobi",
    intro:
      "A full one-on-one assessment of your skin with a qualified clinician. We listen to your concern, examine your skin properly and leave you with a written, personalised plan.",
    benefits: [
      "20–30 minute focused consultation",
      "Personalised treatment and skincare plan",
      "Honest advice on what is and is not needed",
      "Follow-up scheduling on the same day",
    ],
    faqs: [
      { q: "How long does a consultation take?", a: "Usually 20–30 minutes, longer for complex or multiple concerns." },
      { q: "Do I need to book in advance?", a: "Booking is recommended so we can reserve dedicated time, but walk-ins are welcome during working hours." },
      { q: "Will I get medication the same day?", a: "In most cases yes, your prescription is issued at the end of the consultation." },
    ],
  },
  "general-dermatology": {
    headline: "General Dermatology in Nairobi",
    intro:
      "Full-spectrum medical dermatology for adults and children — from everyday skin complaints to chronic conditions that need long-term management.",
    benefits: [
      "Adult and paediatric dermatology",
      "Chronic skin condition management",
      "Prescription and procedure-based care",
      "Coordinated follow-up over time",
    ],
    faqs: [
      { q: "Do you see children?", a: "Yes, we treat children of all ages with age-appropriate medication and dosing." },
      { q: "Can I be seen for more than one problem?", a: "Yes. Mention all your concerns at the start so we can allocate enough time." },
      { q: "Do you provide medical reports?", a: "Yes, we can issue a clinical summary or report on request." },
    ],
  },
  "cosmetic-skin-care": {
    headline: "Cosmetic Skin Care in Nairobi",
    intro:
      "Medically guided cosmetic care that improves glow, texture and tone without compromising skin health. Every treatment is chosen after a proper clinical assessment.",
    benefits: [
      "Skin texture and radiance treatments",
      "Doctor-led product recommendations",
      "Safe protocols for melanin-rich skin",
      "Realistic, staged treatment planning",
    ],
    faqs: [
      { q: "Are cosmetic treatments safe for dark skin?", a: "Yes, when chosen correctly. We use settings and products validated for melanin-rich skin to avoid pigmentation." },
      { q: "How many sessions will I need?", a: "It depends on the treatment and your goal — we set out the number and spacing at your first visit." },
      { q: "Is there downtime?", a: "Most of our cosmetic treatments have little or no downtime. We tell you in advance if any is expected." },
    ],
  },
  "hair-scalp-conditions": {
    headline: "Hair Loss and Scalp Treatment in Nairobi",
    intro:
      "Hair loss, thinning edges, dandruff and scalp inflammation all have treatable causes. We diagnose the cause first, then treat it — including traction alopecia from styling.",
    benefits: [
      "Hair loss and thinning assessment",
      "Dandruff and seborrheic dermatitis care",
      "Traction alopecia and edge restoration advice",
      "Scalp infection and itching treatment",
    ],
    faqs: [
      { q: "Can lost hair grow back?", a: "Often yes, especially when treated early and when the follicles are not permanently scarred." },
      { q: "Do you treat traction alopecia from braids?", a: "Yes, and we advise on styling changes that protect regrowth." },
      { q: "How soon will I see results?", a: "Hair grows slowly — expect the first meaningful change at 3–4 months." },
    ],
  },
  "mole-assessment": {
    headline: "Mole and Skin Lesion Assessment in Nairobi",
    intro:
      "Any mole that changes in size, shape, colour or sensation deserves a professional look. We examine moles and lesions carefully and advise on monitoring, removal or referral.",
    benefits: [
      "Careful examination of moles and lesions",
      "Early warning sign checks",
      "Removal advice where appropriate",
      "Peace of mind and documented review",
    ],
    faqs: [
      { q: "When should I worry about a mole?", a: "If it changes in size, shape or colour, has an irregular border, bleeds, itches or looks different from your other moles, have it checked." },
      { q: "Can the mole be removed on the same day?", a: "Some can. Others need planning or referral, which we explain during the assessment." },
      { q: "Does the check hurt?", a: "No, the examination itself is painless." },
    ],
  },
  "wart-removal": {
    headline: "Wart and Skin Tag Removal in Nairobi",
    intro:
      "Quick, clean in-clinic removal of warts, skin tags and small benign growths, with proper aftercare so the area heals neatly.",
    benefits: [
      "Same-visit removal in many cases",
      "Warts, skin tags and small growths",
      "Minimal discomfort and quick healing",
      "Aftercare instructions and review",
    ],
    faqs: [
      { q: "Is removal painful?", a: "Discomfort is brief and minimal; local anaesthetic is used where needed." },
      { q: "Will it leave a scar?", a: "Most removals heal with little or no visible mark when aftercare is followed." },
      { q: "Can warts come back?", a: "Warts are viral and can recur. We advise on reducing that risk and treat recurrences promptly." },
    ],
  },
  "skin-infection-treatment": {
    headline: "Skin Infection Treatment in Nairobi",
    intro:
      "Boils, cellulitis, impetigo and other bacterial or viral skin infections need prompt, correct treatment. We assess severity, start therapy quickly and review healing.",
    benefits: [
      "Bacterial and viral skin infection care",
      "Boils, abscesses and cellulitis treatment",
      "Correct antibiotic selection",
      "Wound care and healing review",
    ],
    faqs: [
      { q: "How urgent is a skin infection?", a: "Spreading redness, fever or severe pain needs to be seen the same day. Come in as soon as possible." },
      { q: "Will I need antibiotics?", a: "Only if the infection is bacterial. We avoid unnecessary antibiotics." },
      { q: "How long does healing take?", a: "Most straightforward infections improve within a week of correct treatment." },
    ],
  },
  "patient-follow-up": {
    headline: "Patient Follow-up Care in Nairobi",
    intro:
      "Treatment works best when it is reviewed. Our structured follow-up visits check your progress, adjust your plan and keep chronic conditions under control.",
    benefits: [
      "Scheduled progress reviews",
      "Treatment adjustment as your skin changes",
      "Long-term control of chronic conditions",
      "Ongoing relationship with your clinician",
    ],
    faqs: [
      { q: "How often should I come for follow-up?", a: "Typically every 4–8 weeks while treatment is being established, then less frequently." },
      { q: "What if my skin is already better?", a: "A short review still helps — it confirms the plan is working and prevents relapse." },
      { q: "Can I book follow-up on WhatsApp?", a: "Yes, send us a message and we will confirm your review slot." },
    ],
  },
};

export const serviceCta = cta;
