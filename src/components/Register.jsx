import MemberSchema from "../utils/MemberSchemaValidation";
import { registerUser } from "../services/PostServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(MemberSchema),
  });

  const date = new Date();
  const currentYear = date.getFullYear();
  const years = [];
  for (let i = 1; i <= 5; i++) {
    years.push(currentYear + i);
  }

  const branches = ["1", "2", "3", "Main Boys", "Main Girls"];

  // const onSubmit = async (data) => {
  //   const formData = new FormData();
  //   for (const key in data) {
  //     if (key === "image") {
  //       formData.append(key, data[key][0]);
  //       continue;
  //     }
  //     formData.append(key, data[key]);
  //   }

  //   const res = await axios.post(
  //     "http://localhost:5000/api/auth/register",
  //     formData,
  //     { headers: { "Content-Type": "multipart/form-data" } }
  //   );
  //   // const res = await registerUser(data);
  //   console.log(res);
  // };
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "image") {
          formData.append(key, data[key][0]);
          continue;
        }
        formData.append(key, data[key]);
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} type="text" placeholder="Name" required />
      {errors.name && <p>{errors.name.message}</p>}
      <input {...register("email")} type="email" placeholder="Email" required />
      {errors.email && <p>{errors.email.message}</p>}
      <input
        {...register("contactNumber")}
        type="number"
        placeholder="Phone"
        required
      />
      {errors.contactNumber && <p>{errors.contactNumber.message}</p>}
      {years.map((year) => {
        return (
          <div key={year}>
            <input type="radio" id={year} {...register("batch")} value={year} />
            <label htmlFor={year}>{year}</label>
            <br />
          </div>
        );
      })}
      {errors.batch && <p>{errors.batch.message}</p>}
      {branches.map((branch) => {
        return (
          <div key={branch}>
            <input
              type="radio"
              id={branch}
              {...register("branch")}
              value={branch}
            />
            <label htmlFor={branch}>{branch}</label>
            <br />
          </div>
        );
      })}
      {errors.branch && <p>{errors.branch.message}</p>}
      <input {...register("image")} type="file" required />
      {errors.image && <p>{errors.image.message}</p>}
      <input
        {...register("reason")}
        type="text"
        placeholder="Reason"
        required
      />
      {errors.reason && <p>{errors.reason.message}</p>}
      <input
        {...register("socialLink")}
        type="url"
        placeholder="Social Link"
        required
      />
      {errors.socialLink && <p>{errors.socialLink.message}</p>}
      <input
        {...register("reference")}
        type="text"
        placeholder="Reference"
        required
      />
      {errors.reference && <p>{errors.reference.message}</p>}
      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Registering..." : "Submit"}
      </button>
    </form>
  );
};

export default Register;
