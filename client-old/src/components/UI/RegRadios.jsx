import RadioList from "@/components/UI/RadioList/RadioList";

const YearRadio = ({ register, errors }) => {
  const date = new Date();
  const currentYear = date.getFullYear() - 1;
  const years = [];
  for (let i = 1; i <= 6; i++) {
    years.push(currentYear + i);
  }

  return (
    <RadioList
      register={register("batch")}
      errors={errors.batch}
      dataList={years}
    >
      SSC Batch:
    </RadioList>
  );
};

const BranchRadio = ({ register, errors }) => {
  const branches = [
    "Branch - 1",
    "Branch - 2",
    "Branch - 3",
    "Main Boys",
    "Main Girls",
  ];

  return (
    <RadioList
      register={register("branch")}
      errors={errors.branch}
      dataList={branches}
    >
      School Branch:
    </RadioList>
  );
};

export { YearRadio, BranchRadio };
