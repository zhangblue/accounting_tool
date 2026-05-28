use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(FinanceType::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(FinanceType::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(FinanceType::Name)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(FinanceType::Type)
                            .integer()
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(FinanceType::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum FinanceType {
    Table,
    Id,
    Name,
    Type,
}
