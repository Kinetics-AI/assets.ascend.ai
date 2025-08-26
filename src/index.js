export default {
  async fetch(request, env) {
    let url = new URL(request.url);
    let objectKey = url.pathname.slice(1);

    if (!objectKey) {
      return new Response("R2 Assets Worker", { status: 400 });
    }

    try {
      let object = await env.R2_BUCKET.get(objectKey);
      if (object === null) {
        return new Response("Not Found", { status: 404 });
      }

      let headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, { headers });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  },
};
