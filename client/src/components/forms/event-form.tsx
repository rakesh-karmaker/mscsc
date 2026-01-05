import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

export default function EventForm({
  defaultValues,
}: {
  defaultValues?: any;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: defaultValues || {},
  });

  function onSubmit(data: any) {
    if (isEditMode) {
      // Handle edit event logic
    } else {
      // Handle add event logic
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"></form>;
}
