exports.handler = async function(event, context) {
  console.log('Function executed!');
  console.log('Event:', event);
  console.log('Context:', context);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Netlify Functions!",
      path: event.path,
      httpMethod: event.httpMethod,
      timestamp: new Date().toISOString()
    })
  };
};
