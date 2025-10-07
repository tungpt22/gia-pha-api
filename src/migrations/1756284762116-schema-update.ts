import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756284762116 implements MigrationInterface {
    name = 'SchemaUpdate1756284762116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photos" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photos" DROP COLUMN "description"`);
    }

}
