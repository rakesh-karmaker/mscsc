import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { Stack, TextField } from "@mui/material";
import FormSubmitBtn from "@/components/ui/form-submit-btn";
import {
  contactSchema,
  type ContactSchemaType,
} from "@/lib/validation/contact-schema";
import { sendMessage } from "@/lib/api/message";

import "./contact-form.css";

export default function ContactForm() {
  const contactForm = useRef<HTMLFormElement | null>(null);
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

  const onSubmit = (data: ContactSchemaType) => {
    messageMutation.mutate(data);

    if (contactForm.current) {
      contactForm.current.reset();
    }
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

      <FormSubmitBtn
        isLoading={messageMutation.isPending}
        pendingText={"Sending"}
        width="100%"
      >
        Send the message
      </FormSubmitBtn>
      {errors.root && <p className="error-message">{errors.root.message}</p>}
    </form>
  );
}
