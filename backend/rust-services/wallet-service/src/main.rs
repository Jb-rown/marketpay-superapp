use axum::{routing::post, Router, Json};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct PaymentRequest {
    user_id: i32,
    amount: f64,
}

#[derive(Serialize)]
struct PaymentResponse {
    status: String,
}

async fn process_payment(Json(payload): Json<PaymentRequest>) -> Json<PaymentResponse> {
    println!("Processing payment for user {} amount {}", payload.user_id, payload.amount);

    Json(PaymentResponse {
        status: "success".to_string(),
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/pay", post(process_payment));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();
    println!("Rust Wallet Service running on port 3001");

    axum::serve(listener, app).await.unwrap();
}