import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import contactSchema from "@/utils/ContactSchema";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { sendMessage } from "@/services/PostService";
import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";

const ContactForm = () => {
  const contactForm = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    const res = await sendMessage(data);
    if (res.status === 200) {
      toast.success("Message sent");
    } else {
      toast.error("Failed to send message");
    }
    contactForm.current.reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-form"
      ref={contactForm}
    >
      <div className="combined-inputs">
        <InputText
          register={register}
          errors={errors.name}
          id="name"
          setValue={setValue}
          trigger={trigger}
        >
          Full Name
        </InputText>

        <InputText
          type="email"
          register={register}
          errors={errors.email}
          id="email"
          setValue={setValue}
          trigger={trigger}
        >
          Email
        </InputText>
      </div>

      <InputText
        register={register}
        errors={errors.subject}
        id="subject"
        setValue={setValue}
        trigger={trigger}
      >
        Subject
      </InputText>

      <TextArea register={register("message")} errors={errors.message}>
        Write your message here...
      </TextArea>

      <SubmitBtn
        isSubmitting={isSubmitting}
        pendingText={"Sending"}
        width="100%"
      >
        Send the message
      </SubmitBtn>
      {/* <button
        disabled={isSubmitting}
        type="submit"
        className="primary-button"
        style={{ width: "100%" }}
      >
        {isSubmitting ? "Sending..." : "Send the message"}
      </button> */}
      {errors.root && <p className="error-message">{errors.root.message}</p>}
      <Toaster position="top-right" />
    </form>
  );
};

export default ContactForm;
