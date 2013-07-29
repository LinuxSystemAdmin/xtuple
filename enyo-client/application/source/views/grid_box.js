/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true, white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, window:true,
Globalize:true */

(function () {

  enyo.kind({
    name: "XV.SalesOrderLineItemReadOnlyGridRow",
    kind: "XV.ReadOnlyGridRow",
    components: [
      {classes: "xv-grid-column line-number", components: [
        {name: "headerLineNumber", classes: "xv-grid-header", content: "#" },
        {name: "lineNumber"}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column grid-item", components: [
        {name: "headerItemSite", classes: "xv-grid-header", content: "_item".loc()},
        {name: "itemNumber"},
        {name: "itemDescription"},
        {name: "siteCode"},
      ]},
      {kind: "FittableRows", classes: "xv-grid-column quantity", components: [
        {name: "headerQuantity", classes: "xv-grid-header", content: "_quantity".loc()},
        {name: "quantity"},
        {name: "quantityUnit"}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column discount", components: [
        {name: "headerDiscount", classes: "xv-grid-header", content: "_discount".loc()},
        {name: "discount",}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column price", components: [
        {name: "headerPrice", classes: "xv-grid-header", content: "_price".loc()},
        {name: "price",},
          // scale: XT.SALES_PRICE_SCALE},
        {name: "priceUnit", classes: "xv-read-only" },
        {name: "extendedPrice"}
          //currencyDisabled: true, currencyShowing: false, scale: XT.EXTENDED_PRICE_SCALE}
      ]},
      {classes: "xv-grid-column schedule", components: [
        {name: "headerScheduleDate", classes: "xv-grid-header", content: "_schedDate".loc()},
        {name: "scheduleDate"}
      ]},
      {classes: "xv-grid-column grid-actions", components: [
        {name: "headerAction", classes: "xv-grid-header last", content: "_actions".loc()},
        {components: [
          {kind: "enyo.Button", classes: "icon-plus", name: "addGridRowButton" },
          {kind: "enyo.Button", classes: "icon-eye-open", name: "expandGridRowButton" },
          {kind: "enyo.Button", classes: "icon-remove", name: "deleteGridRowButton" }
        ]}
      ]}
    ],
    valueChanged: function () {
      var model = this.getValue();
      this.$.lineNumber.setContent(model.get("lineNumber"));
      this.$.itemNumber.setContent(model.getValue("item.number"));
      this.$.itemDescription.setContent(model.getValue("item.description1"));
      this.$.siteCode.setContent(model.getValue("site.code"));
      this.$.quantity.setContent(Globalize.format(XT.math.round(model.get("quantity"), XT.QTY_SCALE), "n" + XT.QTY_SCALE));
      this.$.quantityUnit.setContent(model.getValue("quantityUnit.name"));
      this.$.discount.setContent(Globalize.format(XT.math.round(model.get("discount"), XT.PERCENT_SCALE) * 100, "n" + XT.PERCENT_SCALE));

      this.$.price.setContent(Globalize.format(XT.math.round(model.get("price"), XT.SALES_PRICE_SCALE), "n" + XT.SALES_PRICE_SCALE));
      this.$.priceUnit.setContent(model.getValue("priceUnit.name"));
      this.$.extendedPrice.setContent(Globalize.format(XT.math.round(model.get("extendedPrice"),
        XT.EXTENDED_PRICE_SCALE), "n" + XT.EXTENDED_PRICE_SCALE));
      this.$.scheduleDate.setContent(Globalize.format(model.get("scheduleDate"), "d"));

    }
  });

  //
  // The implementation of GridRow and GridBox is here in the workspace kind.
  // We could move them to a grid_box.js if we want. It is currently the only
  // implementation of GridRow and GridBox. Once we have a second, we'll probably
  // want to generalize this code and move it to enyo-x.
  //
  var salesOrderGridRow = {
    name: "XV.SalesOrderLineItemGridRow",
    kind: "XV.GridRow",
    components: [
      // each field is grouped with its column header so that the alignment always
      // works out. All but the first column header will be invisible.
      {kind: "FittableRows", classes: "xv-grid-column line-number", components: [
        {name: "headerLineNumber", classes: "xv-grid-header", content: "#"},
        // Using XV.NumberWidget instead of XV.Number here (and below) because
        // of the pretty rounded corners, even though we have to hide the label with css
        {kind: "XV.NumberWidget", attr: "lineNumber"}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column grid-item", components: [
        {name: "headerItemSite", classes: "xv-grid-header", content: "_item".loc()},
        {kind: "XV.ItemSiteWidget", attr:
          {item: "item", site: "site"},
          name: "itemSiteWidget",
          query: {parameters: [
          {attribute: "item.isSold", value: true},
          {attribute: "item.isActive", value: true},
          {attribute: "isSold", value: true},
          {attribute: "isActive", value: true}
        ]}},
      ]},
      {kind: "FittableRows", classes: "xv-grid-column quantity", components: [
        {name: "headerQuantity", classes: "xv-grid-header", content: "_quantity".loc()},
        {kind: "XV.QuantityWidget", attr: "quantity"},
        {kind: "XV.UnitPickr", attr: "quantityUnit", name: "quantityUnitPicker" }
      ]},
      {kind: "FittableRows", classes: "xv-grid-column discount", components: [
        {name: "headerDiscount", classes: "xv-grid-header", content: "_discount".loc()},
        {kind: "XV.PercentWidget", name: "discount", attr: "discount" }
      ]},
      {kind: "FittableRows", classes: "xv-grid-column price", components: [
        {name: "headerPrice", classes: "xv-grid-header", content: "_price".loc()},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "price", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.SALES_PRICE_SCALE},
        {kind: "XV.UnitPickr", attr: "priceUnit", name: "priceUnitPicker"},
        {kind: "XV.MoneyWidget", attr:
          {localValue: "extendedPrice", currency: ""},
          currencyDisabled: true, currencyShowing: false, scale: XT.EXTENDED_PRICE_SCALE}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column schedule", components: [
        {name: "headerScheduleDate", classes: "xv-grid-header", content: "_schedDate".loc()},
        {kind: "XV.DateWidget", attr: "scheduleDate"}
      ]},
      {kind: "FittableRows", classes: "xv-grid-column grid-actions", components: [
        {name: "headerAction", classes: "xv-grid-header last", content: "_actions".loc()},
        {components: [
          {kind: "enyo.Button", classes: "icon-plus", name: "addGridRowButton" },
          {kind: "enyo.Button", classes: "icon-eye-open", name: "expandGridRowButton" },
          {kind: "enyo.Button", classes: "icon-remove", name: "deleteGridRowButton" }
        ]}
      ]}
    ]
  };

  enyo.mixin(salesOrderGridRow, XV.LineMixin);
  enyo.kind(salesOrderGridRow);

  enyo.kind({
    name: "XV.SalesOrderLineItemGridBox",
    kind: "XV.GridBox",
    associatedWorkspace: "XV.SalesOrderLineWorkspace",
    components: [
      {kind: "enyo.Scroller", name: "mainGroup", classes: "in-panel", fit: true, horizontal: "auto", components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_lineItems".loc()},
          {kind: "List", name: "aboveGridList", onSetupItem: "setupRowAbove", ontap: "gridRowTapAbove", components: [
            { kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "aboveGridRow"}
          ]},
          {kind: "XV.SalesOrderLineItemGridRow", name: "editableGridRow", showing: false},
          {kind: "List", name: "belowGridList", onSetupItem: "setupRowBelow", ontap: "gridRowTapBelow", components: [
            {kind: "XV.SalesOrderLineItemReadOnlyGridRow", name: "belowGridRow"}
          ]},
          {
            kind: "FittableColumns",
            name: "navigationButtonPanel",
            classes: "xv-groupbox-buttons",
            components: [
              {kind: "onyx.Button", name: "newButton", onclick: "newItem",
                content: "_new".loc(), classes: "xv-groupbox-button-center"}
            ]
          }
        ]},
        {kind: "XV.SalesSummaryPanel", name: "summaryPanel"}
      ]}
    ],

    /**
      Set the current model into Summary Panel.
    */
    valueChanged: function () {
      this.inherited(arguments);
      var model = this.value.salesOrder;
      this.$.summaryPanel.setValue(model);
    }
  });
}());
