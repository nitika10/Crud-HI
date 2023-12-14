sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
  ],
  function (Controller, JSONModel, MessageBox) {
    'use strict'

    return Controller.extend('com.crud.hi.crudhi.controller.Detail', {
      onInit: function () {
        //Route Setting
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter
          .getRoute('detail')
          .attachPatternMatched(this._onObjectMatched, this)
        oRouter.attachBeforeRouteMatched(this._onAttachBeforeRouteMatched, this)
        let selectedModel = new JSONModel()
        this.getOwnerComponent().setModel(selectedModel, 'employeeHI')
        let empItemModel = new JSONModel()
        this.getOwnerComponent().setModel(empItemModel, 'employeeItem')
      },

      _onObjectMatched: async function (oEvent) {
        let selectedEmpId = oEvent.getParameter('arguments').EmpId
        let oModel = this.getOwnerComponent().getModel()
        let oEmpData = await this._fetchEmpdataFromService(
          oModel,
          selectedEmpId,
        )
        this._bindDataToView(oEmpData)
      },

      _onAttachBeforeRouteMatched: function (oEvent) {
        let sRouteName = oEvent.getParameter('name')
        if (sRouteName === 'master') {
          this.getOwnerComponent().getModel('employeeHI').setData({})
          this.getOwnerComponent().getModel('employeeHI').refresh()
          this.getOwnerComponent().getModel('employeeItem').setData({})
          this.getOwnerComponent().getModel('employeeItem').refresh()
        }
      },
      //Employee_HDSet('01002')?$expand=headertoitemnav&$format=json
      _bindDataToView: function (data) {
        let empModel = this.getOwnerComponent().getModel('employeeHI')
        empModel.setData(data)
        let empArr = []
        empArr.push(data.headertoitemnav)
        this.getView().getModel('employeeItem').setData(empArr)
      },
      _fetchEmpdataFromService: async function (oModel, selectedEmpId) {
        return new Promise(function (resolve, reject) {
          // oModel.read('/Employee_HDSet(' + selectedEmpId + ')', {
          oModel.read(`/Employee_HDSet('${selectedEmpId}')`, {
            urlParameters: {
              $expand: 'headertoitemnav',
            },
            success: function (oData) {
              console.log(oData)
              // return oData
              resolve(oData)
            },
          })
        })
      },

      onUpdate: function (oEvent) {
        this.getOwnerComponent().getRouter().navTo('update')
      },

      dateDojFormat: function (oDate) {
        let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: 'EEE, MMM d, yyyy',
          // pattern: 'd MMM yyyy',
        })
        return oDateFormat.format(new Date(oDate))
      },

      onDelete: function (oEvent) {
        let that = this
        let oEmpHeaderModel = this.getView().getModel('employeeHI')
        // let oEmpItemModel = this.getView().getModel('empItemUpdate')
        let keyEmpId = oEmpHeaderModel.getData().EmpId
        let oEmpDeleteModel = this.getOwnerComponent().getModel()
        oEmpDeleteModel.remove(`/Employee_Emp_HIdSet('${keyEmpId}')`, {
          success: function (msg) {
            MessageBox.success('Deleted Successfully ' + keyEmpId)
            // that._validateResponse(msg.Message)
            oEmpDeleteModel.refresh(true)
            that.getOwnerComponent().getRouter().navTo('master')
          },
          error: function () {
            MessageBox.error('Error')
          },
        })
      },
    })
  },
)
