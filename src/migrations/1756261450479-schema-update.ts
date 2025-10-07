import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756261450479 implements MigrationInterface {
    name = 'SchemaUpdate1756261450479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "death_day" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "death_day" SET NOT NULL`);
    }

}
