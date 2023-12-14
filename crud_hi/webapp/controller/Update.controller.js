sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/ui/core/Core',
    'sap/ui/core/library',
  ],
  function (Controller, JSONModel, MessageBox, Core, CoreLibrary) {
    'use strict'

    var ValueState = CoreLibrary.ValueState
    return Controller.extend('com.crud.hi.crudhi.controller.Update', {
      onInit: function () {
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter
          .getRoute('update')
          .attachPatternMatched(this._onObjectMatched, this)

        this.byId('doj_id').setMinDate(
          new Date(new Date().getTime() - 2629800000),
        )
        this.byId('doj_id').setMaxDate(
          new Date(new Date().getTime() + 2629800000),
        )

        this._iEvent = 0
        // let empUpdateModel = new JSONModel()
        // this.getOwnerComponent().setModel(empUpdateModel, 'empUpdate')
      },
      _onObjectMatched: function () {
        let oEmpHeaderModel = this.getOwnerComponent().getModel('employeeHI')
        let empHeaderData = structuredClone(oEmpHeaderModel.getData())
        let oEmpItemModel = this.getOwnerComponent().getModel('employeeItem')
        let empItemData = structuredClone(oEmpItemModel.getData())
        this._bSalaryInputValidity = empItemData[0]?.Salary ? true : false
        this._bAccountInputValidity = empItemData[0]?.AccountNo ? true : false
        let oEmpHeaderUpdateModel = new JSONModel(empHeaderData)
        this.getView().setModel(oEmpHeaderUpdateModel, 'empHeaderUpdate')
        let oEmpItemUpdateModel = new JSONModel(empItemData)
        this.getView().setModel(oEmpItemUpdateModel, 'empItemUpdate')
        console.log(empItemData)
        console.log(empHeaderData)
        // console.log(oEmpItemUpdateModel)
      },

      handleChange: function (oEvent) {
        var oText = this.byId('doj_id'),
          oDP = oEvent.getSource(),
          // sValue = oEvent.getParameter('value'),
          bValid = oEvent.getParameter('valid')
        this._iEvent++
        if (bValid) {
          oDP.setValueState(ValueState.None)
        } else {
          oDP.setValueState(ValueState.Error)
        }
      },

      onGender: function () {
        let oTable = new sap.m.Table({
          fixedLayout: false,
          mode: sap.m.ListMode.SingleSelectLeft,
          selectionChange: this._onSelectionChangeGender.bind(this),
        })
        oTable.bindAggregation('items', {
          path: '/GenderSet',
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: '{CodeG}' }),
              new sap.m.Text({ text: '{DescriptionG}' }),
            ],
          }),
        })
        oTable.addColumn(
          new sap.m.Column({
            header: new sap.m.Label({ text: 'Code' }),
          }),
        )
        oTable.addColumn(
          new sap.m.Column({
            header: new sap.m.Label({ text: 'Description' }),
          }),
        )
        oTable.addItem(
          new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: '{CodeG}' }),
              new sap.m.Text({ text: '{DescriptionG}' }),
            ],
          }),
        )
        this._oValueHelpDialog = new sap.m.Dialog({
          title: 'Gender',
        })
        this.getView().addDependent(this._oValueHelpDialog)
        this._oValueHelpDialog.addContent(oTable)
        this._oValueHelpDialog.open()
      },

      _onSelectionChangeGender: function (oEvent) {
        this.byId('gender_id').setValue(
          oEvent.getParameter('listItem').getBindingContext().getObject()
            .DescriptionG,
        )
        this._oValueHelpDialog.close()
      },

      onDept: function (oEvent) {
        // this.getOwnerComponent().getModel()
        let oTable = new sap.m.Table({
          fixedLayout: false,
          mode: sap.m.ListMode.SingleSelectLeft,
          selectionChange: this._onSelectionChangeDept.bind(this),
        })
        oTable.bindAggregation('items', {
          path: '/DepartmentSet',
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: '{Code}' }),
              new sap.m.Text({ text: '{Description}' }),
            ],
          }),
        })
        oTable.addColumn(
          new sap.m.Column({
            header: new sap.m.Label({ text: 'Code' }),
          }),
        )
        oTable.addColumn(
          new sap.m.Column({
            header: new sap.m.Label({ text: 'Description' }),
          }),
        )
        oTable.addItem(
          new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: '{Code}' }),
              new sap.m.Text({ text: '{Description}' }),
            ],
          }),
        )
        this._oValueHelpDialog = new sap.m.Dialog({
          title: 'Department',
        })
        this.getView().addDependent(this._oValueHelpDialog)
        this._oValueHelpDialog.addContent(oTable)
        this._oValueHelpDialog.open()
      },
      _onSelectionChangeDept: function (oEvent) {
        this.byId('dept_id').setValue(
          oEvent.getParameter('listItem').getBindingContext().getObject().Code,
        )
        this._oValueHelpDialog.close()
      },
      // dateDojDateFormat: function (oDate) {
      //   let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
      //     pattern: 'EEE, MMM d, yyyy',
      //   })
      //   return oDateFormat.format(new Date(oDate))
      // },
      onSave: function (oEvent) {
        let oEmpHeaderModel = this.getView().getModel('empHeaderUpdate')
        let oEmpItemModel = this.getView().getModel('empItemUpdate')
        let oEmpModel = this.getOwnerComponent().getModel()
        // console.log(oEmpModel)
        // console.log(oEmpModel.oData)
        let oPayload = {
          EmpId: oEmpHeaderModel.getData().EmpId,
          EmpName: oEmpHeaderModel.getData().EmpName,
          EmpDept: oEmpHeaderModel.getData().EmpDept,
          EmpMob: oEmpHeaderModel.getData().EmpMob,
          EmpGender: oEmpHeaderModel.getData().EmpGender,
          EmpDoj: oEmpHeaderModel.getData().EmpDoj,
          Salary: oEmpItemModel.getData()[0].Salary,
          AccountNo: oEmpItemModel.getData()[0].AccountNo,
        }

        let inputValid = this._validateInput(oPayload)
        if (inputValid) {
          let that = this
          oEmpModel.update(
            `/Employee_Emp_HIdSet('${oPayload.EmpId}')`,
            oPayload,
            {
              // method: 'PUT',
              success: function (oData, oResponse) {
                console.log(oData)
                console.log(oResponse)
                MessageBox.success('Updated Successfully')
                that._backToDetail(oPayload.EmpId)
                // that._validateResponse(msg.Message)
              },
              error: function (Response) {
                MessageBox.error(Response)
              },
            },
          )
        }
      },

      _backToDetail: function (EmpId) {
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter.navTo('detail', {
          EmpId: window.encodeURIComponent(EmpId),
        })
      },

      _validateInput: function (data) {
        if (!data.EmpName) {
          this.byId('name_id').setValueState('Error')
          this.byId('name_id').setValueStateText('Missing Employee Name.')
          this.byId('name_id').focus()
          return false
          // return 'Missing Employee Name.'
        } else {
          this.byId('name_id').setValueState('Success')
          this.byId('name_id').setValueStateText(null)
        }
        if (!data.Salary) {
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[1]
            .setValueState('Error')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[1]
            .setValueStateText('Missing Salary.')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[1]
            .focus()
          return false
        } else {
          if (this._bSalaryInputValidity) {
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[1]
              .setValueState('Success')
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[1]
              .setValueStateText(null)
          } else {
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[1]
              .focus()
            return false
            // this.byId('salary_id').focus()
          }
        }
        if (!data.AccountNo) {
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[3]
            .setValueState('Error')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[3]
            .setValueStateText('Missing Account Number')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[3]
            .focus()
          return false
        } else {
          if (this._bAccountInputValidity) {
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[3]
              .setValueState('Success')
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[3]
              .setValueStateText(null)
          } else {
            this.byId('emp_salary')
              .getAggregation('rows')[0]
              .getAggregation('cells')[3]
              .focus()
            return false
          }
        }
        return true
      },

      onChangeMob: function (oEvent) {
        let value = Number(oEvent.getSource().getValue())
        let oSource = oEvent.getSource()
        if (!isNaN(value)) {
          if (value.toString().length < 10) {
            oSource.setValueState('Error')
            oSource.setValueStateText('Mobile Number length must be 10 Digits.')
          } else {
            oEvent.getSource().setValueState('Success')
            oSource.setValueStateText(null)
          }
        }
        // else if(value === ) {
        //     oSource.setValueState('Error')
        //     oSource.setValueStateText('Please Enter Mobile Number')
        // }
        else {
          oSource.setValueState('Error')
          oSource.setValueStateText('Numeric Value Only')
        }
      },
      onChangeSalary: function (oEvent) {
        let pattern = /^\d{1,7}\.\d{2}$/
        let value = Number(oEvent.getSource().getValue())
        let oSource = oEvent.getSource()
        if (isNaN(value)) {
          this._bSalaryInputValidity = false
          oSource.setValueState('Error')
          oSource.setValueStateText('Numeric Value Only')
        } else {
          if (pattern.test(value)) {
            this._bSalaryInputValidity = true
            oEvent.getSource().setValueState('Success')
            oSource.setValueStateText(null)
          } else {
            this._bSalaryInputValidity = false
            oSource.setValueState('Error')
            oSource.setValueStateText('Upto 2 Decimal only')
          }
        }
      },
      onChangeAccount: function (oEvent) {
        let value = Number(oEvent.getSource().getValue())
        let oSource = oEvent.getSource()
        if (!isNaN(value)) {
          if (value.toString().length < 8) {
            this._bAccountInputValidity = false
            oSource.setValueState('Error')
            oSource.setValueStateText('Account Number length must be 8 Digits.')
          } else {
            this._bAccountInputValidity = true
            oEvent.getSource().setValueState('Success')
            oSource.setValueStateText(null)
          }
        } else {
          this._bAccountInputValidity = false
          oSource.setValueState('Error')
          oSource.setValueStateText('Numeric Value Only')
        }
      },
    })
  },
)
