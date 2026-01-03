import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Stack, TextField } from "@mui/material";
import { branches } from "@/services/data/data";
import { editUser } from "@/lib/api/member";
import { useUser } from "@/contexts/user-context";
import {
  editUserSchema,
  type EditUserSchemaType,
} from "@/lib/validation/edit-user-schema";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import useErrorNavigator from "@/hooks/use-error-navigator";
import type { AxiosError } from "axios";
import SelectInput from "../ui/select-input";
import FileInput from "../ui/file-input/file-input";
import HideImage from "./hide-image";
import FormSubmitBtn from "../ui/form-submit-btn";

import "./registration-form/user-form.css";

export default function UserEditForm({
  setIsEditing,
}: {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: "",
      contactNumber: user?.contactNumber,
      branch: user?.branch,
      reason: user?.reason,
      socialLink: user?.socialLink,
      batch: user?.batch,
      hideImage: user?.isImageHidden ? true : false,
    },
    mode: "onChange",
  });

  const userMutation = useMutation({
    mutationFn: (data: EditUserSchemaType) => {
      return editUser({
        ...data,
        new: data.image.length !== 0,
        slug: user?.slug || "",
      });
    },

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
        queryClient.invalidateQueries({ queryKey: ["members"] });
        setIsEditing(false);
        window.scrollTo(0, 0);
      }
    },

    onError: (err: AxiosError<{ message: string }>) => {
      if (err.status === 409) {
        setError("email", {
          message: err.response?.data.message || "Email already exists",
        });
      } else {
        useErrorNavigator(true, err);
      }
      setError("root", {
        message: err.response?.data.message || "An error occurred",
      });
      toast.error(err.response?.data.message || "An error occurred");
    },
  });

  const onSubmit = async (data: EditUserSchemaType) => {
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
        />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          {...register("batch")}
          id="batch"
          label="Batch"
          variant="outlined"
          fullWidth
          error={!!errors.batch}
          helperText={errors.batch?.message}
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
        Edit your photo:
      </FileInput>

      <TextField
        {...register("reason")}
        id="reason"
        label="Your Description"
        variant="outlined"
        fullWidth
        error={!!errors.reason}
        helperText={errors.reason?.message}
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
        />
      </Stack>

      <div className="checkbox-submission">
        <HideImage
          register={register}
          isHidden={user?.isImageHidden ? true : false}
        />

        <div className="submission">
          <FormSubmitBtn
            isLoading={userMutation.isPending}
            pendingText={"Updating"}
          >
            Update
          </FormSubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
        {user?.isImageVerified ? null : (
          <p className="user-form-note">
            *Unverified Image: To make your image verified and visible to other
            members, please give us a formal photo and contact with your
            executives.
          </p>
        )}
      </div>
    </form>
  );
}
