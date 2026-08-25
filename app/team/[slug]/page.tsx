import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";
import BackButton from "@/components/BackButton";
import { TEAM_MEMBERS, waLink } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({ slug: member.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.id === slug);
  if (!member) return { title: "Team — Kamran Photo Studio" };
  return {
    title: `${member.name} — Kamran Photo Studio`,
    description: member.shortBio,
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.id === slug);
  if (!member) notFound();

  const others = TEAM_MEMBERS.filter((m) => m.id !== member.id);

  return (
    <main className="relative bg-obsidian">
      <Navbar />

      <section className="px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <BackButton fallbackHref="/#team" label="Back to the team" />
          </div>

          <div className="grid items-start gap-10 md:grid-cols-[320px_1fr] md:gap-14">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">
                {member.role}
              </p>
              <h1 className="mb-6 font-display text-4xl text-offwhite sm:text-5xl">
                {member.name}
              </h1>

              {member.story.map((paragraph, i) => (
                <p
                  key={i}
                  className="mb-4 text-sm leading-relaxed text-slate sm:text-base"
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-6 flex flex-wrap gap-2">
                {member.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-full border border-line px-3 py-1 text-xs text-slate"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <a
                href={waLink(
                  `Hi Kamran, I'd like to work with ${member.name} on a project.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-obsidian transition-transform hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                Book via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-gold">
            More from the team
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {others.map((teammate) => (
              <Link
                key={teammate.id}
                href={`/team/${teammate.id}`}
                className="group relative overflow-hidden rounded-xl border border-line bg-charcoal transition-colors hover:border-gold/50"
              >
                <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                  <Image
                    src={teammate.image}
                    alt={teammate.name}
                    fill
                    sizes="200px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-medium text-offwhite">{teammate.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gold">
                    {teammate.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactFooter />
    </main>
  );
}