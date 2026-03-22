const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT id, title, url, description, created_at FROM links ORDER BY id ASC"
    ).all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context) {
  try {
    const { title, url, description } = await context.request.json();
    if (!title || !url) {
      return new Response(JSON.stringify({ error: "title and url are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const row = await context.env.DB.prepare(
      "INSERT INTO links (title, url, description) VALUES (?, ?, ?) RETURNING id"
    )
      .bind(title, url, description || "")
      .first();
    return new Response(JSON.stringify({ id: row.id }), {
      status: 201,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
