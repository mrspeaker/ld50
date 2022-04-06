let id = 0;

export const make_ent = (model) => {
  return {
    model: model.clone(),
    id: id++,
  };
};
