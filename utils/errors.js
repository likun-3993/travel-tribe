exports.err = (res, message, stats = 200) => {
  return res.status(stats).json({ success: false, message });
};
