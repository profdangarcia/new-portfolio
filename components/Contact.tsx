import SectionTitle from "./SectionTitle";
import ContactForm from "./ContactForm";

interface ContactProps {
  title: string;
  description: string;
  form: {
    error: string;
    success: string;
    default: string;
    name: { placeholder: string; error: string };
    email: { placeholder: string; error: string; errorInvalid: string };
    message: { placeholder: string; error: string };
  };
}

export default function Contact({ title, description, form }: ContactProps) {
  return (
    <section id="contact" className="bg-[var(--background)] py-[1.875rem] pb-[4.375rem]">
      <div className="container-portfolio">
        <SectionTitle title={title} description={description} />
        <ContactForm data={form} />
      </div>
    </section>
  );
}
