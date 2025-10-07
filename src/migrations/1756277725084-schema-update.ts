import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756277725084 implements MigrationInterface {
    name = 'SchemaUpdate1756277725084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."finances_type_enum" AS ENUM('Thu', 'Chi')`);
        await queryRunner.query(`CREATE TABLE "finances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."finances_type_enum" NOT NULL, "amount" numeric(15,2) NOT NULL, "finance_date" date NOT NULL, "description" text, "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_dd84717ec8f1c29d8dd8687b6fd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "finances"`);
        await queryRunner.query(`DROP TYPE "public"."finances_type_enum"`);
    }

}
