/* tslint:disable */
import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1547010440160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "sound" ("id" character varying NOT NULL, "key" character varying NOT NULL, "filename" character varying NOT NULL, "fileType" character varying NOT NULL, "duration" double precision NOT NULL, "playCount" integer NOT NULL DEFAULT 0, "points" integer NOT NULL DEFAULT 0, "dateUploaded" TIMESTAMP NOT NULL DEFAULT '"2019-01-09T05:07:20.875Z"', "userId" character varying, CONSTRAINT "PK_5549df87118b4f068def7f3ab22" PRIMARY KEY ("id", "key"))`);
        await queryRunner.query(`CREATE TABLE "vote" ("rating" integer NOT NULL, "userId" character varying NOT NULL, "soundId" character varying NOT NULL, "soundKey" character varying NOT NULL, CONSTRAINT "PK_74cce9b8a23231822ceffed701f" PRIMARY KEY ("userId", "soundId", "soundKey"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "username" character varying NOT NULL, "avatar" character varying, "level" integer NOT NULL DEFAULT 1, "xp" integer NOT NULL DEFAULT 0, "joinDate" TIMESTAMP NOT NULL DEFAULT '"2019-01-09T05:07:20.877Z"', "soundPlays" integer NOT NULL DEFAULT 0, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image" ("id" character varying NOT NULL, "key" character varying NOT NULL, "filename" character varying NOT NULL, "fileType" character varying NOT NULL, "displayCount" integer NOT NULL DEFAULT 0, "dateUploaded" TIMESTAMP NOT NULL DEFAULT '"2019-01-09T05:07:20.877Z"', "userId" character varying, CONSTRAINT "PK_55c0f740a70dfd58b6ad81fbb11" PRIMARY KEY ("id", "key"))`);
        await queryRunner.query(`ALTER TABLE "sound" ADD CONSTRAINT "FK_0d7f8a5e28fbdae85b1f554d99a" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_f5de237a438d298031d11a57c3b" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_4e5de41a1982bff69230d408bce" FOREIGN KEY ("soundId", "soundKey") REFERENCES "sound"("id","key")`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_dc40417dfa0c7fbd70b8eb880cc" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_dc40417dfa0c7fbd70b8eb880cc"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_4e5de41a1982bff69230d408bce"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_f5de237a438d298031d11a57c3b"`);
        await queryRunner.query(`ALTER TABLE "sound" DROP CONSTRAINT "FK_0d7f8a5e28fbdae85b1f554d99a"`);
        await queryRunner.query(`DROP TABLE "image"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`DROP TABLE "sound"`);
    }

}
