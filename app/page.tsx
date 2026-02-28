import { getLocaleCookie } from "@/app/actions/locale";
import homeData from "@/lib/pageData/home";
import Banner from "@/components/home/Banner";
import About from "@/components/home/About";
import TechSection from "@/components/home/TechSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import Contact from "@/components/home/Contact";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleCookie();
  const data = homeData[locale];
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dangarcia-devel.vercel.app";
  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: baseUrl + "/",
      images: [{ url: baseUrl + "/dev.png" }],
    },
    twitter: {
      title: data.seo.title,
      description: data.seo.description,
    },
    alternates: { canonical: baseUrl + "/" },
  };
}

export default async function Home() {
  const locale = await getLocaleCookie();
  const data = homeData[locale];

  return (
    <>
      <Banner lines={[...data.banner]} />
      <About title={data.about.title} messages={[...data.about.messages]} />
      <TechSection techs={[...data.techs]} />
      <PortfolioSection
        title={data.portfolio.title}
        description={data.portfolio.description}
        buttonText={data.portfolio.buttonText}
        projects={[...data.portfolio.projects]}
        tip={data.portfolio.tip}
      />
      <Contact
        title={data.contact.title}
        description={data.contact.description}
        form={data.contact.form}
      />
    </>
  );
}
