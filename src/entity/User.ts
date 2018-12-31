import { Column, Entity, Index, ManyToOne, PrimaryColumn, OneToMany } from "typeorm";
import {Image} from "./Image";
import {Sound} from "./Sound";
import {Vote} from "./Vote";

@Entity()
export class User {

    @PrimaryColumn()
    public id: string;

    @Column()
    public username: string;

    @Column()
    public avatar: string;

    @Column()
    public level: number;

    @Column()
    public xp: number;

    @Column()
    public joinDate: Date

    @Column()
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