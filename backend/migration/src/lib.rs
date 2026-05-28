pub use sea_orm_migration::prelude::*;

mod m20260528_000001_create_finance_type;

pub struct Migrator;

#[async_trait::async_trait]
impl MigrationTrait for Migrator {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        m20260528_000001_create_finance_type::Migration.up(manager).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        m20260528_000001_create_finance_type::Migration.down(manager).await
    }
}

impl MigrationName for Migrator {
    fn name(&self) -> &str {
        "m20260528_000001_create_finance_type"
    }
}
