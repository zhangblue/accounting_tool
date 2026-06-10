mod entities;
mod statistics;

use axum::{
    routing::{get, post},
    Json, Router, extract::{State, Query},
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use sea_orm::{Database, DatabaseConnection, Set, ActiveModelTrait, EntityTrait, QueryOrder, PaginatorTrait, QuerySelect};
use tower_http::cors::CorsLayer;
use rust_decimal::Decimal;

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

#[derive(Deserialize)]
struct TransactionQuery {
    page: Option<i64>,
    page_size: Option<i64>,
}

#[derive(Serialize)]
struct TransactionItem {
    id: i32,
    amount: Decimal,
    trading_time: String,
    description: Option<String>,
    classification_name: Option<String>,
    is_income: bool,
}

#[derive(Serialize)]
struct TransactionResponse {
    data: Vec<TransactionItem>,
    total: u64,
    page: i64,
    page_size: i64,
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
        .route("/api/transactions", get(get_transactions))
        .route("/api/statistics/summary", post(statistics::get_statistics_summary))
        .route("/api/statistics/expense-by-type", post(statistics::get_expense_by_type))
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

async fn get_transactions(
    State(db): State<Arc<DatabaseConnection>>,
    Query(params): Query<TransactionQuery>,
) -> Json<TransactionResponse> {
    use entities::{accounts, classification};

    let page = params.page.unwrap_or(1);
    let page_size = params.page_size.unwrap_or(10);
    let offset = (page - 1) * page_size;

    let items = accounts::Entity::find()
        .find_also_related(classification::Entity)
        .order_by_desc(accounts::Column::TradingTime)
        .offset(offset as u64)
        .limit(page_size as u64)
        .all(db.as_ref())
        .await
        .unwrap_or_default();

    let total = accounts::Entity::find()
        .count(db.as_ref())
        .await
        .unwrap_or(0);

    let data = items
        .into_iter()
        .map(|(account, classification)| {
            let is_income = classification.as_ref().map(|c| c.types.unwrap_or(false)).unwrap_or(false);
            let classification_name = classification.as_ref().and_then(|c| c.name.clone());

            TransactionItem {
                id: account.id,
                amount: account.amount.unwrap_or(Decimal::ZERO),
                trading_time: account.trading_time.to_string(),
                description: account.description,
                classification_name,
                is_income,
            }
        })
        .collect();

    Json(TransactionResponse {
        data,
        total,
        page,
        page_size,
    })
}
