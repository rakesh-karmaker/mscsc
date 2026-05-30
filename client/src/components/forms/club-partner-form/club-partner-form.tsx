import DeleteWarning from "@/components/ui/delete-warning";
import FileInput from "@/components/ui/file-input";
import SelectInput from "@/components/ui/select-input";
import useClubPartnerMutation from "@/hooks/event-hooks/use-club-partner-mutation";
import {
  clubPartnerSchema,
  type ClubPartnerFormData,
} from "@/lib/validation/club-partner-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";

export default function ClubPartnerForm({
  defaultValues,
  setOpen,
  setClubPartnerModelOpen,
  documentId,
}: {
  defaultValues?: Omit<ClubPartnerFormData, "clubLogo"> & {
    clubLogoUrl?: string;
  };
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setClubPartnerModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  documentId?: string;
}): ReactNode {
  const isEditMode = Boolean(defaultValues);
  const eventSlug = useParams().eventSlug!;
  const cPartnerMutation = useClubPartnerMutation(setClubPartnerModelOpen);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    // setError,
    formState: { errors },
  } = useForm<ClubPartnerFormData>({
    resolver: zodResolver(clubPartnerSchema),
    defaultValues: {
      clubName: defaultValues?.clubName || "",
      clubEmail: defaultValues?.clubEmail || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      facebookUrl: defaultValues?.facebookUrl || "",
      institution: defaultValues?.institution || "",
      address: defaultValues?.address || "",
      moderatorName: defaultValues?.moderatorName || "",
      moderatorEmail: defaultValues?.moderatorEmail || "",
      moderatorPhoneNumber: defaultValues?.moderatorPhoneNumber || "",
      code: defaultValues?.code || "",
      status: defaultValues?.status || "active",
    },
  });

  function onSubmit(data: ClubPartnerFormData) {
    if (isEditMode) {
      cPartnerMutation.mutate({
        method: "edit",
        clubPartnerId: documentId as string,
        data: {
          formData: data,
        },
      });
    } else {
      cPartnerMutation.mutate({
        method: "create",
        data: {
          formData: data,
        },
      });
    }
    // setClubPartnerModelOpen(false);
  }

  function onDelete() {
    cPartnerMutation.mutate({
      method: "delete",
      clubPartnerId: documentId as string,
    });
    setClubPartnerModelOpen(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-5">
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("clubName")}
              id="clubName"
              label="Club Name"
              variant="outlined"
              fullWidth
              error={!!errors.clubName}
              helperText={errors.clubName?.message}
              placeholder="Enter the club name"
            />

            <TextField
              {...register("clubEmail")}
              id="clubEmail"
              label="Club Email"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.clubEmail}
              helperText={errors.clubEmail?.message}
              placeholder="eg. club@institution.edu"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("phoneNumber")}
              id="phoneNumber"
              label="Phone Number"
              variant="outlined"
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              placeholder="Enter the phone number"
            />

            <TextField
              {...register("facebookUrl")}
              id="facebookUrl"
              label="Facebook Link"
              variant="outlined"
              fullWidth
              error={!!errors.facebookUrl}
              helperText={errors.facebookUrl?.message}
              placeholder="eg. https://www.facebook.com/yourclubpage"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("institution")}
              id="institution"
              label="Institution"
              variant="outlined"
              fullWidth
              error={!!errors.institution}
              helperText={errors.institution?.message}
              placeholder="Enter the institution name"
            />

            <TextField
              {...register("address")}
              id="address"
              label="Address"
              variant="outlined"
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message}
              placeholder="Enter the club's address"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("moderatorName")}
              id="moderatorName"
              label="Moderator Name (Optional)"
              variant="outlined"
              fullWidth
              error={!!errors.moderatorName}
              helperText={errors.moderatorName?.message as string}
              placeholder="Enter the club's moderator name"
            />

            <TextField
              {...register("moderatorEmail")}
              id="moderatorEmail"
              label="Moderator Email (Optional)"
              type="email"
              variant="outlined"
              fullWidth
              error={!!errors.moderatorEmail}
              helperText={errors.moderatorEmail?.message as string}
              placeholder="eg. moderator@club.com"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              {...register("moderatorPhoneNumber")}
              id="moderatorPhoneNumber"
              label="Moderator Phone Number (Optional)"
              variant="outlined"
              fullWidth
              error={!!errors.moderatorPhoneNumber}
              helperText={errors.moderatorPhoneNumber?.message as string}
              placeholder="Enter the club's moderator phone number"
            />

            <TextField
              {...register("code")}
              id="code"
              label="Club Code"
              variant="outlined"
              fullWidth
              error={!!errors.code}
              helperText={errors.code?.message}
              placeholder="eg. CLUB123"
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SelectInput
              name="status"
              control={control}
              errors={errors}
              dataList={[
                {
                  value: "active",
                  label: "Active",
                },
                {
                  value: "inactive",
                  label: "Inactive",
                },
              ]}
            >
              Set Status
            </SelectInput>

            <FileInput
              register={register}
              name="clubLogo"
              errors={errors}
              labelText="Club Logo:"
            >
              Add Logo
            </FileInput>
          </Stack>
        </div>
        <div className="edit-dialog-actions flex flex-wrap gap-2.5">
          {isEditMode ? (
            <>
              <button
                type="submit"
                className="primary-button text-[1em]! py-1.5! px-3.5! w-fit! h-fit!"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Save
              </button>

              <button
                className="danger-button primary-button text-[1em]! py-1.5! px-3.5! w-fit! h-fit!"
                aria-label="Delete this data"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="primary-button text-[1em]! py-1.5! px-3.5! w-fit! h-fit!"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Add Club Partner
            </button>
          )}
        </div>
      </form>

      <DeleteWarning
        slug={eventSlug}
        deleteFunc={onDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Club Partner"
      >
        This will permanently delete this club partner from the teams list and
        remove all of their data from the server. All of their images, links,
        and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
}
