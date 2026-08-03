import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/Reveal";
import { SITE, bookingMessage, mapsLink, openWhatsApp, services, telLink } from "@/lib/site";

const searchSchema = z.object({ service: z.string().max(80).optional() });

export const Route = createFileRoute("/book")({
  component: Book,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book an Appointment | Famart Healthcare Skin Clinic Nairobi" },
      {
        name: "description",
        content:
          "Book a dermatology appointment at Famart Healthcare Medical and Skin Clinic in Nairobi CBD. Choose your date, time and service, or book instantly on WhatsApp.",
      },
      { property: "og:title", content: "Book an Appointment | Famart Healthcare Nairobi" },
      {
        property: "og:description",
        content: "Reserve your dermatology consultation in Nairobi CBD online or via WhatsApp.",
      },
      { property: "og:url", content: "/book" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Book an Appointment | Famart Healthcare Nairobi" },
      {
        name: "twitter:description",
        content: "Reserve your dermatology consultation in Nairobi CBD online or via WhatsApp.",
      },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
});

const formSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone number can only contain digits and + - ( )"),
  email: z.string().trim().email("Please enter a valid email address").max(255).or(z.literal("")),
  date: z.string().trim().min(1, "Please choose a preferred date").max(20),
  time: z.string().trim().min(1, "Please choose a preferred time").max(20),
  service: z.string().trim().min(1, "Please select a service").max(80),
  message: z.string().trim().max(1000, "Message must be under 1000 characters"),
});

type Errors = Partial<Record<keyof z.infer<typeof formSchema>, string>>;

function Book() {
  const { service } = Route.useSearch();
  const [errors, setErrors] = useState<Errors>({});
  const [confirmed, setConfirmed] = useState<z.infer<typeof formSchema> | null>(null);
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: service ?? "",
    message: "",
  });

  const set = (k: keyof typeof values) => (v: string) => setValues((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof Errors;
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      return null;
    }
    setErrors({});
    return parsed.data;
  };

  const summary = (d: z.infer<typeof formSchema>) => bookingMessage(d);

  const sendToWhatsApp = (d: z.infer<typeof formSchema>) => {
    const { prefilled } = openWhatsApp(summary(d));
    if (!prefilled) {
      toast.info("WhatsApp opened without a prefilled message", {
        description: `Please send: ${d.service} on ${d.date} at ${d.time}.`,
      });
    }
    return prefilled;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = validate();
    if (!data) {
      toast.error("Please check the highlighted fields.");
      return;
    }
    setConfirmed(data);
    const prefilled = sendToWhatsApp(data);
    if (prefilled) {
      toast.success("Appointment request confirmed", {
        description: `${data.service} — ${data.date} at ${data.time}. Sent to our WhatsApp.`,
      });
    }
  };

  const onWhatsApp = () => {
    const data = validate();
    if (!data) {
      openWhatsApp();
      return;
    }
    setConfirmed(data);
    sendToWhatsApp(data);
  };

  const resetForm = () => {
    setConfirmed(null);
    setValues({ name: "", phone: "", email: "", date: "", time: "", service: "", message: "" });
  };


  const field = (k: keyof Errors) =>
    errors[k] ? "border-destructive focus-visible:ring-destructive" : "";

  return (
    <>
      <section className="gradient-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:py-20">
          <Reveal className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-accent-foreground uppercase">
              Book Appointment
            </span>
            <h1 className="mt-5 text-4xl font-bold text-balance sm:text-5xl">
              Reserve your consultation
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Fill in your details and we will confirm your appointment. Prefer to chat? Send your
              booking straight to WhatsApp.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          {confirmed ? (
            <div className="rounded-[2rem] border bg-card p-7 shadow-soft sm:p-10">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <CheckCircle2 className="size-7" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold">
                Thank you, {confirmed.name.split(" ")[0]} — your request is confirmed
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your appointment details have been sent to our WhatsApp. Our team will confirm your
                slot shortly during working hours ({SITE.hours}). If the WhatsApp window did not
                open, tap the button below.
              </p>

              <dl className="mt-7 grid gap-4 rounded-2xl bg-surface p-6 text-sm sm:grid-cols-2">
                {[
                  ["Name", confirmed.name],
                  ["Phone", confirmed.phone],
                  ["Email", confirmed.email || "—"],
                  ["Service", confirmed.service],
                  ["Preferred date", confirmed.date],
                  ["Preferred time", confirmed.time],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium">{value}</dd>
                  </div>
                ))}
                {confirmed.message && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                      Message
                    </dt>
                    <dd className="mt-1 font-medium">{confirmed.message}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="whatsapp"
                  size="lg"
                  onClick={() => window.open(waLink(summary(confirmed)), "_blank", "noopener")}
                >
                  <MessageCircle /> Resend on WhatsApp
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={telLink}>
                    <Phone /> Call the clinic
                  </a>
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={resetForm}>
                  Book another appointment
                </Button>
              </div>
            </div>
          ) : (
            <form

            onSubmit={onSubmit}
            noValidate
            className="rounded-[2rem] border bg-card p-7 shadow-soft sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  value={values.name}
                  onChange={(e) => set("name")(e.target.value)}
                  maxLength={100}
                  autoComplete="name"
                  className={field("name")}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={values.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="+254 7XX XXX XXX"
                  className={field("phone")}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => set("email")(e.target.value)}
                  maxLength={255}
                  autoComplete="email"
                  className={field("email")}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Preferred date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={values.date}
                  onChange={(e) => set("date")(e.target.value)}
                  className={field("date")}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Preferred time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={values.time}
                  onChange={(e) => set("time")(e.target.value)}
                  className={field("time")}
                />
                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="service">Service required *</Label>
                <select
                  id="service"
                  value={values.service}
                  onChange={(e) => set("service")(e.target.value)}
                  className={`h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none ${field("service")}`}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  maxLength={1000}
                  value={values.message}
                  onChange={(e) => set("message")(e.target.value)}
                  placeholder="Briefly describe your skin concern"
                  className={field("message")}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="submit" variant="hero" size="lg">
                Request Appointment
              </Button>
              <Button type="button" variant="whatsapp" size="lg" onClick={onWhatsApp}>
                <MessageCircle /> Book on WhatsApp
              </Button>
            </div>
          </form>
          )}
        </Reveal>

        <Reveal delay={120}>
          <aside className="space-y-5">
            <div className="rounded-3xl border bg-surface p-7 shadow-soft">
              <h2 className="font-display text-lg font-semibold">Clinic details</h2>
              <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a href={mapsLink} target="_blank" rel="noreferrer" className="hover:text-primary">
                    {SITE.address}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                  <a href={telLink} className="hover:text-primary">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{SITE.hours}</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full">
                <a href={telLink}>
                  <Phone /> Call Now
                </a>
              </Button>
            </div>

            <div className="rounded-3xl gradient-brand p-7 text-primary-foreground shadow-lift">
              <h2 className="font-display text-lg font-semibold">Need it sooner?</h2>
              <p className="mt-2 text-sm opacity-90">
                Walk-in patients are welcome during working hours, but booked appointments are seen
                first.
              </p>
            </div>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
