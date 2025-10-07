import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756280669001 implements MigrationInterface {
    name = 'SchemaUpdate1756280669001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "url" character varying NOT NULL, "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "album_id" uuid, CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "photos" ADD CONSTRAINT "FK_46e00f649a90c9f5cdcc45c5059" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photos" DROP CONSTRAINT "FK_46e00f649a90c9f5cdcc45c5059"`);
        await queryRunner.query(`DROP TABLE "photos"`);
    }

}
