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

    const selectedData = allData.filter((item) => {
      return Object.keys(regex).every((key) => regex[key].test(item[key]));
    });

    results.totalLength = allData.length;
    results.results = selectedData.slice(startIndex, startIndex + limit);
    results.selectedLength = selectedData.length;
    return results;
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};
