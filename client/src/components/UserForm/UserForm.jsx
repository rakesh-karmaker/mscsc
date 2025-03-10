import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FileInput from "@/components/UI/FileInput/FileInput";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import "./UserForm.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import { registerUser } from "@/services/PostService";
import { NavLink, useNavigate } from "react-router-dom";
import { Checkbox, FormControlLabel, Stack, TextField } from "@mui/material";
import SelectInput from "@/components/UI/SelectInput";

const UserForm = (props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(props.schema),
    defaultValues: props?.data
      ? {
          name: props.data.name,
          email: props.data.email,
          password: "",
          contactNumber: props.data.contactNumber,
          branch: props.data.branch,
          reason: props.data.reason,
          socialLink: props.data.socialLink,
          batch: props.data.batch,
        }
      : undefined,
    mode: "onChange",
  });

  const userMutation = useMutation({
    mutationFn: (editedProps) => {
      const { method, setError, ...data } = editedProps;
      if (method === "register") {
        return registerUser(data);
      } else {
        data.slug = props.data.slug;
        return editUser(data);
      }
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
        window.scrollTo(0, 0);
      }
    },

    onError: (err) => {
      if (err.status === 409) {
        setError("email", {
          message: err.response.data.message,
        });
      } else {
        useErrorNavigator(true, err);
      }
      setError("root", {
        message: err.response.data.message,
      });
      toast.error(err.response.data.message);
    },
  });

  const onSubmit = async (data) => {
    data.email = data.email.toLowerCase().trim();
    data.name = data.name.trim();
    data.password = data.password.trim();
    userMutation.mutate({
      method: props?.isRegister ? "register" : "edit",
      setError,
      ...data,
    });
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

  const branches = [
    {
      value: "Branch - 1",
      label: "Branch - 1",
    },
    {
      value: "Branch - 2",
      label: "Branch - 2",
    },
    {
      value: "Branch - 3",
      label: "Branch - 3",
    },
    {
      value: "Main Boys",
      label: "Main Boys",
    },
    {
      value: "Main Girls",
      label: "Main Girls",
    },
  ];

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
          errors={errors.branch}
          dataList={branches}
        >
          School Branch
        </SelectInput>
      </Stack>

      <FileInput register={register("image")} errors={errors.image}>
        {props?.isRegister ? "Give us your formal photo:" : "Edit your photo:"}
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

        {props?.isRegister && (
          <TextField
            {...register("reference")}
            id="reference"
            label="Reference"
            variant="outlined"
            fullWidth
            error={!!errors.reference}
            helperText={errors.reference?.message}
          />
        )}
      </Stack>

      <div className="checkbox-submission">
        {props?.isRegister && <Consent register={register} errors={errors} />}
        <div className="submission">
          {props?.isRegister ? (
            <div className="state-redirect">
              <p>Already have an account?</p>
              <NavLink to="/auth/login">Login Now</NavLink>
            </div>
          ) : null}
          <SubmitBtn
            isLoading={userMutation.isPending}
            errors={errors}
            pendingText={props?.isRegister ? "Registering" : "Updating"}
          >
            {props?.isRegister ? "Register as a Member" : "Update"}
          </SubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
};

const Consent = ({ register, errors }) => {
  return (
    <div className="consent">
      <FormControlLabel
        control={<Checkbox {...register("consent", { required: true })} />}
        label={
          <span>
            I agree to the{" "}
            <NavLink to="/terms-of-service">Terms of Service</NavLink> and{" "}
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
          </span>
        }
      />

      {errors.consent && (
        <p className="error-message">{errors.consent.message}</p>
      )}
    </div>
  );
};

export default UserForm;
