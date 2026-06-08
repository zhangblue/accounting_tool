use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Classification::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Classification::Id)
                            .big_integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Classification::Name)
                            .string()
                            .null(),
                    )
                    .col(
                        ColumnDef::new(Classification::Types)
                            .boolean()
                            .default(false)
                            .null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Classification::Table).to_owned())
            .await
    }
}

#[derive(Iden)]
enum Classification {
    Table,
    Id,
    Name,
    Types,
}
