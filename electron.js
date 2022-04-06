import { make_ent } from "./ent.js";

export const make_electron = (model, dir, speed) => {
  return {
    ...make_ent(model),
    dir,
    speed,
    output: false,
    update: update_electron    
  };
};

const update_electron = (e, dt, time) => {
  const { model, speed } = e;
  model.position.x += speed * dt;
};
