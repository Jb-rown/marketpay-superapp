use axum::{routing::get, Router};

async fn hello() -> &'static str {
    "Wallet Service Running 🚀"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}