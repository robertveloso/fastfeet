export async function deleteAndCreate(model, where, newItem) {
  await model.destroy({ where });
  const item = await model.create(newItem);
  return { item, created: true };
}

export async function updateOrCreate(model, where, newItem) {
  // First try to find the record
  const foundItem = await model.findOne({ where });
  if (!foundItem) {
    // Item not found, create a new one
    const item = await model.create(newItem);
    return { item, created: true };
  }
  // Found an item, update it
  const item = await model.update(newItem, { where });
  return { item, created: false };
}
