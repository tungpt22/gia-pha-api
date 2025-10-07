import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756266415691 implements MigrationInterface {
    name = 'SchemaUpdate1756266415691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP, "description" character varying(255) NOT NULL, "position" character varying(255), "reward" character varying(255), "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "activities"`);
    }

}
