export const API_ENDPOINTS = {
  loadCustomer: `/sales/loadCustomer`,
  save: `/sales/save`,
  load: `/sales/load`,
  get: `/sales/get`, 
  update: `/sales/update`, 
  remove: `/sales/remove?invoiceNumber={param}`,
  getCustomerDetails: `/sales/getCustomerDetails`,
  removePartId: `/sales/removePartId`,   
  getUnitPrice: `/sales/getUnitPrice`,
  saveReturn: `/sales/saveReturn`,
  loadfilterData: `/sales/loadfilterData`, 
  loadCustomerName: `/sales/loadCustomerName`, 

  ADD_SALES_ORDER_LIST: `/sales/saveSO`,
  UPDATE_SALES_ORDER: `/sales/updateSalesOrder`,
  REMOVE_SALES_ORDER: `/sales/removeSO`,
  GET_SALES_ORDER_LIST: `/sales/loadSO`,
  CREATE_INVOICE:`/sales/createInvoice`,
  loadInvoice: `/sales/loadInvoice`,
  CREATE_RETURN:`/sales/createReturn`,
  lOADRETURN:`/sales/loadReturn`,
  getTemplateDetails: `/sales/getTemplateDetails`,
  addTemplateDetails: `/sales/addTemplateDetails`,

  
  discountload: `/item/discountload`, 
};
