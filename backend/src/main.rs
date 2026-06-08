mod entities;

use axum::{
    routing::{get, post},
    Json, Router, extract::State,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use sea_orm::{Database, DatabaseConnection, Set, ActiveModelTrait};
use tower_http::cors::{CorsLayer, Any};

#[derive(Serialize, Deserialize)]
struct HealthResponse {
    status: String,
}

#[derive(Serialize, Deserialize)]
struct CreateClassificationRequest {
    name: String,
    types: bool,
}

#[derive(Serialize, Deserialize)]
struct CreateClassificationResponse {
    message: String,
    id: Option<i64>,
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

    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/api/accounts", post(create_account))
        .route("/api/classifications", post(create_classification))
        .with_state(Arc::new(db))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
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

async fn create_classification(
    State(db): State<Arc<DatabaseConnection>>,
    Json(payload): Json<CreateClassificationRequest>,
) -> Json<CreateClassificationResponse> {
    let model = entities::classification::ActiveModel {
        name: Set(Some(payload.name)),
        types: Set(Some(payload.types)),
        ..Default::default()
    };

    match model.insert(db.as_ref()).await {
        Ok(result) => Json(CreateClassificationResponse {
            message: "Classification created successfully".to_string(),
            id: Some(result.id),
        }),
        Err(_) => Json(CreateClassificationResponse {
            message: "Failed to create classification".to_string(),
            id: None,
        }),
    }
}
