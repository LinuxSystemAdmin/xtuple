/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  enyo.kind({
    name: "XV.PickerWidget",
    kind: "enyo.Control",
    classes: "xv-pickerwidget",
    events: {
      onValueChange: ""
    },
    published: {
      attr: null,
      label: "",
      value: null,
      collection: null,
      disabled: false,
      idAttribute: "id",
      nameAttribute: "name",
      valueAttribute: null
    },
    handlers: {
      onSelect: "itemSelected"
    },
    components: [
      {kind: "FittableColumns", components: [
        {name: "label", content: "", classes: "xv-picker-label"},
        {kind: "onyx.InputDecorator", classes: "xv-input-decorator",
          components: [
          {kind: "onyx.PickerDecorator",
            components: [
            {content: "_none".loc(), classes: "xv-picker"},
            {name: "picker", kind: "onyx.Picker"}
          ]}
        ]}
      ]}
    ],
    buildList: function () {
      var nameAttribute = this.getNameAttribute(),
        models = this.filteredList(),
        name,
        model,
        i;
      this.$.picker.destroyClientControls();
      this.$.picker.createComponent({
        value: null,
        content: "_none".loc()
      });
      for (i = 0; i < models.length; i++) {
        model = models[i];
        name = model.get(nameAttribute);
        this.$.picker.createComponent({ value: model, content: name });
      }
      this.render();
    },
    clear: function (options) {
      this.setValue(null, options);
    },
    collectionChanged: function () {
      var collection = XT.getObjectByName(this.collection),
        callback,
        didStartup = false,
        that = this;
        
      // If we don't have data yet, try again after start up tasks complete
      if (!collection) {
        if (didStartup) {
          XT.log('Could not find collection ' + this.getCollection());
          return;
        }
        callback = function () {
          didStartup = true;
          that.collectionChanged();
        };
        XT.getStartupManager().registerCallback(callback);
        return;
      }
      this._collection = collection;
      this.buildList();
    },
    create: function () {
      this.inherited(arguments);
      if (this.getCollection()) { this.collectionChanged(); }
      this.labelChanged();
    },
    disabledChanged: function (inSender, inEvent) {
      this.$.pickerButton.setDisabled(this.getDisabled());
    },
    itemSelected: function (inSender, inEvent) {
      var value = this.$.picker.getSelected().value,
        attribute = this.getValueAttribute();
      this.setValue(attribute ? value[attribute] : value);
    },
    /**
      Implement your own filter function here. By default
      simply returns the array of models passed.
      
      @param {Array}
      returns {Array}
    */
    filter: function (models) {
      return models || [];
    },
    /**
      Returns array of models for current collection instance with `filter`
      applied.
    */
    filteredList: function () {
      return this._collection ? this.filter(this._collection.models) : [];
    },
    labelChanged: function () {
      var label = this.getLabel() ||
        (this.attr ? ("_" + this.attr).loc() + ":" : "");
      this.$.label.setShowing(label);
      this.$.label.setContent(label);
    },
    /**
      Programatically sets the value of this widget.

      @param value Can be a model or the id of a model (String or Number).
        If it is an ID, then the correct model will be fetched and this
        function will be called again recursively with the model.
      @param options {Object}
     */
    setValue: function (value, options) {
      options = options || {};
      var inEvent,
        oldValue = this.getValue(),
        actualModel;

      // here is where we find the model and re-call this method if we're given
      // an id instead of a whole model.
      // note that we assume that all of the possible models are already
      // populated in the menu items of the picker
      if (value && typeof value !== 'object') {
        actualModel = _.find(this.$.picker.controls, function (menuItem) {
          return menuItem.value && menuItem.value.id === value;
        }).value;
        this.setValue(actualModel);
        return;
      }

      if (value !== oldValue) {
        if (!this._selectValue(value)) { value = null; }
        if (value !== oldValue) {
          this.value = value;
          if (!options.silent) {
            inEvent = { originator: this, value: value };
            this.doValueChange(inEvent);
          }
        }
      }
    },
    /** @private */
    _selectValue: function (value) {
      value = (!value || this.getValueAttribute()) ? value : value.id;
      var component = _.find(this.$.picker.getComponents(), function (c) {
        if (c.kind === "onyx.MenuItem") {
          return (c.value ? c.value.id : null) === value;
        }
      });
      if (!component) { value = null; }
      this.$.picker.setSelected(component);
      return value;
    }
  });
  
}());
