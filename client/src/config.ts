// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'j11tpumvi3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-m05hd4w48w37l0ay.us.auth0.com',            // Auth0 domain
  clientId: 'o0Cc4nypbELoasaQ1x8ojVdaiZZFZqpe',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
