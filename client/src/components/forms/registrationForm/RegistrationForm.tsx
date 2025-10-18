import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { Stack, TextField } from "@mui/material";
import { registerUser } from "@/lib/api/auth";
import { branches } from "@/services/data/data";
import {
  registerSchema,
  type RegisterSchemaType,
} from "@/lib/validation/registerSchema";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import Consent from "./Consent";
import SelectInput from "@/components/ui/SelectInput";
import type { AxiosError } from "axios";
import FormSubmitBtn from "@/components/ui/FormSubmitBtn";
import FileInput from "@/components/ui/fileInput/FileInput";

import "./userForm.css";

export default function RegistrationForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      branch: "",
    },
    mode: "onChange",
  });

  const userMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data?.data?.message);
      if (data?.data?.subject === "register") {
        localStorage.setItem("token", data?.data?.token);
        queryClient.invalidateQueries({ queryKey: ["members"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        navigate(`/member/${data?.data?.member?.slug}`, { replace: true });
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        window.scrollTo(0, 0);
      }
    },

    onError: (err: AxiosError<{ message: string }>) => {
      if (err.response?.status === 409) {
        setError("email", {
          message: err.response.data.message,
        });
      } else {
        useErrorNavigator(true, err);
      }
      setError("root", {
        message: err.response?.data.message,
      });
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    data.email = data.email.toLowerCase().trim();
    data.name = data.name.trim();
    data.password = data.password.trim();
    userMutation.mutate(data);
  };

  const date = new Date();
  const currentYear = date.getFullYear() - 1;
  const years = [];
  for (let i = 1; i <= 6; i++) {
    years.push({
      value: String(currentYear + i),
      label: currentYear + i,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("name")}
          id="name"
          label="Full Name"
          variant="outlined"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          placeholder="Enter your full name"
        />

        <TextField
          {...register("email")}
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("password")}
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          {...register("contactNumber")}
          id="contactNumber"
          label="Contact Number"
          variant="outlined"
          fullWidth
          error={!!errors.contactNumber}
          helperText={errors.contactNumber?.message}
          placeholder="Enter your phone number"
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("batch")}
          id="batch"
          label="SSC Batch"
          variant="outlined"
          fullWidth
          error={!!errors.batch}
          helperText={errors.batch?.message}
          placeholder="Enter your SSC batch"
        />
        <SelectInput
          control={control}
          name="branch"
          errors={errors}
          dataList={branches}
        >
          School Branch
        </SelectInput>
      </Stack>

      <FileInput register={register} name="image" errors={errors}>
        Give us your formal photo:
      </FileInput>

      <TextField
        {...register("reason")}
        id="reason"
        label="Your Reason"
        variant="outlined"
        fullWidth
        error={!!errors.reason}
        helperText={errors.reason?.message}
        multiline
        placeholder="Enter your reason to join MSCSC"
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("socialLink")}
          id="socialLink"
          label="Facebook Link"
          variant="outlined"
          fullWidth
          error={!!errors.socialLink}
          helperText={errors.socialLink?.message}
          placeholder="Enter your facebook profile link"
        />

        <TextField
          {...register("reference")}
          id="reference"
          label="Reference"
          variant="outlined"
          fullWidth
          error={!!errors.reference}
          helperText={errors.reference?.message}
          placeholder="Enter your reference's name else type N/A"
        />
      </Stack>

      <div className="checkbox-submission">
        <Consent register={register} errors={errors} />

        <div className="submission">
          <div className="state-redirect">
            <p>Already have an account?</p>
            <NavLink to="/auth/login">Login Now</NavLink>
          </div>

          <FormSubmitBtn
            isLoading={userMutation.isPending}
            pendingText={"Registering"}
          >
            Register as a Member
          </FormSubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
}
