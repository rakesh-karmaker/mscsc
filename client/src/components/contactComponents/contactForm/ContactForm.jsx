import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import contactSchema from "@/utils/ContactSchema";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import { useRef } from "react";
import "./ContactForm.css";
import { useMutation } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { Stack, TextField } from "@mui/material";
import { sendMessage } from "@/lib/api/messages";

const ContactForm = () => {
  const contactForm = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    console.log(data);
    messageMutation.mutate(data);
    contactForm.current.reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="contact-form"
      ref={contactForm}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ maxWidth: "100%" }}
      >
        <TextField
          {...register("name")}
          id="name"
          label="Full Name"
          variant="standard"
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth
        />

        <TextField
          {...register("email")}
          id="email"
          label="Email"
          variant="standard"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
      </Stack>

      <TextField
        {...register("subject")}
        id="subject"
        variant="standard"
        error={!!errors.subject}
        helperText={errors.subject?.message}
        fullWidth
        label="Subject"
      />

      <TextField
        {...register("message")}
        id="message"
        variant="standard"
        multiline
        rows={4}
        fullWidth
        error={!!errors.message}
        helperText={errors.message?.message}
        label="Write your message here"
      />

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
