import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import {Image} from "./Image";
import {Sound} from "./Sound";
import {Vote} from "./Vote";

@Entity()
export class User {

    @PrimaryColumn()
    public id: string;

    @Column()
    public username: string;

    @Column({nullable: true})
    public avatar: string;

    @Column({default: 1})
    public level: number;

    @Column({default: 0})
    public xp: number;

    @Column({default: new Date()})
    public joinDate: Date;

    @Column({default: 0})
    public soundPlays: number;

    @OneToMany(() => Image, (i) => i.user)
    public images: Image[];

    @OneToMany(() => Sound, (s) => s.user)
    public sounds: Sound[];

    @OneToMany(() => Vote, (v) => v.user)
    public votes: Vote[];

    constructor(u: Partial<User>) {
        Object.assign(this, u);
    }
}
