use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Accounts::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Accounts::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Accounts::Amount)
                            .decimal_len(16, 2)
                            .null(),
                    )
                    .col(
                        ColumnDef::new(Accounts::SelfAccount)
                            .string_len(19)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Accounts::TradingTime)
                            .timestamp()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Accounts::ClassificationId)
                            .big_integer()
                            .not_null(),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_classification_accounts")
                            .from(Accounts::Table, Accounts::ClassificationId)
                            .to(Classification::Table, Classification::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_classification_id")
                    .table(Accounts::Table)
                    .col(Accounts::ClassificationId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Accounts::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum Accounts {
    Table,
    Id,
    Amount,
    SelfAccount,
    TradingTime,
    ClassificationId,
}

#[derive(Iden)]
enum Classification {
    Table,
    Id,
}
