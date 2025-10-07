import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756266575090 implements MigrationInterface {
    name = 'SchemaUpdate1756266575090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "start_date" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "end_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "end_time" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "start_time" TIMESTAMP NOT NULL`);
    }

}
