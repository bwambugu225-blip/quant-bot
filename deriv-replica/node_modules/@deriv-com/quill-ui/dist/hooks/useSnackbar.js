import { useContext as t } from "react";
import { SnackbarContext as a } from "../providers/snackbar/snackbarContext.js";
const m = () => {
  const { queue: r, addSnackbar: e, removeSnackbar: o } = t(a);
  return { queue: r, addSnackbar: e, removeSnackbar: o };
};
export {
  m as useSnackbar
};
