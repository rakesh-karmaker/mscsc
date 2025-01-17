import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import contactSchema from "@/utils/ContactSchema";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { sendMessage } from "@/services/PostService";
import toast from "react-hot-toast";
import { useRef } from "react";
import "./ContactForm.css";
import { useMutation } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import useLoadingToast from "@/hooks/useLoadingToast";

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

  const messageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success("Message sent");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed to send message");
      useErrorNavigator(true, err);
    },
  });

  const onSubmit = (data) => {
    messageMutation.mutate(data);
    contactForm.current.reset();
  };

  useLoadingToast(messageMutation.isLoading, "Sending message...");

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
        isLoading={messageMutation.isPending}
        pendingText={"Sending"}
        width="100%"
      >
        Send the message
      </SubmitBtn>
      {errors.root && <p className="error-message">{errors.root.message}</p>}
    </form>
  );
};

export default ContactForm;
