exports.paginatedResults = async (req, model, regex, length, sorted) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || null;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  if (endIndex < length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  try {
    results.results = await model
      .find({ ...regex })
      .limit(limit)
      .skip(startIndex)
      .sort({ ...sorted })
      .exec();
    results.totalLength = length;
    return results;
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
