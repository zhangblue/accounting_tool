pub use sea_orm_migration::prelude::*;

mod m20260608_000002_create_classification;
mod m20260608_000003_create_accounts;

pub struct Migrator;

#[async_trait::async_trait]
impl MigrationTrait for Migrator {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        m20260608_000002_create_classification::Migration
            .up(manager)
            .await?;
        m20260608_000003_create_accounts::Migration
            .up(manager)
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        m20260608_000003_create_accounts::Migration
            .down(manager)
            .await?;
        m20260608_000002_create_classification::Migration
            .down(manager)
            .await
    }
}

impl MigrationName for Migrator {
    fn name(&self) -> &str {
        "m"
    }
}
