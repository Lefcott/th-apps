
  /**
 * Utility to make intercepting graph commands a little more reusable
 */

export const Pick = (route) =>({
  withFixture: (data) => {
    cy.intercept('POST', '/graphql', (req) => {
      if (HasOperationName(req, route)) {
        console.log('___-_-_req_-_-___ :\n\n\n', req, '\n\n');
        req.alias = `${route}`
        req.reply({ fixture: data })
      }
    })
  },
  withData: (body) => {
    cy.intercept('POST', '/graphql', (req) => {
      if (HasOperationName(req, route)) {
        req.alias = `${route}`
        req.reply(body)
      }
    })
  },
  justToAliasAs: (alias) => {
    cy.intercept('POST', '/graphql', (req) => {
      if (HasOperationName(req, route)) {
        req.alias = alias;
      }
    })
  },
  
})

// Utility to match GraphQL mutation based on the operation name
export const HasOperationName = (req, operationName) => {
  const { body } = req
  return (
    body && body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}
