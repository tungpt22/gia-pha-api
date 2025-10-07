import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756266717832 implements MigrationInterface {
    name = 'SchemaUpdate1756266717832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_b82f1d8368dd5305ae7e7e664c" ON "activities" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b82f1d8368dd5305ae7e7e664c"`);
    }

}
