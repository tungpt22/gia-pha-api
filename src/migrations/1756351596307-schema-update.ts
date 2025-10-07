import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756351596307 implements MigrationInterface {
    name = 'SchemaUpdate1756351596307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "content" text NOT NULL, "thumbnail" character varying(500), "is_publish" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."awards_status_enum" AS ENUM('Đã duyệt', 'Chờ duyệt', 'Từ chối')`);
        await queryRunner.query(`CREATE TABLE "awards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "amount" numeric(12,2), "other_reward" character varying(255), "status" "public"."awards_status_enum" NOT NULL DEFAULT 'Chờ duyệt', "award_date" date, "file_attachment" character varying(500), "is_highlight" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_bc3f6adc548ff46c76c03e06377" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "relationships" DROP COLUMN "relation_of_from"`);
        await queryRunner.query(`DROP TYPE "public"."relationships_relation_of_from_enum"`);
        await queryRunner.query(`ALTER TABLE "relationships" DROP COLUMN "relation_of_to"`);
        await queryRunner.query(`DROP TYPE "public"."relationships_relation_of_to_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."relationships_relation_type_enum" AS ENUM('Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con')`);
        await queryRunner.query(`ALTER TABLE "relationships" ADD "relation_type" "public"."relationships_relation_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "awards" ADD CONSTRAINT "FK_8253d91f32139e6de3184cb6e19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "awards" DROP CONSTRAINT "FK_8253d91f32139e6de3184cb6e19"`);
        await queryRunner.query(`ALTER TABLE "relationships" DROP COLUMN "relation_type"`);
        await queryRunner.query(`DROP TYPE "public"."relationships_relation_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."relationships_relation_of_to_enum" AS ENUM('Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con')`);
        await queryRunner.query(`ALTER TABLE "relationships" ADD "relation_of_to" "public"."relationships_relation_of_to_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."relationships_relation_of_from_enum" AS ENUM('Bố', 'Mẹ', 'Vợ', 'Chồng', 'Con')`);
        await queryRunner.query(`ALTER TABLE "relationships" ADD "relation_of_from" "public"."relationships_relation_of_from_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "awards"`);
        await queryRunner.query(`DROP TYPE "public"."awards_status_enum"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
