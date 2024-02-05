export const findDocument = async (model, query) => {
  if (!model || !query) {
    return { mes: 'Invalid arguments', status: 400, success: false }
  }
  const isDocumentExists = await model.findOne(query)
  if (!isDocumentExists ) {
    return { mes: 'Document not found', status: 404, success: false }
  }
  return { mes: 'Document found', isDocumentExists, success: true }
}

export const createDocument = async (model, query) => {
  if (!model || !query) {
    return { mes: 'Invalid arguments', status: 400, success: false }
  }
  const CrDocument = await model.create(query)
  if (!CrDocument) {
    return { mes: 'Document Not Created', status: 404, success: false }
  }
  return { mes: 'Document Created', CrDocument, success: true }
}
