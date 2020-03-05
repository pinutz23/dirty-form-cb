const defaultOptions = {
  runCbInitially: true
};

class DirtyFormCb {
  constructor(form, cb, options = defaultOptions) {
    this.form = form;
    this.cb = cb;
    this.fields = [];
    this.options = options;

    this.isDirtyForm = false;

    this._getFormElements();
    this._getInitialValues();
    this._addEventListeners();

    this.options.runCbInitially && this.cb(this.isDirtyForm);
  }

  _getFormElements = () => {
    this.form
      .querySelectorAll(
        `
        input:not([type='submit']):not([type='reset']):not([type='hidden']),
        textarea,
        select
      `
      )
      .forEach(el => {
        this.fields.push({ element: el, initialValue: null, isDirty: false });
      });
  };

  _getInitialValues = () => {
    this.fields.forEach(field => {
      field.initialValue = this._getFieldValue(field.element);
    });
  };

  _addEventListeners = () => {
    this.fields.forEach(field => {
      field.element.addEventListener("input", e => {
        this.checkDirtyField(e, field);
        this._checkDirtyForm();
        this.cb(this.isDirtyForm);
      });
    });
  };

  checkDirtyField = ({ target }, field) => {
    field.isDirty = this._getFieldValue(target) !== field.initialValue;
  };

  _checkDirtyForm = () => {
    this.isDirtyForm = this.fields.filter(field => field.isDirty).length > 0;
  };

  _getFieldValue = field => {
    switch (field.type) {
      case "radio":
      case "checkbox":
        return field.checked;
      default:
        return field.value;
    }
  };
}

const form = document.querySelector("form");
const dirtyForm = new DirtyFormCb(form, dirty => {
  console.log(dirty);
  document.querySelector("input[type='submit']").disabled = !dirty;
});
