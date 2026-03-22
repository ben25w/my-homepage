const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestPatch(context) {
  try {
    const id = context.params.id;
    const { title, url, description } = await context.request.json();
    if (!title || !url) {
      return new Response(JSON.stringify({ error: "title and url are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await context.env.DB.prepare(
      "UPDATE links SET title = ?, url = ?, description = ? WHERE id = ?"
    )
      .bind(title, url, description || "", id)
      .run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete(context) {
  try {
    const id = context.params.id;
    await context.env.DB.prepare("DELETE FROM links WHERE id = ?")
      .bind(id)
      .run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
