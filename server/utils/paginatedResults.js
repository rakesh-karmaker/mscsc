exports.paginatedResults = async (req, res, model, regex, sorted) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || null;
  const startIndex = (page - 1) * limit;
  const results = {};
  try {
    const allData = await model
      .find()
      .sort({ ...sorted })
      .exec();

    const startsWithData = allData.filter((item) => {
      return Object.keys(regex).every(
        (key) =>
          regex[key].test(item[key]) &&
          item[key].toLowerCase().startsWith(req.query[key].toLowerCase())
      );
    });
    const includesData = allData.filter((item) => {
      return Object.keys(regex).every((key) => regex[key].test(item[key]));
    });
    const selectedData = [...new Set([...startsWithData, ...includesData])];

    results.totalLength = allData.length;
    results.results = selectedData.slice(startIndex, startIndex + limit);
    results.selectedLength = selectedData.length;
    return results;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
