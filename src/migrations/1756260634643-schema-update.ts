import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756260634643 implements MigrationInterface {
    name = 'SchemaUpdate1756260634643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('Nam', 'Nữ')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'Nam'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    }

}
