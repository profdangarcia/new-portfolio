import generalData from "@/lib/pageData/general";
import SocialLinks from "./SocialLinks";

interface FooterProps {
  locale: "pt" | "en";
}

export default function Footer({ locale }: FooterProps) {
  const { message } = generalData[locale].footer;

  return (
    <footer id="footer" className="bg-black py-14">
      <div className="container-portfolio flex flex-col items-center justify-between gap-6">
        <SocialLinks isBanner={false} />
        <p className="mt-8 text-center text-[#999]">{message}</p>
      </div>
    </footer>
  );
}
