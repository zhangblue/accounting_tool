use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::collections::HashMap;
use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, Condition, QueryFilter};
use rust_decimal::Decimal;
use chrono::NaiveDate;

#[derive(Deserialize)]
pub struct StatisticsQuery {
    #[serde(alias = "startDate")]
    pub start_date: String,
    #[serde(alias = "endDate")]
    pub end_date: String,
}

#[derive(Serialize)]
pub struct StatisticsResponse {
    #[serde(rename = "totalIncome")]
    pub total_income: String,
    #[serde(rename = "totalExpense")]
    pub total_expense: String,
    pub period: String,
}

pub async fn get_statistics_summary(
    State(db): State<Arc<DatabaseConnection>>,
    axum::Json(params): axum::Json<StatisticsQuery>,
) -> Json<StatisticsResponse> {
    use crate::entities::{accounts, classification};

    let start_date = NaiveDate::parse_from_str(&params.start_date, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2020, 1, 1).unwrap())
        .and_hms_opt(0, 0, 0).unwrap();
    let end_date = NaiveDate::parse_from_str(&params.end_date, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2099, 12, 31).unwrap())
        .and_hms_opt(23, 59, 59).unwrap();

    let records = accounts::Entity::find()
        .find_also_related(classification::Entity)
        .filter(
            Condition::all()
                .add(accounts::Column::TradingTime.gte(start_date))
                .add(accounts::Column::TradingTime.lte(end_date))
        )
        .all(db.as_ref())
        .await
        .unwrap_or_default();

    let mut total_income = Decimal::ZERO;
    let mut total_expense = Decimal::ZERO;

    for (account, classification) in records {
        let is_income = classification.as_ref()
            .and_then(|c| c.types)
            .unwrap_or(false);
        let amount = account.amount.unwrap_or(Decimal::ZERO);

        if is_income {
            total_income += amount;
        } else {
            total_expense += amount;
        }
    }

    Json(StatisticsResponse {
        total_income: total_income.to_string(),
        total_expense: total_expense.to_string(),
        period: format!("{} to {}", params.start_date, params.end_date),
    })
}

#[derive(Serialize)]
pub struct ExpenseTypeItem {
    pub name: String,
    pub value: String,
}

#[derive(Serialize)]
pub struct ExpenseTypeResponse {
    pub data: Vec<ExpenseTypeItem>,
}

pub async fn get_expense_by_type(
    State(db): State<Arc<DatabaseConnection>>,
    axum::Json(params): axum::Json<StatisticsQuery>,
) -> Json<ExpenseTypeResponse> {
    use crate::entities::{accounts, classification};

    let start_date = NaiveDate::parse_from_str(&params.start_date, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2020, 1, 1).unwrap())
        .and_hms_opt(0, 0, 0).unwrap();
    let end_date = NaiveDate::parse_from_str(&params.end_date, "%Y-%m-%d")
        .unwrap_or_else(|_| NaiveDate::from_ymd_opt(2099, 12, 31).unwrap())
        .and_hms_opt(23, 59, 59).unwrap();

    let records = accounts::Entity::find()
        .find_also_related(classification::Entity)
        .filter(
            Condition::all()
                .add(accounts::Column::TradingTime.gte(start_date))
                .add(accounts::Column::TradingTime.lte(end_date))
        )
        .all(db.as_ref())
        .await
        .unwrap_or_default();

    let mut expense_map: HashMap<String, Decimal> = HashMap::new();

    for (account, classification) in records {
        if let Some(class) = classification {
            let is_income = class.types.unwrap_or(false);
            if !is_income {
                let amount = account.amount.unwrap_or(Decimal::ZERO);
                let name = class.name.unwrap_or_else(|| "未分类".to_string());
                *expense_map.entry(name).or_insert(Decimal::ZERO) += amount;
            }
        }
    }

    let mut data: Vec<ExpenseTypeItem> = expense_map
        .into_iter()
        .map(|(name, value)| ExpenseTypeItem {
            name,
            value: value.to_string(),
        })
        .collect();

    data.sort_by(|a, b| {
        let a_val = a.value.parse::<f64>().unwrap_or(0.0);
        let b_val = b.value.parse::<f64>().unwrap_or(0.0);
        b_val.partial_cmp(&a_val).unwrap()
    });

    Json(ExpenseTypeResponse { data })
}
