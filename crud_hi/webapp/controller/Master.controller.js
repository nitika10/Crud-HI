sap.ui.define(
  ['sap/ui/core/mvc/Controller'],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    'use strict'

    return Controller.extend('com.crud.hi.crudhi.controller.Master', {
      onInit: function () {},

      onCreate: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo('create')
      },

      // onSearch: function (oEvent) {
      //   var aFilter = []
      //   var sInput = oEvent.getParameter('newValue')
      //   var oList = this.byId('listId')
      //   var filterbyId
      //   filterbyId = new sap.ui.model.Filter(
      //     'EmpId',
      //     sap.ui.model.FilterOperator.Contains,
      //     sInput,
      //   )
      //   aFilter.push(filterbyId)
      //   let fFilter = new sap.ui.model.Filter({
      //     filters: aFilter,
      //     and: false,
      //   })
      //   oList.getBinding('items').filter(fFilter)
      //   console.log(aFilter)
      //   console.log(oEvent)
      // },

      onPress: function (oEvent) {
        let oItem = oEvent.getSource()
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter.navTo('detail', {
          EmpId: window.encodeURIComponent(
            oItem.getBindingContext().getObject().EmpId,
          ),
        })
      },
    })
  },
)
