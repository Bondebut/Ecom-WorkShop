const ALLOWED_SORT_FIELDS = ['createdAt', 'price', 'title'];

function buildFilter(query) {
  const { title, category, minPrice, maxPrice } = query;

  const where = {};

  if (title?.trim()) {
    where.title = {
      contains: title.trim(),
    };
  }

  if (category) {
    const categories = Array.isArray(category)
      ? category
      : category.split(',');
    where.categoryId = {
      in: categories.map((id) => Number(id)),
    };
  }

  const hasMin = !isNaN(parseFloat(minPrice));
  const hasMax = !isNaN(parseFloat(maxPrice));
  if (hasMin || hasMax) {
    where.price = {
      ...(hasMin && { gte: parseFloat(minPrice) }),
      ...(hasMax && { lte: parseFloat(maxPrice) }),
    };
  }

  return where;
}

function buildOrder(sort, order) {
  if (!sort || !order) {
    return [{ createdAt: 'desc' }]; // default
  }

  const sortFields = sort.split(',');
  const orderFields = order.split(',');

  const orderBy = sortFields
    .filter((key) => ALLOWED_SORT_FIELDS.includes(key)) // ป้องกัน sort field ผิด
    .map((key, i) => ({
      [key]: orderFields[i] || 'asc',
    }));

  return orderBy.length ? orderBy : [{ createdAt: 'desc' }];
}

module.exports = {
  buildFilter,
  buildOrder
};

