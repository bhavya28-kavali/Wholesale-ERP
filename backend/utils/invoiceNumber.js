export const nextSequence = async (Model, field, prefix) => {
  const latest = await Model.findOne().sort({ createdAt: -1 }).select(field);
  let num = 1;
  if (latest?.[field]) {
    const match = latest[field].match(/(\d+)$/);
    if (match) num = parseInt(match[1], 10) + 1;
  }
  return `${prefix}${String(num).padStart(5, '0')}`;
};
