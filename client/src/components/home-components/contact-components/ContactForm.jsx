import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import contactSchema from "@/utils/ContactSchema";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // const apiKey = process.env.REACT_APP_WEB3FORM_API_KEY;
  const apiKey = import.meta.VITE_WEB3FORM_API_KEY;

  const onSubmit = async (data) => {
    const formData = new FormData(data);

    formData.append(apiKey, "YOUR_ACCESS_KEY_HERE");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      console.log("Success", res);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
      <div className="combined-inputs">
        <InputText register={register} errors={errors.name} id="name">
          Full Name
        </InputText>
        <InputText
          type="email"
          register={register}
          errors={errors.email}
          id="email"
        >
          Email
        </InputText>
      </div>

      <InputText register={register} errors={errors.subject} id="subject">
        Subject
      </InputText>

      <TextArea register={register("message")} errors={errors.message}>
        Write your message here...
      </TextArea>

      {/* <!-- Honeypot Spam Protection --> */}
      <input type="checkbox" name="botcheck" className="hidden" />

      <SubmitBtn
        isSubmitting={isSubmitting}
        pendingText={"Sending..."}
        width="100%"
      >
        Send the message
      </SubmitBtn>
      {errors.root && <p className="error-message">{errors.root.message}</p>}
    </form>
  );
};

export default ContactForm;
