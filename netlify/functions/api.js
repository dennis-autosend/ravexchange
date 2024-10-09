exports.handler = async function(event, context) {
  const { path } = event;

  if (path === '/.netlify/functions/api/hello') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello, World!" })
    };
  } else if (path === '/.netlify/functions/api/goodbye') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Goodbye, World!" })
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Not Found" })
    };
  }
};
