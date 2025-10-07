import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1756354237338 implements MigrationInterface {
    name = 'SchemaUpdate1756354237338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationships" ADD CONSTRAINT "UQ_fdf5e7a76c4712417b92c931245" UNIQUE ("from_user_id", "to_user_id", "relation_type")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "relationships" DROP CONSTRAINT "UQ_fdf5e7a76c4712417b92c931245"`);
    }

}
