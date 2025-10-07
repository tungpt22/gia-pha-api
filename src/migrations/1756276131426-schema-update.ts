import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756276131426 implements MigrationInterface {
    name = 'SchemaUpdate1756276131426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."relationships_relation_of_from_enum" AS ENUM('Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con')`);
        await queryRunner.query(`CREATE TYPE "public"."relationships_relation_of_to_enum" AS ENUM('Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con')`);
        await queryRunner.query(`CREATE TABLE "relationships" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "relation_of_from" "public"."relationships_relation_of_from_enum" NOT NULL, "relation_of_to" "public"."relationships_relation_of_to_enum" NOT NULL, "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "from_user_id" uuid, "to_user_id" uuid, CONSTRAINT "PK_ba20e2f5cf487408e08e4dcecaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "event_date" date NOT NULL, "location" character varying(255) NOT NULL, "description" text, "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "relationships"`);
        await queryRunner.query(`DROP TYPE "public"."relationships_relation_of_to_enum"`);
        await queryRunner.query(`DROP TYPE "public"."relationships_relation_of_from_enum"`);
    }

}
