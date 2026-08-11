import { createFileRoute } from "@tanstack/react-router";
import clinicImg from "@/assets/clinic-interior.jpg";
import { CtaBand, SectionHeading, StatsBand, WhyChooseUs } from "@/components/sections";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Famart Healthcare | Skin & Dermatology Clinic in Nairobi Pipeline" },
      {
        name: "description",
        content:
          "Learn about Famart Healthcare Medical and Skin Clinic — a Nairobi Pipeline dermatology practice built on compassionate care, evidence-based treatment and personalised skin health plans.",
      },
      { property: "og:title", content: "About Famart Healthcare Medical and Skin Clinic" },
      {
        property: "og:description",
        content:
          "A Nairobi Pipeline dermatology practice built on compassionate care, evidence-based treatment and personalised skin health plans.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "About Famart Healthcare Medical and Skin Clinic" },
      {
        name: "twitter:description",
        content: "Compassionate, evidence-based dermatology care in Nairobi Pipeline.",
      },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const values = [
  {
    title: "Compassionate healthcare",
    body: "Skin conditions affect confidence as much as comfort. We listen without judgement and treat every patient with dignity, warmth and privacy.",
  },
  {
    title: "Evidence-based treatment",
    body: "Our protocols follow current dermatological evidence and clinical guidelines — no guesswork, no unnecessary products, no shortcuts.",
  },
  {
    title: "Personalised care",
    body: "Your skin, history and lifestyle are unique. Each plan is tailored to you and reviewed at follow-up so treatment keeps working.",
  },
];

function About() {
  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-24">
          <Reveal className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">
              About Us
            </span>
            <h1 className="mt-5 text-4xl font-bold text-balance sm:text-5xl">
              Quality dermatology care, delivered with heart
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {SITE.name} is a medical and skin clinic in Nairobi Pipeline dedicated to helping patients
              achieve healthy, comfortable skin through expert diagnosis and modern treatment.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              center={false}
              title="Our commitment"
              subtitle="We exist to make specialist skin care accessible to everyone in Nairobi — without compromising on clinical standards."
            />
            <Reveal delay={100} className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                From the first consultation, our focus is a clear diagnosis. We assess your skin
                thoroughly, explain what we find, and agree on a treatment plan you understand and
                can realistically follow.
              </p>
              <p>
                Whether it is a stubborn case of acne, a chronic condition such as eczema or
                psoriasis, or an unexplained rash that needs answers, our team brings clinical
                experience and modern practice to every visit.
              </p>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[2rem] border shadow-lift">
              <img
                src={clinicImg}
                alt="Consultation room interior at Famart Healthcare Medical and Skin Clinic"
                loading="lazy"
                width={1200}
                height={912}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal as="li" key={v.title} delay={i * 90}>
              <div className="h-full rounded-3xl border bg-card p-7 shadow-soft">
                <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-20">
          <StatsBand />
        </div>
      </section>

      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="What sets our clinic apart"
            subtitle="Eight reasons patients across Nairobi choose Famart Healthcare for their skin."
          />
          <div className="mt-14">
            <WhyChooseUs />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <CtaBand />
      </section>
    </>
  );
}
