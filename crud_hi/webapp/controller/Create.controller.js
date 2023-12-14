sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/ui/integration/designtime/baseEditor/validator/IsNumber',
    'sap/ui/core/Core',
    'sap/ui/core/library',
  ],
  function (Controller, JSONModel, MessageBox, IsNumber, Core, CoreLibrary) {
    'use strict'

    var ValueState = CoreLibrary.ValueState
    let empCreateModel
    return Controller.extend('com.crud.hi.crudhi.controller.Create', {
      onInit: function () {
        empCreateModel = new JSONModel()
        let arrEmp = {
          EmpId: '',
          EmpName: '',
          EmpDept: '',
          EmpMob: '',
          EmpGender: '',
          EmpDoj: new Date(),
          itemnav: [
            {
              AccountNo: '',
              Salary: '',
              // Doj: new Date(),
            },
          ],
        }
        empCreateModel.setData(arrEmp)
        this.getView().setModel(empCreateModel, 'createEmp')
        let oRouter = this.getOwnerComponent().getRouter()
        oRouter
          .getRoute('create')
          .attachPatternMatched(this._onObjectMatched, this)

        this.byId('doj_id').setMinDate(
          new Date(new Date().getTime() - 2629800000),
        )
        this.byId('doj_id').setMaxDate(
          new Date(new Date().getTime() + 2629800000),
        )
        this._iEvent = 0
      },
      _onObjectMatched: function () {
        this._resetModel()
      },
      _resetModel: function () {
        empCreateModel.setData({
          EmpId: '',
          EmpName: '',
          EmpDept: '',
          EmpMob: '',
          EmpGender: '',
          EmpDoj: new Date(),
          itemnav: [
            {
              EmpId: '',
              AccountNo: '',
              Salary: '',
              // Doj: new Date(),
            },
          ],
        })
        empCreateModel.refresh()
      },
      // onDoj: function(){},
      onCreate: function (oEvent) {
        let oData = structuredClone(
          this.getView().getModel('createEmp').getData(),
        )
        let oModel = this.getOwnerComponent().getModel()
        let oPayload = {
          EmpId: oData.EmpId,
          EmpName: oData.EmpName,
          EmpDept: oData.EmpDept,
          EmpMob: oData.EmpMob,
          EmpGender: oData.EmpGender,
          EmpDoj: oData.EmpDoj,
          AccountNo: oData.itemnav[0].AccountNo,
          Salary: oData.itemnav[0].Salary,
          // Doj: oData.itemnav[0].Doj,
        }

        let inputValid = this._validateInput(oPayload)
        if (inputValid) {
          let that = this
          oModel.create('/Employee_Emp_HIdSet', oPayload, {
            success: function (msg) {
              that._validateResponse(msg.Message)
              // MessageBox.success('Success')
              that._resetModel()
            },
            error: function (msg) {
              MessageBox.error('Error')
              // var error = JSON.parse(oResponse.responseText).error.message.value
              // MessageBox.error(error)
              // console.log(oResponse)
            },
          })
        }
        oModel.refresh()
      },

      handleChange: function (oEvent) {
        var oText = this.byId('doj_id'),
          oDP = oEvent.getSource(),
          // sValue = oEvent.getParameter('value'),
          bValid = oEvent.getParameter('valid')
        this._iEvent++
        // oText.setValue(
        //   'Change - Event ' +
        //     this._iEvent +
        //     ': DatePicker ' +
        //     oDP.getId() +
        //     ':' +
        //     sValue,
        // )
        if (bValid) {
          oDP.setValueState(ValueState.None)
        } else {
          oDP.setValueState(ValueState.Error)
        }
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
            .getAggregation('cells')[2]
            .setValueState('Error')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[2]
            .setValueStateText('Missing Account Number')
          this.byId('emp_salary')
            .getAggregation('rows')[0]
            .getAggregation('cells')[2]
            .focus()
          return false
        } else {
          if (this._bAccountInputValidity) {
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
              .getAggregation('cells')[2]
              .focus()
            return false
          }
        }
        return true
      },
      _validateResponse: function (msg) {
        if (msg.includes('Created Successfully')) {
          MessageBox.success(msg)
          let EmpID = msg.match(/\d{5}/)[0]
          this.getView().getModel('createEmp').setProperty('/EmpId', EmpID)
          console.log(EmpID)
          let oDataModel = this.getOwnerComponent().getModel()
          oDataModel.refresh(true)
          return
        }
        if (msg === 'Employee Already Exist') {
          MessageBox.error(msg)
          return
        }
        if (msg === 'Employee Id Missing') {
          MessageBox.information(msg)
          return
        }
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
    })
  },
)
