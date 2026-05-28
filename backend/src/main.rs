use axum::{
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use sea_orm::Database;

#[derive(Serialize, Deserialize)]
struct HealthResponse {
    status: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let db = Database::connect(&database_url).await?;

    // Run migrations using sea-orm-migration
    use sea_orm_migration::{MigrationTrait, SchemaManager};
    let schema_manager = SchemaManager::new(&db);
    migration::Migrator.up(&schema_manager).await.ok();

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/accounts", post(create_account));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
    })
}

async fn create_account() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "message": "Account created" }))
}
