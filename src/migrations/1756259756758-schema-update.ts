import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756259756758 implements MigrationInterface {
    name = 'SchemaUpdate1756259756758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'member', 'guest')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'member', "email" character varying, "phone_number" character varying, "address" character varying, "birthday" date NOT NULL, "death_day" date NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "profile_img" character varying, "created_dt" TIMESTAMP NOT NULL DEFAULT now(), "updated_dt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
