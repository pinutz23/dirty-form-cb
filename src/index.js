class DirtyFormCb {
  inputs = [];

  constructor(form, cb, options) {
    this.form = form;
    this.cb = cb;
    this.inputs = [];

    this.isDirtyForm = false;

    this._getFormElements();
    this._getInitialValues();
    this._addEventListeners();
  }

  _getFormElements = () => {
    this.form.querySelectorAll("input").forEach(el => {
      this.inputs.push({ element: el, initialValue: null, isDirty: false });
    });
  };

  _getInitialValues = () => {
    this.inputs.forEach(input => {
      input.initialValue = input.element.value;
    });
  };

  _addEventListeners = () => {
    this.inputs.forEach(input => {
      input.element.addEventListener("input", e => {
        this.checkDirtyInput(e, input);
        this._checkDirtyForm();
        this.isDirtyForm && this.cb();
      });
    });
  };

  checkDirtyInput = ({ target: { value } }, input) => {
    input.isDirty = value !== input.initialValue;
  };

  _checkDirtyForm = () => {
    this.isDirtyForm = this.inputs.filter(input => input.isDirty).length > 0;
  };
}

const form = document.querySelector("form");
const dirtyForm = new DirtyFormCb(form, () => console.log("DIRTY!!"));
