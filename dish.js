import { make_ent } from "./ent.js";

const comp_spin = (dir, speed) => {};

export const make_dish = (model, dir) => {
  return {
    ...make_ent(model),
    running: true,
    freq: 1,
    freq_t: 0,
    output: 0,
    dir,
    update: dish_update_and_render
  };
};

const dish_update_and_render = (dish, dt, time) => {
  update_dish(dish, dt, time);
  render_dish(dish);
};

const update_dish = (dish, dt, time) => {
   const { running, freq, model, dir } = dish;
    if (!running) return;
    const freq_in = 1 / freq;
    dish.freq_t += dt;

    if (dish.freq_t > freq_in) {
      dish.freq_t -= freq_in;
      // Trigger.
      dish.output = 1;
    } else {
      dish.output = 0;
    }

};

const render_dish = dish => {
  const { model, freq, freq_t, dir } = dish;
  model.rotation.y = (freq_t / (1/freq)) * Math.PI * 2;
  model.rotation.y -= dir;  
};

