import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1760467284898 implements MigrationInterface {
    name = 'InitSchema1760467284898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(255) NOT NULL, "birth_date" date, "last_purchase_at" TIMESTAMP WITH TIME ZONE, "last_purchase_value" numeric(12,2), "status" character varying(10) NOT NULL DEFAULT 'active', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_Customer_Email_unique" ON "customers" ("email") `);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" uuid NOT NULL, "street" character varying(120) NOT NULL, "street_number" character varying(10) NOT NULL, "city" character varying(60) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_address_customer_id" ON "address" ("customer_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying(255) NOT NULL, "role" character varying(10) NOT NULL DEFAULT 'user', "password_hash" character varying(72), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("code" character varying(100) NOT NULL, "description" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8dad765629e83229da6feda1c1d" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role" character varying(10) NOT NULL, "permission_code" character varying(100) NOT NULL, CONSTRAINT "PK_3aa4413f63af45299e7d738fb9f" PRIMARY KEY ("role", "permission_code"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_9c9614b2f9d01665800ea8dbff7" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_aae7df9d481dcdb2dafd1d938c1" FOREIGN KEY ("permission_code") REFERENCES "permissions"("code") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_aae7df9d481dcdb2dafd1d938c1"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_9c9614b2f9d01665800ea8dbff7"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."idx_address_customer_id"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_Customer_Email_unique"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
