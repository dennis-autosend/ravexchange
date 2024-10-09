exports.handler = async function(event, context) {
  const { path } = event;

  if (path.endsWith('/hello')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello, World!" })
    };
  } else if (path.endsWith('/goodbye')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Goodbye, World!" })
    };
  } else if (path.endsWith('/welcome')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Welcome to the API!" })
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not Found" })
    };
  }

  if (event.httpMethod === 'POST') {
    // Handle POST request
  }
};